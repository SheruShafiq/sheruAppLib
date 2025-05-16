import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export type ExcelInputProps = {
  rows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  labels: {
    col1: string;
    col2: string;
    placeholder1: string;
    placeholder2: string;
  };
};

export type RowData = { col1: string; col2: string };

const ExcelLikeTable: React.FC<ExcelInputProps> = ({
  rows,
  setRows,
  labels,
}) => {
  const handleInputChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    if (
      index === rows.length - 1 &&
      (newRows[index].col1.trim() !== "" || newRows[index].col2.trim() !== "")
    ) {
      setRows([...newRows, { col1: "", col2: "" }]);
    }
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" fontWeight={600}>
                {labels.col1}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" fontWeight={600}>
                {labels.col2}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              sx={{
                border: "none",
              }}
              key={index}
            >
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  size="small"
                  value={row.col1}
                  onChange={(e) =>
                    handleInputChange(index, "col1", e.target.value)
                  }
                  fullWidth
                  variant="standard"
                  placeholder={labels.placeholder1}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  size="small"
                  value={row.col2}
                  onChange={(e) =>
                    handleInputChange(index, "col2", e.target.value)
                  }
                  fullWidth
                  variant="standard"
                  placeholder={labels.placeholder2}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExcelLikeTable;
