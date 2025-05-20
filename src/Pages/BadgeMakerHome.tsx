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
import Logo from "@components/Logo";
import IOSLoader from "@components/IOSLoader";
import "@styles/BadgeMakerMain.css";

/* ------------------------------------------------------------------ */
/* Util: build one big CSS string that inlines _all_ Google Fonts     */
/* ------------------------------------------------------------------ */

const fontCache: { css?: string } = {};

async function getInlineGoogleFontsCss(): Promise<string> {
  if (fontCache.css) return fontCache.css; // ⏪  already built once

  const googleLinks = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  ).filter((l) => l.href.includes("fonts.googleapis.com"));

  let finalCss = "";

  for (const sheet of googleLinks) {
    // add a cache-buster so we never get a 304 from the normal browser cache
    const url = new URL(sheet.href);
    url.searchParams.set("_cb", Date.now().toString());

    const cssText = await (await fetch(url.toString(), { mode: "cors" })).text();

    /* example Google Fonts rule -------------------------------------
       @font-face {
          font-family:"Roboto Condensed";
          font-style:normal;
          font-weight:400;
          src: url(https://fonts.gstatic.com/.../ieVl2ZhZ...woff2) format("woff2");
       }
    -----------------------------------------------------------------*/
    const urlRegex = /url\((https:\/\/[^\)]+)\)/g;
    let replacedCss = cssText;
    const promises: Promise<void>[] = [];

    replacedCss.replace(urlRegex, (_, remoteUrl) => {
      const p = fetch(remoteUrl, { mode: "cors" })
        .then((r) => r.arrayBuffer())
        .then((buf) => {
          const mime =
            remoteUrl.endsWith(".woff2")
              ? "font/woff2"
              : remoteUrl.endsWith(".woff")
              ? "font/woff"
              : "application/octet-stream";

          const b64 = btoa(
            String.fromCharCode(...new Uint8Array(buf))
          );
          replacedCss = replacedCss.replace(
            remoteUrl,
            `data:${mime};base64,${b64}`
          );
        })
        .catch((err) =>
          console.warn("Failed to inline font", remoteUrl, err)
        );
      promises.push(p);
      return remoteUrl;
    });

    await Promise.all(promises);
    finalCss += replacedCss + "\n";
  }

  /* cache for subsequent exports in this tab ----------------------- */
  fontCache.css = finalCss;
  return finalCss;
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type RowData = { col1: string; col2: string };

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

function Home() {
  const [csvFile, setCSV] = useState<FileList | null>(null);
  const [badgesData, setBadgesData] = useState<badgeProps[]>([]);
  const [rows, setRows] = useState<RowData[]>([{ col1: "", col2: "" }]);
  const [generate, setGenerate] = useState(false);
  const [dataInputMode, setDataInputMode] =
    useState<"csv" | "manual">("manual");

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const pdfWorkerRef = useRef<Worker | null>(null);

  const [badgeVariant, setBadgeVariant] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  const variantComponents: React.ComponentType<badgeProps>[] =
    Object.values(BadgeVariants) as React.ComponentType<badgeProps>[];

  const isDesktop = window.innerWidth > 768;

  const variantDimensions = [
    { width: 660, height: 350 },
    { width: 660, height: 350 },
    { width: 660, height: 400 },
  ];

  /* ---------------- CSV parsing ----------------------------------- */
  useEffect(() => {
    if (!csvFile) return setBadgesData([]);

    Papa.parse(csvFile[0], {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: ({ data }) =>
        setBadgesData(
          (data as any[]).map((r) => ({
            role: r["Role"] || r["role"] || "",
            name: r["Name"] || r["name"] || "",
          }))
        ),
      error: console.error,
    });
  }, [csvFile]);

  /* ------------- progressive render ------------------------------- */
  useEffect(() => {
    if (!generate) return;

    const batch = 20;
    setVisibleCount(0);

    const step = () =>
      setVisibleCount((prev) => {
        const next = Math.min(prev + batch, badgesData.length);
        if (next < badgesData.length) requestAnimationFrame(step);
        return next;
      });

    step();
  }, [generate, badgesData]);

  /* ------------- event handlers ----------------------------------- */
  const handleMode = (_: unknown, m: "csv" | "manual") => setDataInputMode(m);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setPdfBlobUrl(null);

    await document.fonts.ready;
    const inlineCss = await getInlineGoogleFontsCss();

    const { width, height } =
      variantDimensions[badgeVariant - 1] ?? variantDimensions[0];

    const images: string[] = [];

    for (let i = 0; i < exportRefs.current.length; i++) {
      const node = exportRefs.current[i];
      if (!node) continue;

      const canvas = await toCanvas(node, {
        pixelRatio: 2,
        width,
        height,
        cacheBust: true,
        backgroundColor: "#ffffff",
        fontEmbedCSS: inlineCss, // 👉 base64-inlined fonts
      });

      images.push(canvas.toDataURL("image/jpeg", 1));
      setExportProgress(Math.round(((i + 1) / exportRefs.current.length) * 50));
    }

    /* worker ------------------------------------------------------- */
    pdfWorkerRef.current = new Worker(
      new URL("../workers/pdfWorker.ts", import.meta.url),
      { type: "module" }
    );

    pdfWorkerRef.current.onmessage = ({ data }) => {
      const { pdfBlob, progress } = data;
      if (progress !== undefined)
        setExportProgress(50 + Math.round(progress * 0.5));

      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(url);
        setIsExporting(false);

        const a = document.createElement("a");
        a.href = url;
        a.download = "badges.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    };

    pdfWorkerRef.current.postMessage({
      images,
      width,
      height,
      orientation: isDesktop ? "landscape" : "portrait",
    });
  };
const handleChange = (_: any, newMode: "csv" | "manual") => {
    setDataInputMode(newMode);
  };
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
              className="APP_BadgeMaker"
            >
              <Stack gap={2} alignItems="center">
                {badgesData.slice(0, visibleCount).map((item, index) => {
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
                        // Ensure no transforms for export elements
                        transform: "none",
                        transformOrigin: "top left",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      className="badge-export-container"
                    >
                      <Variant role={item.role} name={item.name} preview={false} />
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

/* hidden file input */
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
