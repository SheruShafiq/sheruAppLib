import{ useState, useRef, Dispatch, SetStateAction } from "react";
import { Stack, Button } from "@mui/material";
import Badge, { badgeProps } from "../Components/Badge.tsx";
import { PDFDownloadLink, Document as PdfDocument, Page, Image as PdfImage } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import ExcelInput from "../Components/ExcelInput.tsx";
import React from "react";
export type RowData = {
  col1: string;
  col2: string;
};
export interface ExcelInput {
  rows: RowData[];
  setRows: Dispatch<SetStateAction<RowData[]>>;
}
function Home() {

  const [pdfImages, setPdfImages] = useState<string[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const handleExportPDF = async () => {
    const images: string[] = [];
    for (let i = 0; i < badgesData?.length; i++) {
      if (refs.current[i]) {
        const canvas = await html2canvas(refs.current[i]!);
        images.push(canvas.toDataURL("image/png"));
      }
    }
    setPdfImages(images);
  };

  const [rows, setRows] = useState<RowData[]>([{ col1: '', col2: '' }]);
  const [badgesData, setBadgesData] = useState<badgeProps[]>([
    { role: "Example Role III", name: "FirstName LastName" },
  ]);
    const [generate, setGenerate] = useState(false);
  return (
    <>
      <Stack  minHeight={'100vh'} height={'100%'} width="100vw" justifyContent="center" alignItems="center">
     <ExcelInput rows={rows} setRows={setRows} />
        <Button variant="contained" onClick={() => {
            setBadgesData(rows.slice(0, -1).map((row) => ({
            role: row.col1,
            name: row.col2,
            })));
          setGenerate(true);
        }
        }>
          Generate Badges
        </Button>
        <Stack gap="2rem">
          {badgesData?.map((item, index) => (
            <div key={index} ref={el => { refs.current[index] = el; }}>
              <Badge role={item.role} name={item.name} />
            </div>
          ))}
        </Stack>
       </Stack>
       {generate && (
      <Button variant="contained" onClick={handleExportPDF}>
        Export PDF
      </Button>
     )}

      {pdfImages.length > 0 && (
        <PDFDownloadLink
          document={
            <PdfDocument>
              {pdfImages.map((img, i) => (
                <Page key={i} size="A4" orientation="landscape" style={{ padding: 0 }}>
                  <PdfImage src={img} style={{ width: "100%", height: "auto" }} />
                </Page>
              ))}
            </PdfDocument>
          }
          fileName="jalsa.pdf"
        >
          {({ loading }) => (loading ? "Preparing document..." : "Download PDF")}
        </PDFDownloadLink>
      )}
    </>
  );
}

export default Home;
