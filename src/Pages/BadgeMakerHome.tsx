import React, { useState, useRef, useEffect } from "react";
import { Stack, Button, Fade, Typography, LinearProgress } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Badge, { badgeProps } from "../Components/Badge";
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
  const [dataInputMode, setDataInputMode] = useState<"csv" | "manual">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = window.innerWidth > 768;

  // reset refs & clear previous PDF URL when badgesData changes
  useEffect(() => {
    exportRefs.current = [];
    setPdfBlobUrl(null);
  }, [badgesData]);

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
          doc.addImage(canvas, "PNG", 0, 0, 660, 350);
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
              onClick={handleExportPDF}
            >
              Export PDF
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
            <div
              style={{
                height: previewHeight,
                width: "100%",
                overflowY: "auto",
              }}
            >
              <Stack gap={2} alignItems="center">
                {badgesData.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => (exportRefs.current[index] = el)}
                  >
                    <Badge preview role={item.role} name={item.name} />
                  </div>
                ))}
              </Stack>
            </div>
          </Fade>
        )}

        {/* Input Mode Toggle */}
        <Fade in={!generate}>
          <ToggleButtonGroup
            color="primary"
            value={dataInputMode}
            exclusive
            onChange={handleChange}
            aria-label="inputMode"
          >
            <ToggleButton value="csv">Upload CSV</ToggleButton>
            <ToggleButton value="manual">Manual Data</ToggleButton>
          </ToggleButtonGroup>
        </Fade>
      </Stack>

      {/* Data Input Section */}
      <Fade in={!generate}>
        <Stack gap={1} maxWidth="600px">
          {dataInputMode === "manual" && (
            <ExcelInput rows={rows} setRows={setRows} />
          )}
          {dataInputMode === "csv" && (
            <Stack gap={1}>
              <Typography variant="body1">
                <strong>Upload a CSV file:</strong>
              </Typography>
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

      {/* Download Button Fallback */}
      {!isExporting && pdfBlobUrl && (
        <Fade in={!isExporting}>
          <Button
            variant="contained"
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfBlobUrl;
              link.download = "badges.pdf";
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            Download PDF
          </Button>
        </Fade>
      )}
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
