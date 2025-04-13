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
import { ExcelInput, RowData } from "../Pages/BadgeMakerHome"; // Adjust the import path as necessary

const ExcelLikeTable: React.FC<ExcelInput> = ({ rows, setRows }) => {
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
                Role
              </Typography>
            </TableCell>
            <TableCell>
              {" "}
              <Typography variant="h6" fontWeight={600}>
                Name
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
                  placeholder="Nazim"
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
                  placeholder="Ali"
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
