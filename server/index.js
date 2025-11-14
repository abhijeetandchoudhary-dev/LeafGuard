require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// store uploads in memory then forward to Roboflow; also save to uploads/ for retraining later
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => res.send('LeafGuard backend running'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/predict', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded under `file`' });

    const key = process.env.ROBOFLOW_API_KEY;
    const model = process.env.MODEL_NAME || 'plantvillage-8dgn3-8uzxq';
    const version = process.env.MODEL_VERSION || '1';
    if (!key || key.startsWith('rf_your_') || key === 'EyBDSnxhMhx2uAnxCWbl"') {
      // still save the uploaded file so you can inspect locally
      const localPath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
      fs.writeFileSync(localPath, req.file.buffer);
      return res.status(400).json({ error: 'Missing ROBOFLOW_API_KEY in server env. See server/.env.example' });
    }

    // save copy locally for retraining dataset
    try {
      const localPath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
      fs.writeFileSync(localPath, req.file.buffer);
    } catch (err) {
      console.warn('Failed to save local copy:', err.message);
    }

    // forward to Roboflow detect API
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname });

    const url = `https://detect.roboflow.com/${model}/${version}?api_key=${key}`;

    const rfResp = await fetch(url, { method: 'POST', body: form });
    const text = await rfResp.text();
    // try parse JSON
    try {
      const json = JSON.parse(text);
      return res.json(json);
    } catch (err) {
      return res.status(500).json({ error: 'Roboflow returned non-json', body: text });
    }
  } catch (err) {
    console.error('Predict error:', err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(port, () => console.log(`LeafGuard backend listening on ${port}`));
