export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }

    const image = body?.image;
    if (!image) {
      return res.status(400).json({ error: "No image provided." });
    }

    // Remove base64 prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const apiKey = process.env.ROBOFLOW_API_KEY;
    const modelId = process.env.ROBOFLOW_MODEL_ID;

    if (!apiKey || !modelId) {
      return res.status(500).json({
        error: "Missing Roboflow environment variables.",
        details: "ROBOFLOW_API_KEY or ROBOFLOW_MODEL_ID not set"
      });
    }

    // ✔ CORRECT endpoint for Roboflow Infer API
    const url = `https://infer.roboflow.com/${modelId}?api_key=${apiKey}`;

    const rfResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Data
      })
    });

    const text = await rfResponse.text();

    if (!rfResponse.ok) {
      return res.status(500).json({
        error: "Roboflow API error",
        status: rfResponse.status,
        details: text
      });
    }

    let data;
    try { data = JSON.parse(text); }
    catch { data = { raw: text }; }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      details: err.message
    });
  }
}

