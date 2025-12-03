const MIN_CONFIDENCE = 0.7;
const MIN_GREEN_RATIO = 0.13;
const SAMPLE_STEP = 24;

let videoStream = null;
let desiredFacingMode = "environment";
let currentBase64Image = null;

const fileInput = document.getElementById("fileInput");
const openCameraBtn = document.getElementById("openCameraBtn");
const closeCameraBtn = document.getElementById("closeCameraBtn");
const switchCameraBtn = document.getElementById("switchCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const identifyBtn = document.getElementById("identifyBtn");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("video");
const previewCanvas = document.getElementById("previewCanvas");
const resultBox = document.getElementById("resultBox");
const solutionBox = document.getElementById("solutionBox");
const statusText = document.getElementById("statusText");
const loader = document.getElementById("loader");
const uploadTile = document.querySelector(".upload-tile");
const mascot = document.getElementById("leafMascot");
const heroPanel = document.querySelector(".panel--hero");

const canvasCtx = previewCanvas.getContext("2d");

// --------------------------------------------------------------
// 1. FILE UPLOAD + DRAG DROP
// --------------------------------------------------------------
fileInput?.addEventListener("change", handleFileSelection);

["dragenter", "dragover"].forEach((eventName) => {
  uploadTile?.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadTile.classList.add("drag-active");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  uploadTile?.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadTile.classList.remove("drag-active");
  });
});

uploadTile?.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (file) processFile(file);
});

function handleFileSelection() {
  const file = fileInput.files?.[0];
  if (file) processFile(file);
}

function processFile(file) {
  if (!file.type.startsWith("image/")) {
    setStatus("Please choose an image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = ({ target }) => {
    const img = new Image();
    img.onload = () => {
      drawImageOnCanvas(img);
      currentBase64Image = target.result;
      validateCanvasForPrediction();
    };
    img.src = target.result;
  };
  reader.readAsDataURL(file);
}

// --------------------------------------------------------------
// 2. CAMERA
// --------------------------------------------------------------
openCameraBtn?.addEventListener("click", () => startCamera(desiredFacingMode));

switchCameraBtn?.addEventListener("click", async () => {
  desiredFacingMode = desiredFacingMode === "environment" ? "user" : "environment";
  if (videoStream) {
    await startCamera(desiredFacingMode);
  }
});

closeCameraBtn?.addEventListener("click", () => {
  stopCamera();
  cameraContainer.hidden = true;
  setStatus("Camera closed.");
});

captureBtn?.addEventListener("click", () => {
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
  validateCanvasForPrediction(true);
});

async function startCamera(facingMode = "environment") {
  try {
    stopCamera();
    const constraints = {
      video: { facingMode: { ideal: facingMode } },
      audio: false,
    };
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = videoStream;
    cameraContainer.hidden = false;
    captureBtn.disabled = false;
    closeCameraBtn.disabled = false;
    switchCameraBtn.disabled = false;
    setStatus(`Camera ready (${facingMode === "environment" ? "back" : "front"} lens).`);
  } catch (error) {
    console.error("Camera error:", error);
    setStatus("Unable to access camera. Check permissions or reload.");
    captureBtn.disabled = true;
  }
}

function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
    videoStream = null;
  }
  captureBtn.disabled = true;
  closeCameraBtn.disabled = true;
  switchCameraBtn.disabled = true;
}

// --------------------------------------------------------------
// 3. IDENTIFY DISEASE (CALL BACKEND)
// --------------------------------------------------------------
identifyBtn?.addEventListener("click", async () => {
  if (!currentBase64Image) {
    setStatus("Please select or capture an image first.");
    return;
  }

  identifyBtn.disabled = true;
  toggleLoader(true);
  setStatus("Identifying disease…");

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: currentBase64Image }),
    });

    const text = await response.text();
    if (!response.ok) throw new Error(text || `Server responded with ${response.status}`);

    const data = JSON.parse(text);
    const { predictedClass, confidence } = extractPrediction(data);
    updateResult(predictedClass, confidence, data);
    updateSolution(predictedClass);
    setStatus("Prediction complete.");
  } catch (error) {
    console.error(error);
    resultBox.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    solutionBox.innerHTML = `<p class="error">No solution because of the error above.</p>`;
    setStatus("Prediction failed. Try again.");
  } finally {
    identifyBtn.disabled = false;
    toggleLoader(false);
  }
});

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------
function drawImageOnCanvas(img) {
  const maxWidth = 720;
  const scale = Math.min(maxWidth / img.width, 1);
  const width = img.width * scale;
  const height = img.height * scale;
  previewCanvas.width = width;
  previewCanvas.height = height;
  canvasCtx.drawImage(img, 0, 0, width, height);
}

