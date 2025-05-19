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
import * as BadgeVariants from "../Components/BadgeVariants/2025";
import type { badgeProps } from "../Components/BadgeVariants/2025";
import ExcelInput from "../Components/ExcelInput";
import Papa from "papaparse";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import Logo from "../Components/Logo";
import IOSLoader from "../Components/IOSLoader";
import "../Styles/BadgeMakerMain.css";

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

  const handleChange = (_: any, newMode: "csv" | "manual") => {
    setDataInputMode(newMode);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setPdfBlobUrl(null);

    const head = document.head;
    const removed: Array<{ link: HTMLLinkElement; next: ChildNode | null }> =
      [];
    head
      .querySelectorAll('link[href*="fonts.googleapis.com"]')
      .forEach((node) => {
        if (node instanceof HTMLLinkElement) {
          removed.push({ link: node, next: node.nextSibling });
          head.removeChild(node);
        }
      });

    // Get dimensions for the selected badge variant
    const { width, height } =
      variantDimensions[badgeVariant - 1] || variantDimensions[0];

    const doc = new jsPDF({
      orientation: isDesktop ? "landscape" : "portrait",
      unit: "px",
      format: [width, height],
    });

    try {
      for (let i = 0; i < exportRefs.current.length; i++) {
        const node = exportRefs.current[i];
        if (!node) continue;

        // ensure images have loaded
        await new Promise((r) => setTimeout(r, 100));

        // full-size, CORS-enabled snapshot without CSS scale
        const canvas = await toCanvas(node, {
          pixelRatio: 2,
          useCORS: true,
          cacheBust: true,
          width, // from variantDimensions
          height, // from variantDimensions
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
          },
        });

        if (i > 0) doc.addPage();
        doc.addImage(canvas, "JPEG", 0, 0, width, height);

        setExportProgress(
          Math.round(((i + 1) / exportRefs.current.length) * 100)
        );
        await new Promise((r) => setTimeout(r, 0));
      }

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(url);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "badges.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      removed.forEach(({ link, next }) => {
        head.insertBefore(link, next);
      });
      setIsExporting(false);

      if (pdfBlobUrl) setTimeout(() => URL.revokeObjectURL(pdfBlobUrl), 60000);
    }
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
                {badgesData.map((item, index) => {
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
                        scale: isDesktop ? 1 : 0.5,
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
