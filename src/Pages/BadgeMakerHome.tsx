import React, { useState, useRef, useEffect } from "react";
import { Stack, Button, Fade, Typography, LinearProgress } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Badge, { badgeProps } from "../Components/Badge";
import ExcelInput from "../Components/ExcelInput";
import Papa from "papaparse";
import { toBlob } from "html-to-image";
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = window.innerWidth > 768;

  // reset refs whenever data changes
  useEffect(() => {
    exportRefs.current = [];
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

  // non-blocking, chunked PDF export with CORS-safe font link handling
  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // // Temporarily remove Google Fonts links to avoid CORS cssRules errors
    // const head = document.head;
    // const removedLinks: Array<{
    //   link: HTMLLinkElement;
    //   next: ChildNode | null;
    // }> = [];
    // head
    //   .querySelectorAll('link[href*="fonts.googleapis.com"]')
    //   .forEach((node) => {
    //     if (node instanceof HTMLLinkElement) {
    //       removedLinks.push({ link: node, next: node.nextSibling });
    //       head.removeChild(node);
    //     }
    //   });

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [660, 350],
    });

    try {
      for (let i = 0; i < exportRefs.current.length; i++) {
        const node = exportRefs.current[i];
        if (!node) continue;
        try {
          const blob = await toBlob(node, { pixelRatio: 2 });
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(blob!);
          });

          if (i > 0) doc.addPage();
          doc.addImage(dataUrl, "PNG", 0, 0, 660, 350);
        } catch (err) {
          console.error("Snapshot failed", err);
        }

        setExportProgress(
          Math.round(((i + 1) / exportRefs.current.length) * 100)
        );
        // yield to browser
        await new Promise((r) => setTimeout(r, 0));
      }

      doc.save("badges.pdf");
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      // Restore removed font links
      // removedLinks.forEach(({ link, next }) => {
      //   head.insertBefore(link, next);
      // });
      setIsExporting(false);
    }
  };

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
        {/* Top controls */}
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
        <Fade in={isExporting}>
          <Stack width="80%" maxWidth="600px">
            <Typography align="center">Exporting {exportProgress}%</Typography>
            <LinearProgress variant="determinate" value={exportProgress} />
          </Stack>
        </Fade>
        {/* Virtualized Preview */}
        {badgesData?.map((item, index) => (
          <Fade key={index} in={generate}>
            <div
              style={{
                display: generate ? "block" : "none",
                scale: isDesktop ? "1" : "0.5",
              }}
            >
              <Badge
                preview={!generate} // When not in export mode, use preview mode settings.
                role={item.role}
                name={item.name}
              />
            </div>
          </Fade>
        ))}

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

      {/* Export Progress */}

      {/* Off-screen Export Container */}
      {generate && (
        <div
          style={{
            position: "fixed",
            top: -10000,
            left: -10000,
            width: 660,
            height: 350,
          }}
        >
          {badgesData.map((item, i) => (
            <div key={i} ref={(el) => (exportRefs.current[i] = el)}>
              <Badge preview={false} role={item.role} name={item.name} />
            </div>
          ))}
        </div>
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
