#!/usr/bin/env node

/**
 * csvCleaner.js
 *
 * Usage:
 *   npm install xlsx papaparse
 *   node csvCleaner.js <input.xlsx|.xls|.csv> <output.csv>
 *
 * This script:
 *  1. Detects file extension.
 *  2. Reads an Excel sheet or CSV.
 *  3. Tries to locate "Functie"/"Naam" headers; if not found, falls back to columns 2 & 3.
 *  4. Maps to Role / Name, trims values.
 *  5. Drops rows where both Role & Name are empty.
 *  6. Writes out a clean CSV with columns Role,Name.
 */

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const Papa = require("papaparse");

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
    console.error("Usage: node csvCleaner.js <input.xlsx|.xls|.csv> <output.csv>");
    process.exit(1);
}

const ext = path.extname(inputPath).toLowerCase();
let records = [];

try {
    if (ext === ".xlsx" || ext === ".xls") {
        
        const workbook = XLSX.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];

        
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        if (raw.length === 0) {
            throw new Error("Excel file is empty.");
        }

        
        let headerRowIndex = raw.findIndex(
            row => row.some(cell => /^Functie$/i.test(cell.toString().trim()))
                && row.some(cell => /^Naam$/i.test(cell.toString().trim()))
        );

        let idxRole, idxName, dataStart;
        if (headerRowIndex >= 0) {
            const headers = raw[headerRowIndex].map(h => h.toString().trim());
            idxRole = headers.findIndex(h => /^Functie$/i.test(h));
            idxName = headers.findIndex(h => /^Naam$/i.test(h));
            dataStart = headerRowIndex + 1;
        } else {
            console.warn("⚠️ 'Functie' or 'Naam' headers not found; defaulting to columns 2 & 3");
            idxRole = 1;
            idxName = 2;
            dataStart = 0;
        }

        raw.slice(dataStart).forEach(row => {
            const role = row[idxRole]?.toString().trim() || "";
            const name = row[idxName]?.toString().trim() || "";
            if (role || name) records.push({ Role: role, Name: name });
        });

    } else if (ext === ".csv") {
        
        const text = fs.readFileSync(inputPath, "utf8");
        const lines = text.split(/\r?\n/);

        if (lines.length < 2) {
            throw new Error("CSV has fewer than 2 lines; cannot parse content.");
        }

        
        const sliced = lines[0].trim() === "" ? lines.slice(1).join("\n") : lines.join("\n");
        const { data, errors } = Papa.parse(sliced, {
            header: true,
            skipEmptyLines: true
        });
        if (errors.length) {
            console.warn("⚠️ Warnings while parsing CSV:", errors);
        }

        
        const hasFuncHeader = data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], 'Functie');
        const hasNameHeader = data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], 'Naam');

        data.forEach(row => {
            let role, name;
            if (hasFuncHeader && hasNameHeader) {
                role = (row['Functie'] || row['functie'] || '').trim();
                name = (row['Naam'] || row['naam'] || '').trim();
            } else {
                
                const keys = Object.keys(row);
                role = (row[keys[1]] || '').trim();
                name = (row[keys[2]] || '').trim();
            }
            if (role || name) records.push({ Role: role, Name: name });
        });

    } else {
        throw new Error("Unsupported extension: " + ext);
    }

    
    const headerLine = "Role,Name";
    const linesOut = records.map(r => {
        
        const esc = s => `"${s.replace(/"/g, '""')}"`;
        return [esc(r.Role), esc(r.Name)].join(",");
    });
    const outCsv = [headerLine, ...linesOut].join("\n");

    fs.writeFileSync(outputPath, outCsv, "utf8");
    console.log(`✅ Cleaned CSV written to ${outputPath}`);
} catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
}
