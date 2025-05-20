import React, { useState, useRef, useEffect } from "react";
import {
  Stack,
  Button,
  Fade,
  Typography,
  LinearProgress,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import * as BadgeVariants from "@components/BadgeVariants/2025/index";
import type { badgeProps } from "@components/BadgeVariants/2025/index";
import ExcelInput from "@components/ExcelInput";
import Papa from "papaparse";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import Logo from "@components/Logo";
import IOSLoader from "@components/IOSLoader";
import "@styles/BadgeMakerMain.css";

// Helper function to fetch Google Fonts CSS
async function getGoogleFontsCss(): Promise<string> {
  const fontLinks: HTMLLinkElement[] = [];
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (
      link instanceof HTMLLinkElement &&
      link.href.includes("fonts.googleapis.com")
    ) {
      fontLinks.push(link);
    }
  });

  let allFontCss = "";
  for (const link of fontLinks) {
    try {
      const url = new URL(link.href);
      // Adding a cache-busting param can be helpful sometimes, though not strictly necessary for Google Fonts
      url.searchParams.append("_cb", Date.now().toString());

      const response = await fetch(url.toString(), { mode: "cors" });
      if (response.ok) {
        const cssText = await response.text();
        allFontCss += cssText + "\n";
      } else {
        console.warn(
          `Failed to fetch font CSS: ${link.href}, status: ${response.status}`
        );
      }
    } catch (error) {
      console.warn(`Error fetching font CSS: ${link.href}`, error);
    }
  }
  return allFontCss;
}

export type RowData = { col1: string; col2: string };

