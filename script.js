// script.js

let videoStream = null;

const fileInput = document.getElementById("fileInput");
const openCameraBtn = document.getElementById("openCameraBtn");
const closeCameraBtn = document.getElementById("closeCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const identifyBtn = document.getElementById("identifyBtn");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("video");
const previewCanvas = document.getElementById("previewCanvas");
const resultBox = document.getElementById("resultBox");
const solutionBox = document.getElementById("solutionBox");
const statusText = document.getElementById("statusText");

const canvasCtx = previewCanvas.getContext("2d");

let currentBase64Image = null;

// --------------------------------------------------------------
// 1. FILE UPLOAD HANDLING
// --------------------------------------------------------------
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      drawImageOnCanvas(img);
      currentBase64Image = e.target.result;
      identifyBtn.disabled = false;
      setStatus("Image loaded. Ready to identify.");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// --------------------------------------------------------------
// 2. CAMERA HANDLING
// --------------------------------------------------------------
openCameraBtn.addEventListener("click", async () => {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = videoStream;
    cameraContainer.style.display = "block";
    setStatus("Camera opened. Capture a photo.");
  } catch (err) {
    console.error("Camera error:", err);
    setStatus("Unable to access camera.");
  }
});

closeCameraBtn && closeCameraBtn.addEventListener("click", () => {
  stopCamera();
  cameraContainer.style.display = "none";
  setStatus("Camera closed.");
});

captureBtn && captureBtn.addEventListener("click", () => {
  if (!videoStream) {
    setStatus("Camera not active.");
    return;
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  previewCanvas.width = width;
  previewCanvas.height = height;

  canvasCtx.drawImage(video, 0, 0, width, height);

  currentBase64Image = previewCanvas.toDataURL("image/jpeg");
  identifyBtn.disabled = false;

  setStatus("Photo captured. Ready to identify.");
});

// --------------------------------------------------------------
// 3. IDENTIFY DISEASE USING BACKEND
// --------------------------------------------------------------
identifyBtn.addEventListener("click", async () => {
  if (!currentBase64Image) {
    setStatus("Please select or capture an image first.");
    return;
  }

  identifyBtn.disabled = true;
  setStatus("Identifying disease...");

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: currentBase64Image }),
    });

    if (!response.ok) {
      throw new Error("Server responded with " + response.status);
    }

    const data = await response.json();
    console.log("Prediction data:", data);

    const { predictedClass, confidence } = extractPrediction(data);

    updateResult(predictedClass, confidence, data);
    updateSolution(predictedClass);

    setStatus("Prediction complete.");
  } catch (err) {
    console.error(err);
    resultBox.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    solutionBox.innerHTML = `<p style="color:red;">No solution available due to error.</p>`;
    setStatus("Error occurred.");
  }

  identifyBtn.disabled = false;
});

// --------------------------------------------------------------
// Helper: Draw image to Canvas
// --------------------------------------------------------------
function drawImageOnCanvas(img) {
  const maxWidth = 450;
  const scale = Math.min(maxWidth / img.width, 1);

  const width = img.width * scale;
  const height = img.height * scale;

  previewCanvas.width = width;
  previewCanvas.height = height;

  canvasCtx.drawImage(img, 0, 0, width, height);
}

// --------------------------------------------------------------
// Helper: Stop camera
// --------------------------------------------------------------
function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
    videoStream = null;
  }
}

// --------------------------------------------------------------
// Extract prediction from Roboflow API
// --------------------------------------------------------------
function extractPrediction(data) {
  let predictedClass = "Unknown";
  let confidence = null;

  // If model returns detections array
  if (Array.isArray(data.predictions) && data.predictions.length > 0) {
    predictedClass = data.predictions[0].class || "Unknown";
    confidence = data.predictions[0].confidence || null;

  // If classification-style response
  } else if (data.top) {
    predictedClass = data.top.class || "Unknown";
    confidence = data.top.confidence || null;
  }

  return { predictedClass, confidence };
}

// --------------------------------------------------------------
// Update UI: Result
// --------------------------------------------------------------
function updateResult(predictedClass, confidence, raw) {
  let confText = confidence
    ? ` (${(confidence * 100).toFixed(1)}% confidence)`
    : "";

  resultBox.innerHTML = `
    <p><strong>Disease:</strong> ${predictedClass}${confText}</p>
    <details><summary>View raw response</summary>
      <pre>${JSON.stringify(raw, null, 2)}</pre>
    </details>
  `;
}

// --------------------------------------------------------------
// Update UI: Suggested Solution
// --------------------------------------------------------------
function updateSolution(predictedClass) {
  const key = predictedClass.toLowerCase().trim();
  const solution = DISEASE_SOLUTIONS[key];

  if (solution) {
    solutionBox.innerHTML = `<strong>${predictedClass}</strong><br>${solution}`;
  } else {
    solutionBox.innerHTML = `
      No specific remedy found for <strong>${predictedClass}</strong>.
      Consult agricultural guidance or experts.
    `;
  }
}

// --------------------------------------------------------------
// Status update
// --------------------------------------------------------------
function setStatus(msg) {
  console.log("[STATUS]", msg);
  if (statusText) statusText.textContent = msg;
}

