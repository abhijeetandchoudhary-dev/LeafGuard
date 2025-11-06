const fetch = require("node-fetch");
const FormData = require("form-data");
const formidable = require("formidable");
const fs = require("fs");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Error parsing form data");

    const uploaded = files.file || Object.values(files)[0];
    if (!uploaded) return res.status(400).send("No file uploaded");

    const fileStream = fs.createReadStream(uploaded.filepath);

    const formData = new FormData();
    formData.append("file", fileStream);

    const url = `https://classify.roboflow.com/${process.env.MODEL_NAME}/${process.env.VERSION}?api_key=${process.env.RF_API_KEY}`;

    const rfResponse = await fetch(url, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders()
    });

    const text = await rfResponse.text();
    try { return res.status(rfResponse.status).json(JSON.parse(text)); }
    catch { return res.status(rfResponse.status).send(text); }
  });
};