function validateCanvasForPrediction(fromCamera = false) {
  const width = previewCanvas.width;
  const height = previewCanvas.height;
  if (!width || !height) return;

  const hasLeaf = isLeafDominant(width, height);
  if (!hasLeaf) {
    identifyBtn.disabled = true;
    setStatus("Image does not look like a single leaf. Try again.");
    return;
  }

  identifyBtn.disabled = false;
  setStatus(fromCamera ? "Photo captured. Ready to identify." : "Image loaded. Ready to identify.");
}

function isLeafDominant(width, height) {
  try {
    const imageData = canvasCtx.getImageData(0, 0, width, height);
    const { data } = imageData;
    let sampled = 0;
    let greenishPixels = 0;

    for (let i = 0; i < data.length; i += SAMPLE_STEP * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (g > 70 && g > r * 1.1 && g > b * 1.05) greenishPixels += 1;
      sampled += 1;
    }

    const ratio = sampled ? greenishPixels / sampled : 0;
    return ratio >= MIN_GREEN_RATIO;
  } catch (err) {
    console.warn("Leaf heuristic failed:", err);
    return true;
  }
}

function extractPrediction(data) {
  let predictedClass = "Unknown";
  let confidence = null;

  if (Array.isArray(data.predictions) && data.predictions.length > 0) {
    const p = data.predictions[0];
    predictedClass = p.class || p.label || "Unknown";
    confidence = p.confidence ?? p.score ?? null;
  } else if (data.top) {
    predictedClass = data.top.class || data.top.label || "Unknown";
    confidence = data.top.confidence ?? data.top.score ?? null;
  }

  return { predictedClass, confidence };
}

function updateResult(predictedClass, confidence, raw) {
  let confText = "";
  if (confidence !== null && !Number.isNaN(confidence)) {
    confText = ` (${(confidence * 100).toFixed(1)}% confidence)`;
  }

  const belowThreshold = typeof confidence === "number" && confidence < MIN_CONFIDENCE;
  const caution = belowThreshold
    ? `<p class="warning">Confidence is below ${(MIN_CONFIDENCE * 100).toFixed(0)}%. Retake the photo in better lighting.</p>`
    : "";

  resultBox.innerHTML = `
    <p><strong>Disease:</strong> ${predictedClass}${confText}</p>
    ${caution}
  `;

  if (belowThreshold) {
    solutionBox.innerHTML = `
      Prediction confidence is low. Capture a clearer photo and try again.
    `;
  }
}

function updateSolution(predictedClass) {
  const raw = predictedClass?.toLowerCase().trim() || "";

  // Try multiple key shapes so we match PlantVillage-style labels:
  //   Tomato___Early_blight → "tomato early blight"
  //   Apple_scab → "apple scab"
  const underscored = raw.replace(/_/g, " ").replace(/\s+/g, " ").trim();

  // Handle known naming differences between model labels and our keys
  // e.g. model: "pepper bell healthy" vs key: "bell pepper healthy"
  let reordered = underscored;
  if (reordered.startsWith("pepper bell")) {
    reordered = reordered.replace(/^pepper bell/, "bell pepper");
  }

  const candidates = [
    raw,
    underscored,
    reordered,
  ];

  let solution = null;
  let matchedKey = null;
  for (const key of candidates) {
    if (DISEASE_SOLUTIONS[key]) {
      solution = DISEASE_SOLUTIONS[key];
      matchedKey = key;
      break;
    }
  }

  if (solution) {
    solutionBox.innerHTML = `<strong>${predictedClass}</strong><br>${solution}`;
  } else {
    solutionBox.innerHTML = `
      No specific remedy found for <strong>${predictedClass}</strong>.
      Use this prediction as a hint and consult local agricultural guidance.
    `;
  }
}

function setStatus(msg) {
  console.log("[STATUS]", msg);
  if (statusText) {
    statusText.textContent = msg;
  }
}

function toggleLoader(show) {
  loader?.classList.toggle("hidden", !show);
}

// --------------------------------------------------------------
// 5. Mascot: big eyes follow cursor & happy on hover
// --------------------------------------------------------------
if (mascot && heroPanel) {
  const eyes = document.querySelectorAll(".mascot .eye");
  if (eyes.length) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (event) => {
      const rect = heroPanel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const maxOffset = 4; // px
      const distance = Math.hypot(dx, dy) || 1;

      targetX = (dx / distance) * maxOffset;
      targetY = (dy / distance) * maxOffset;
    });

    function animateEyes() {
      const ease = 0.18;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      eyes.forEach((eye) => {
        eye.style.setProperty("--eye-offset-x", `${currentX}px`);
        eye.style.setProperty("--eye-offset-y", `${currentY}px`);
      });

      requestAnimationFrame(animateEyes);
    }

    requestAnimationFrame(animateEyes);
  }
}

