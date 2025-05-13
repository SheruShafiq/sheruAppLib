import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
// serve static front-end build if placed under public
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/generate', async (req, res) => {
  const { badges, variant } = req.body;
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // determine render URL: use FRONTEND_URL env, otherwise use this service's static host
    // (serving badge-generator/public on PORT)
    const renderUrl = 'http://localhost:5173/sheru/appLibrary/badgeMaker';
    // wait until network is idle so React has fully loaded
    // navigate to index.html via static server
    await page.goto(renderUrl, { waitUntil: 'networkidle0' });

    // expose data
    await page.evaluate((data) => {
      // @ts-ignore
      window.__BADGES__ = data.badges;
      // @ts-ignore
      window.__VARIANT__ = data.variant;
    }, { badges, variant });

    // wait for each Badge container (Mui Stack with fixed size) to render
    const badgeSelector = 'div[style*="width:660px"][style*="height:350px"]';
    await page.waitForSelector(badgeSelector, { timeout: 60000 });
    // select all badge containers by matching inline style
    const badgeElements = await page.$$(badgeSelector);
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < badgeElements.length; i++) {
      const element = badgeElements[i];
      const buffer = await element.screenshot({ type: 'jpeg', quality: 100 });
      const pagePdf = pdfDoc.addPage([660, 350]);
      const img = await pdfDoc.embedJpg(buffer);
      pagePdf.drawImage(img, { x: 0, y: 0, width: 660, height: 350 });
    }

    const pdfBytes = await pdfDoc.save();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBytes.length.toString() });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('PDF generation error');
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Badge generator service listening on port ${PORT}`);
});
