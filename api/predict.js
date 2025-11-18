// api/predict.js

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Body might arrive as string – handle both
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore parse error; will be handled below if image missing
      }
    }

    const image = body?.image;
    if (!image) {
      return res
        .status(400)
        .json({ error: "No image field found in request body." });
    }

    // Remove "data:image/...;base64," prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const apiKey = process.env.ROBOFLOW_API_KEY;
    const modelId = process.env.ROBOFLOW_MODEL_ID;

    if (!apiKey || !modelId) {
      return res.status(500).json({
        error: "Missing Roboflow environment variables.",
        details:
          "ROBOFLOW_API_KEY or ROBOFLOW_MODEL_ID is not set in Vercel project settings.",
      });
    }

    // ⚠️ IMPORTANT:
    // If your Roboflow example URL starts with:
    //   - https://detect.roboflow.com/...  → keep "detect"
    //   - https://classify.roboflow.com/... → change to "classify"
    const baseUrl = "https://detect.roboflow.com";
    const url = `${baseUrl}/${modelId}?api_key=${apiKey}`;

    const rfResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `base64=${encodeURIComponent(base64Data)}`,
    });

    const text = await rfResponse.text();

    // Bubble up Roboflow error so we can see it in the frontend
    if (!rfResponse.ok) {
      console.error("Roboflow API error:", rfResponse.status, text);
      return res.status(500).json({
        error: "Roboflow API error",
        status: rfResponse.status,
        details: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If not JSON, return raw string
      data = { raw: text };
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error in /api/predict:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
}

