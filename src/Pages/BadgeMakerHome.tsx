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
import Badge, { badgeProps } from "../Components/BadgeVariants/2025/Badge";
import ExcelInput from "../Components/ExcelInput";
import Papa from "papaparse";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import Logo from "../Components/Logo";
import IOSLoader from "../Components/IOSLoader";
import "../Styles/BadgeMakerMain.css";
import CarPass from "../Components/BadgeVariants/2025/CarPass";

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
  // 1 = car pass, 2 = badge
  const [badgeVariant, setBadgeVariant] = useState<Number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = window.innerWidth > 768;

  // parse CSV into badgesData
  useEffect(() => {
    if (!csvFile) {
      setBadgesData([]);
      return;
    }
    const file = csvFile[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(), // ← trim whitespace from " name"
      complete: (results) => {
        const data = (results.data as any[]).map((row) => ({
          role: row["Role"] || row["role"] || "",
          name: row["Name"] || row["name"] || "", // now "name" will exist
        }));
        setBadgesData(data);
      },
      error: console.error,
    });
  }, [csvFile]);

  const handleChange = (_: any, newMode: "csv" | "manual") => {
    setDataInputMode(newMode);
  };

  // non-blocking, chunked PDF export using canvas directly to avoid huge Base64 strings
  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setPdfBlobUrl(null);

    // Remove Google Fonts link nodes to avoid CORS/cssRules issues during snapshot
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

    const doc = new jsPDF({
      orientation: isDesktop ? "landscape" : "portrait",
      unit: "px",
      format: [660, 350],
    });

    try {
      for (let i = 0; i < exportRefs.current.length; i++) {
        const node = exportRefs.current[i];
        if (!node) continue;
        try {
          // snapshot DOM to offscreen canvas at 2x resolution for crispness
          const canvas = await toCanvas(node, { pixelRatio: 2 });
          if (i > 0) doc.addPage();
          doc.addImage(canvas, "JPEG", 0, 0, 660, 350);
        } catch (err) {
          console.error("Canvas snapshot failed", err);
        }

        // update progress and yield to event loop
        setExportProgress(
          Math.round(((i + 1) / exportRefs.current.length) * 100)
        );
        await new Promise((r) => setTimeout(r, 0));
      }

      // generate blob PDF and trigger download
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
      // restore removed font links
      removed.forEach(({ link, next }) => {
        head.insertBefore(link, next);
      });
      setIsExporting(false);
      // revoke after a minute
      if (pdfBlobUrl) setTimeout(() => URL.revokeObjectURL(pdfBlobUrl), 60000);
    }
  };

  // preview height based on device
  const previewHeight = window.innerHeight * (isDesktop ? 0.7 : 0.5);

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
        {/* Top Controls */}
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

        {/* Progress Indicator */}
        <Fade in={isExporting}>
          <Stack width="80%" maxWidth="600px">
            <Typography align="center">Exporting {exportProgress}%</Typography>
            <LinearProgress variant="determinate" value={exportProgress} />
          </Stack>
        </Fade>

        {/* Preview & Off-screen Rendering */}
        {generate && (
          <Fade in={generate}>
            <Box
              style={{
                height: "88vh",
                width: "fit-content",
                overflowY: "auto",
                display: generate ? "flex" : "none",
              }}
              px={1}
            >
              <Stack gap={2} alignItems="center">
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "50vh",
                    pointerEvents: "none",
                    background: "linear-gradient(transparent, black)",
                  }}
                />
                {badgesData.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => (exportRefs.current[index] = el)}
                  >
                    {badgeVariant === 1 ? (
                      <CarPass role={item.role} name={item.name} preview />
                    ) : (
                      <Badge role={item.role} name={item.name} preview />
                    )}
                  </div>
                ))}
              </Stack>
            </Box>
          </Fade>
        )}

        {/* Input Mode Toggle */}
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
                <MenuItem value={1}>Car Pass</MenuItem>
                <MenuItem value={2}>Standard Badge</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Fade>
      </Stack>

      {/* Data Input Section */}
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
              badgeVariant={badgeVariant}
              rows={rows}
              setRows={setRows}
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
