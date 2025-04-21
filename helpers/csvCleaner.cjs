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
 *  3. Treats row 2 as headers (Functie / Naam).
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
        // ----- Excel path -----
        const workbook = XLSX.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];

        // Convert to array of arrays, defval="" ensures no undefined
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        if (raw.length < 2) {
            throw new Error("Excel file has fewer than 2 rows; cannot find headers.");
        }

        // Row 1 (index 0) is blank; Row 2 (index 1) has headers
        const headers = raw[1].map(h => h.toString().trim());
        const idxRole = headers.findIndex(h => /^Functie$/i.test(h));
        const idxName = headers.findIndex(h => /^Naam$/i.test(h));

        if (idxRole < 0 || idxName < 0) {
            throw new Error("Could not find 'Functie' or 'Naam' columns in header row.");
        }

        // Data rows start from index 2
        raw.slice(2).forEach(row => {
            const role = row[idxRole]?.toString().trim() || "";
            const name = row[idxName]?.toString().trim() || "";
            if (role || name) records.push({ Role: role, Name: name });
        });

    } else if (ext === ".csv") {
        // ----- CSV fallback -----
        const text = fs.readFileSync(inputPath, "utf8");
        const lines = text.split(/\r?\n/);

        if (lines.length < 2) {
            throw new Error("CSV has fewer than 2 lines; cannot find headers.");
        }

        // Drop first (empty) line, rejoin
        const sliced = lines.slice(1).join("\n");
        const { data, errors } = Papa.parse(sliced, {
            header: true,
            skipEmptyLines: true
        });
        if (errors.length) {
            console.warn("Warnings while parsing CSV:", errors);
        }

        data.forEach(row => {
            // Papa gave you keys based on row 2
            const role = (row["Functie"] || row["functie"] || "").trim();
            const name = (row["Naam"] || row["naam"] || "").trim();
            if (role || name) records.push({ Role: role, Name: name });
        });

    } else {
        throw new Error("Unsupported extension: " + ext);
    }

    // Build CSV text
    const headerLine = "Role,Name";
    const linesOut = records.map(r => {
        // Escape quotes
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
