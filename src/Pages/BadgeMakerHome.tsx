import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Stack, Button, Fade, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Badge, { badgeProps } from "../Components/Badge";
import {
  Document as PdfDocument,
  Page,
  Image as PdfImage,
  pdf,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import ExcelInput from "../Components/ExcelInput";
import Papa from "papaparse";
import "../Styles/BadgeMakerMain.css";
import { TextGlitchEffect } from "../Components/TextGlitchEffect";
import Logo from "../Components/Logo";
import IOSLoader from "../Components/IOSLoader";

// Rename the interface to avoid confusion with the component name.
export type RowData = {
  col1: string;
  col2: string;
};

export interface ExcelInputProps {
  rows: RowData[];
  setRows: Dispatch<SetStateAction<RowData[]>>;
}

function Home() {
  // State and refs for export and UI preview
  const [pdfImages, setPdfImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [csvFile, setCSV] = useState<FileList | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [rows, setRows] = useState<RowData[]>([{ col1: "", col2: "" }]);
  const [badgesData, setBadgesData] = useState<badgeProps[]>([]);
  const [generate, setGenerate] = useState(false);
  const [dataInputMode, setDataInputMode] = useState("csv");

  // Reset refs arrays when badgesData changes to ensure syncing
  useEffect(() => {
    refs.current = [];
    exportRefs.current = [];
  }, [badgesData]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setDataInputMode(newAlignment);
  };

  function convertCSVToArray(csvFile: FileList) {
    if (!csvFile || csvFile.length === 0) return; // Ensure a file is selected

    const file = csvFile[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = (results.data as any[]).map((row) => ({
          role: row["Role"] || row["role"] || "",
          name: row["Name"] || row["name"] || "",
        }));
        setBadgesData(data);
      },
      error: function (err) {
        console.error("Error parsing CSV", err);
      },
    });
  }

  useEffect(() => {
    if (csvFile) {
      convertCSVToArray(csvFile);
    } else {
      setBadgesData([]); // Clear badges data if no file is selected
    }
  }, [csvFile]);
  const isDesktop = window.innerWidth > 768;
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Capture canvases concurrently from off-screen export container
      const images: string[] = await Promise.all(
        exportRefs.current.slice(0, badgesData.length).map(async (el) => {
          if (el) {
            const canvas = await html2canvas(el);
            return canvas.toDataURL("image/png");
          }
          return "";
        })
      );
      const validImages = images.filter((img) => img !== "");

      const pdfDocument = (
        <PdfDocument
          title="Jalsa Salana Badge"
          author="Ahmadiyya Muslim Community"
          subject="Jalsa Salana Badge"
          keywords="Jalsa, Salana, Badge, PDF"
          creator="Sheru"
          producer="Sheru"
          language="en-US"
        >
          {validImages.map((img, i) => (
            <Page
              key={i}
              size="A4"
              orientation="landscape"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <PdfImage src={img} style={{ width: "100%", height: "auto" }} />
            </Page>
          ))}
        </PdfDocument>
      );

      const blob = await pdf(pdfDocument).toBlob();
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "jalsa.pdf";
      link.click();
      // Revoke the object URL after download to free memory
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("PDF export failed: ", error);
    }
    setIsExporting(false);
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
        width={"100%"}
        gap={2}
        alignItems={"center"}
        mt={generate ? "2vh" : "25vh"}
        sx={{
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Stack
          direction={"row"}
          width={"100%"}
          maxWidth={"600px"}
          justifyContent={generate ? "space-between" : "center"}
          alignItems={"center"}
          alignContent={"center"}
        >
          <Fade in={generate}>
            <Button
              color="primary"
              onClick={() => {
                setBadgesData([]);
                setGenerate(false);
                setPdfImages([]);
                setCSV(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              sx={{
                display: generate ? "block" : "none",
              }}
            >
              Reset
            </Button>
          </Fade>

          <Logo logoName={"Badge"} URL={"/sheru/appLibrary/BadgeMaker"} />
          <Fade in={generate}>
            <Button
              loading={isExporting}
              loadingIndicator={<IOSLoader />}
              className="secondaryButtonHoverStyles"
              color="secondary"
              onClick={handleExportPDF}
              sx={{
                display: generate ? "block" : "none",
              }}
            >
              Export PDF
            </Button>
          </Fade>
        </Stack>

        {/* Visible Preview Container */}
        {badgesData?.map((item, index) => (
          <Fade key={index} in={generate}>
            <div
              ref={(el) => {
                refs.current[index] = el;
              }}
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

        <Fade in={!generate}>
          <ToggleButtonGroup
            color="primary"
            value={dataInputMode}
            exclusive
            onChange={handleChange}
            aria-label="inputMode"
            sx={{
              display: !generate ? "flex" : "none",
            }}
          >
            <ToggleButton value="csv">Upload CSV</ToggleButton>
            <ToggleButton value="manual">Manual Data</ToggleButton>
          </ToggleButtonGroup>
        </Fade>
      </Stack>

      <Fade in={!generate}>
        <Stack
          gap={1}
          maxWidth={"600px"}
          sx={{
            display: !generate ? "flex" : "none",
          }}
        >
          <Fade in={dataInputMode === "manual"}>
            <Stack
              sx={{
                display: dataInputMode === "manual" ? "flex" : "none",
              }}
            >
              <ExcelInput rows={rows} setRows={setRows} />
            </Stack>
          </Fade>
          <Fade in={dataInputMode === "csv"}>
            <Stack
              gap={1}
              sx={{
                display: dataInputMode === "csv" ? "flex" : "none",
              }}
            >
              <Typography variant="body1" component="div">
                <strong>Upload a CSV file with the following format:</strong>
                <Stack
                  my={1}
                  borderRadius={1}
                  bgcolor={"#ffffff17"}
                  gap={0.5}
                  p={1}
                >
                  <span>Role, Name</span>
                  <span>Nazim Transport, Ali Abbas</span>
                  <span>Moawin Food, Ahmed Agha</span>
                  <span>Naib Nazim Taleem, Fatima Khatib</span>
                </Stack>
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload CSV
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => setCSV(event.target.files)}
                  ref={fileInputRef} // attach fileInputRef here
                />
              </Button>
            </Stack>
          </Fade>
          <Button
            className="secondaryButtonHoverStyles"
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
                // Exclude the last row assuming it is for new entry; adjust this logic if needed.
                setBadgesData(
                  rows.slice(0, -1).map((row) => ({
                    role: row.col1,
                    name: row.col2,
                  }))
                );
                setGenerate(true);
              }
            }}
          >
            Generate Badges
          </Button>
        </Stack>
      </Fade>

      {/* Off-screen Container for PDF Export */}
      {generate && (
        <div
          style={{
            position: "fixed",
            top: "-10000px",
            left: "-10000px",
            width: "1000px",
            overflow: "visible",
          }}
        >
          {badgesData.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                exportRefs.current[index] = el;
              }}
            >
              <Badge
                preview={false} // Render full badge for export
                role={item.role}
                name={item.name}
              />
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
}

// A visually hidden input for file uploads
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default Home;
