import { useState, useRef, Dispatch, SetStateAction, useEffect } from "react";
import { Stack, Button, Fade, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Badge, { badgeProps } from "../Components/Badge.tsx";
import {
  Document as PdfDocument,
  Page,
  Image as PdfImage,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import ExcelInput from "../Components/ExcelInput.tsx";
import React from "react";
import "../Styles/BadgeMakerMain.css";
import { TextGlitchEffect } from "../Components/TextGlitchEffect.jsx";
import Logo from "../Components/Logo.jsx";
export type RowData = {
  col1: string;
  col2: string;
};
import { pdf } from "@react-pdf/renderer";

export interface ExcelInput {
  rows: RowData[];
  setRows: Dispatch<SetStateAction<RowData[]>>;
}
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
function Home() {
  const [pdfImages, setPdfImages] = useState<string[]>([]);
  // Add a new ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [csvFile, setCSV] = useState<FileList | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const images: string[] = [];
    for (let i = 0; i < badgesData?.length; i++) {
      if (refs.current[i]) {
        const canvas = await html2canvas(refs.current[i]!);
        images.push(canvas.toDataURL("image/png"));
      }
    }

    const pdfDocument = (
      <PdfDocument>
        {images.map((img, i) => (
          <Page
            key={i}
            size="A4"
            orientation="landscape"
            style={{ padding: 0 }}
          >
            <PdfImage src={img} style={{ width: "100%", height: "auto" }} />
          </Page>
        ))}
      </PdfDocument>
    );

    const blob = await pdf(pdfDocument).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "jalsa.pdf";
    link.click();
    setIsExporting(false);
  };

  const [rows, setRows] = useState<RowData[]>([{ col1: "", col2: "" }]);
  const [badgesData, setBadgesData] = useState<badgeProps[]>([]);
  const [generate, setGenerate] = useState(false);
  const [dataInputMode, setDataInputMode] = useState("csv");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setDataInputMode(newAlignment);
  };
  function convertCSVToArray(csvFile: FileList) {
    if (!csvFile || csvFile.length === 0) return; // Ensure file is selected

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target?.result as string;
      const rows = text
        .split("\n")
        .slice(1)
        .map((row) => row.split(","));
      const data = rows.map((row) => ({
        role: row[0],
        name: row[1],
      }));
      setBadgesData(data);
    };
    reader.readAsText(csvFile[0]);
  }

  useEffect(() => {
    if (csvFile) {
      convertCSVToArray(csvFile);
    } else {
      setBadgesData([]); // Clear badges data if no file is selected
    }
  }, [csvFile]);
  return (
    <Stack
      minHeight={"100%"}
      width="100vw"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Stack gap={2} alignItems={"center"} mt={"25vh"}>
        <Stack
          direction={"row"}
          width={"600px"}
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

        {badgesData?.map((item, index) => (
          <Fade key={index} in={generate}>
            <div
              ref={(el) => {
                refs.current[index] = el;
              }}
              style={{
                display: generate ? "block" : "none",
              }}
            >
              <Badge
                preview={generate ? false : true}
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
                  multiple
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
    </Stack>
  );
}

export default Home;