function Home() {
  const [csvFile, setCSV] = useState<FileList | null>(null);
  const [badgesData, setBadgesData] = useState<badgeProps[]>([]);
  const [rows, setRows] = useState<RowData[]>([{ col1: "", col2: "" }]);
  const [generate, setGenerate] = useState(false);
  const [dataInputMode, setDataInputMode] = useState<"csv" | "manual">(
    "manual"
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const pdfWorkerRef = useRef<Worker | null>(null);

  const [badgeVariant, setBadgeVariant] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  const variantComponents: React.ComponentType<badgeProps>[] = Object.values(
    BadgeVariants
  ) as React.ComponentType<badgeProps>[];
  const isDesktop = window.innerWidth > 768;

  // Add this mapping for badge dimensions (update as needed for each variant)
  const variantDimensions = [
    { width: 660, height: 350 }, // CarPass
    { width: 660, height: 350 }, // Badge
    { width: 660, height: 400 }, // Shura (example: adjust if needed)
  ];

  useEffect(() => {
    if (!csvFile) {
      setBadgesData([]);
      return;
    }
    const file = csvFile[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const data = (results.data as any[]).map((row) => ({
          role: row["Role"] || row["role"] || "",
          name: row["Name"] || row["name"] || "",
        }));
        setBadgesData(data);
      },
      error: console.error,
    });
  }, [csvFile]);

  // 1) chunked render effect
  useEffect(() => {
    if (!generate) return;
    const batchSize = 20;
    setVisibleCount(0);
    const schedule = () => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + batchSize, badgesData.length);
        if (next < badgesData.length) setTimeout(schedule, 0);
        return next;
      });
    };
    schedule();
  }, [generate, badgesData]);

  const handleChange = (_: any, newMode: "csv" | "manual") => {
    setDataInputMode(newMode);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setPdfBlobUrl(null);

    // Fetch Google Fonts CSS content
    const googleFontsCss = await getGoogleFontsCss();

    // capture canvases → dataURLs
    const { width, height } =
      variantDimensions[badgeVariant - 1] || variantDimensions[0];
    const images: string[] = [];
    for (let i = 0; i < exportRefs.current.length; i++) {
      const node = exportRefs.current[i];
      if (!node) continue;
      await new Promise((r) => setTimeout(r, 50));
      const canvas = await toCanvas(node, {
        pixelRatio: 2,
        cacheBust: true,
        width,
        height,
        style: { transform: "scale(1)", transformOrigin: "top left" },
        fontEmbedCSS: googleFontsCss, // Pass fetched font CSS here
      });
      images.push(canvas.toDataURL("image/jpeg", 1));
      setExportProgress(Math.round(((i + 1) / exportRefs.current.length) * 50));
    }

    // spawn worker
    pdfWorkerRef.current = new Worker(
      new URL("../workers/pdfWorker.ts", import.meta.url),
      { type: "module" }
    );
    pdfWorkerRef.current.onmessage = (e) => {
      const { pdfBlob, progress } = e.data;
      if (progress != null) {
        setExportProgress(50 + Math.round(progress * 0.5));
      }
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(url);
        setIsExporting(false);
        // trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = "badges.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    };
    // send all data to worker
    pdfWorkerRef.current.postMessage({
      images,
      width,
      height,
      orientation: isDesktop ? "landscape" : "portrait",
    });
  };

  const previewHeight = window.innerHeight * (isDesktop ? 0.7 : 0.5);

  const variantNames = Object.keys(BadgeVariants);

  const variantLabels = [
    {
      col1: "License Number",
      col2: "Pass Level",
      placeholder1: "XTCAS-ASD1A",
      placeholder2: "1 | 2",
    },
    {
      col1: "Role",
      col2: "Name",
      placeholder1: "Nazim Jalsa Food",
      placeholder2: "John Doom",
    },
    {
      col1: "Role",
      col2: "Name",
      placeholder1: "Sadar Jamat Utrecht",
      placeholder2: "John Elden",
    },
  ];

  return (
    <Stack
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Stack
        width="100%"
        gap={2}
        alignItems="center"
        mt={generate ? "2vh" : "25vh"}
        sx={{ transition: "all .3s ease-in-out" }}
      >
        <Stack
          direction="row"
          width="100%"
          maxWidth="600px"
          justifyContent={generate ? "space-between" : "center"}
          alignItems="center"
        >
          <Fade in={generate}>
            <Button
              color="primary"
              onClick={() => {
                setBadgesData([]);
                setGenerate(false);
                setCSV(null);
                setExportProgress(0);
                setPdfBlobUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              sx={{
                display: generate ? "flex" : "none",
              }}
            >
              Reset
            </Button>
          </Fade>

          <Logo logoName="Badge" URL="/sheru/appLibrary/BadgeMaker" />

          <Fade in={generate}>
            <Button
              loading={isExporting}
              loadingIndicator={<IOSLoader />}
              color="secondary"
              onClick={() => {
                if (!pdfBlobUrl) {
                  handleExportPDF();
                } else {
                  const link = document.createElement("a");
                  link.href = pdfBlobUrl;
                  link.download = "badges.pdf";
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                }
              }}
              sx={{
                display: generate ? "flex" : "none",
              }}
            >
              {isExporting
                ? "Processing..."
                : pdfBlobUrl
                  ? "Download PDF"
                  : "Export PDF"}
            </Button>
          </Fade>
        </Stack>

        <Fade in={isExporting}>
          <Stack width="80%" maxWidth="600px">
            <Typography align="center">Exporting {exportProgress}%</Typography>
            <LinearProgress variant="determinate" value={exportProgress} />
          </Stack>
        </Fade>

        {generate && (
          <Fade in={generate}>
            <Box
              sx={{
                width: "fit-content",
                display: generate ? "flex" : "none",
              }}
              px={1}
            >
              <Stack gap={2} alignItems="center">
                {(badgesData.slice(0, visibleCount)).map((item, index) => {
                  if (!item.role || !item.name) return null;
                  if (item.role === "" || item.name === "") return null;
                  const Variant =
                    variantComponents[badgeVariant - 1] || variantComponents[0];
                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        exportRefs.current[index] = el;
                      }}
                      style={{
                        // use real CSS transform instead of `scale` prop
                        transform: isDesktop ? "none" : "scale(0.5)",
                        transformOrigin: "top left",
                      }}
                    >
                      <Variant role={item.role} name={item.name} preview />
                    </div>
                  );
                })}
              </Stack>
            </Box>
          </Fade>
        )}

        <Fade in={!generate}>
          <Stack gap={2}>
            <ToggleButtonGroup
              color="primary"
              value={dataInputMode}
              exclusive
              onChange={handleChange}
              aria-label="inputMode"
              sx={{
                display: generate ? "none" : "flex",
              }}
            >
              <ToggleButton value="csv">Upload CSV</ToggleButton>
              <ToggleButton value="manual">Manual Data</ToggleButton>
            </ToggleButtonGroup>

            <FormControl fullWidth>
              <InputLabel>Badge Variant</InputLabel>
              <Select
                size="small"
                value={badgeVariant}
                label="Badge Variant"
                onChange={(e) => {
                  setBadgeVariant(Number(e.target.value));
                }}
              >
                {variantNames.map((variantName, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {variantName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Fade>
      </Stack>

      <Fade in={!generate}>
        <Stack
          gap={2}
          maxWidth="600px"
          sx={{
            display: generate ? "none" : "flex",
          }}
        >
          {dataInputMode === "manual" && (
            <ExcelInput
              rows={rows}
              setRows={setRows}
              labels={variantLabels[badgeVariant - 1] || variantLabels[0]}
            />
          )}
          {dataInputMode === "csv" && (
            <Stack gap={2}>
              <Typography variant="h6" align="center">
                <strong>Upload a CSV file</strong>
              </Typography>
              {badgeVariant === 2 ? (
                <Typography
                  sx={{
                    backgroundColor: "background.paper",
                    padding: "1rem",
                    borderRadius: "4px",
                    fontWeight: 200,
                  }}
                  variant="h6"
                >
                  Role,Name
                  <br />
                  Manager,John Doe
                  <br />
                  Developer,Jane Smith
                  <br />
                  Designer,Emily Johnson
                </Typography>
              ) : (
                <Typography
                  sx={{
                    backgroundColor: "background.paper",
                    padding: "1rem",
                    borderRadius: "4px",
                    fontWeight: 200,
                  }}
                  variant="h6"
                >
                  CarNumber,PassLevel
                  <br />
                  XTC-ASDASD-12,1
                  <br />
                  XTC-ASDASD,2
                  <br />
                  <strong>Note!</strong>
                  <br />1 = Standard Entry
                  <br />2 = Complete Access
                </Typography>
              )}

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload CSV
                <VisuallyHiddenInput
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setCSV(e.target.files)}
                />
              </Button>
            </Stack>
          )}

          <Button
            color="secondary"
            disabled={
              dataInputMode === "csv"
                ? !csvFile
                : rows[0].col1 === "" && rows[0].col2 === ""
            }
            onClick={() => {
              if (csvFile) {
                setGenerate(true);
              } else {
                setBadgesData(
                  rows.slice(0, -1).map((r) => ({ role: r.col1, name: r.col2 }))
                );
                setGenerate(true);
              }
            }}
          >
            Generate Badges
          </Button>
        </Stack>
      </Fade>
    </Stack>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  width: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
});

export default Home;
