import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ExcelInputProps, RowData } from "../Pages/BadgeMakerHome"; // Adjust the import path as necessary

const ExcelLikeTable: React.FC<ExcelInputProps> = ({
  rows,
  setRows,
  badgeVariant,
}) => {
  // Start with one blank row

  // Update row data and auto append new row when needed
  const handleInputChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    // If editing the last row and at least one field is not empty, add a new blank row.
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
                {badgeVariant == 2 ? "Role" : "Licensce Number"}
              </Typography>
            </TableCell>
            <TableCell>
              {" "}
              <Typography variant="h6" fontWeight={600}>
                {badgeVariant == 2 ? "Name" : "Pass Level"}
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
                  placeholder={
                    badgeVariant == 2 ? "Nazim Jalsa Food" : "XTCAS-ASD1A"
                  }
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
                  placeholder={
                    badgeVariant == 2
                      ? "Ahmad Ali Abbas"
                      : "1 = Standard, 2 = Full Access"
                  }
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
