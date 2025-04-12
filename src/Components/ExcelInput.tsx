import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { ExcelInput, RowData } from '../Pages/BadgeMakerHome'; // Adjust the import path as necessary


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
      (newRows[index].col1.trim() !== '' || newRows[index].col2.trim() !== '')
    ) {
      setRows([...newRows, { col1: '', col2: '' }]);
    }
  };

  return (
    <TableContainer >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Column 1</TableCell>
            <TableCell>Column 2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={row.col1}
                  onChange={(e) =>
                    handleInputChange(index, 'col1', e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="Enter data..."
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.col2}
                  onChange={(e) =>
                    handleInputChange(index, 'col2', e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="Enter data..."
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