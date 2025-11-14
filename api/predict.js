const MODEL_NAME = "plantvillage-8dgn3-8uzxq";
const VERSION = "1";
// NOTE: Do NOT put your Roboflow API key in client-side code. The frontend
// posts images to a backend (/predict) which should forward requests to Roboflow
// using a server-side API key stored in the server environment (see server/.env).

const imageInput = document.getElementById("imageInput");
const cameraButton = document.getElementById("cameraButton");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const result = document.getElementById("result");
const solution = document.getElementById("solution");
const loader = document.getElementById("loader");

let stream;
let capturedBlob = null;

// Simple mapping from detected class --> remedy text. Extend this object to match your model labels.
const diseaseSolutions = {
  Early_blight: `• Remove and dispose of affected leaves.
• Improve air circulation and avoid overhead watering.
• Apply copper-based fungicides or chlorothalonil following label instructions.`,
  Late_blight: `• Remove infected plants and destroy affected debris.
• Apply appropriate systemic fungicides where recommended.
• Rotate crops and avoid planting susceptible varieties in the same location.`,
  Bacterial_spot: `• Remove heavily infected leaves; avoid working with wet plants.
• Use copper bactericides as directed.
• Improve drainage and avoid overhead irrigation.`,
  Rust: `• Remove infected foliage and improve airflow.
• Apply sulfur or other recommended fungicides for rust control.
• Keep surrounding weeds and debris cleared.`,
  Healthy: `• No action required. Maintain good cultural practices: proper watering, spacing, and nutrition.`,
};

// CAMERA ACCESS
// CAMERA ACCESS
cameraButton.addEventListener("click", async () => {
  // Basic capability checks
  if (!cameraButton) return console.warn('cameraButton element not found');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    result.innerHTML = '<p>⚠️ Camera not supported by this browser. Use a recent Chrome/Firefox on HTTPS or localhost.</p>';
    return;
  }

  // Secure context check
  const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (window.location.protocol !== 'https:' && !isLocal) {
    result.innerHTML = '<p>⚠️ Camera access requires a secure context (HTTPS) or localhost. Serve the site over HTTPS or use localhost for testing.</p>';
    return;
  }

  try {
    // If Permissions API is available, check current state to provide better UX
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const p = await navigator.permissions.query({ name: 'camera' });
        if (p.state === 'denied') {
          result.innerHTML = '<p>🔒 Camera permission is blocked for this site. Please check your browser site settings and allow camera access.</p>';
          return;
        }
        // note: state can be 'prompt' or 'granted'
      } catch (e) {
        // some browsers may throw for 'camera' permission query — ignore
      }
    }

    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      video.id = "videoPreview";
      video.style.width = "300px";
      video.style.borderRadius = "8px";
      result.innerHTML = "";
      result.appendChild(video);
      cameraButton.textContent = "📸 Capture Photo";
    } else {
      const video = document.getElementById("videoPreview");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/jpeg");
      capturedBlob = await (await fetch(dataURL)).blob();
      preview.src = dataURL;

      // Stop video stream
      stream.getTracks().forEach((track) => track.stop());
      video.remove();
      stream = null;
      cameraButton.textContent = "📷 Use Camera";
    }
  } catch (err) {
    alert("Camera access denied or unavailable.");
    console.error("Camera error:", err);
  }
});

// IMAGE PREVIEW
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) preview.src = URL.createObjectURL(file);
});

// PREDICTION
predictBtn.addEventListener("click", async () => {
  // UI: clear previous
  result.innerHTML = "";
  solution.innerHTML = "";

  // choose file
  const formData = new FormData();
  if (capturedBlob) {
    formData.append("file", capturedBlob, "capture.jpg");
  } else if (imageInput.files[0]) {
    formData.append("file", imageInput.files[0]);
  } else {
    result.innerHTML = "⚠️ Please capture or upload a leaf image.";
    return;
  }

  // show loader and disable UI
  showLoader(true);
  predictBtn.disabled = true;

  try {
    // send to local backend which will proxy to Roboflow (keeps API key secret)
    const BACKEND = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    const resp = await fetch(`${BACKEND}/predict`, { method: "POST", body: formData });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Model request failed: ${resp.status} ${txt}`);
    }

    const data = await resp.json();
    console.log("Response:", data);

    if (data.predictions && data.predictions.length > 0) {
      const top = data.predictions[0];
      const disease = top.class || "Unknown";
      const confidence = top.confidence ? (top.confidence * 100).toFixed(1) : "-";

      result.innerHTML = `
        <div class="result">
          <h2>🌿 Disease Detected: ${escapeHtml(disease)}</h2>
          <p>Confidence: ${confidence}%</p>
        </div>`;

      // show remedy / solution
      const remedy = diseaseSolutions[disease] ||
        `No remedy found for '${disease}'. Try checking the diagnosis against known plant disease lists or add remedies to the mapping.`;

      solution.innerHTML = `<strong>Recommended actions:</strong><div class="remedy">${escapeHtml(remedy).replace(/\n/g, "<br />")}</div>`;
    } else {
      result.innerHTML = "<h3>No visible disease detected.</h3>";
      solution.innerHTML = "<div class=\"remedy\">If you still suspect disease, try different images or check environmental stresses.</div>";
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = `<h3>⚠️ Error: ${escapeHtml(err.message || String(err))}</h3>`;
  } finally {
    // hide loader and re-enable
    showLoader(false);
    predictBtn.disabled = false;
  }
});

// show/hide loader helper
function showLoader(on) {
  if (!loader) return;
  if (on) {
    loader.classList.remove("hidden");
    loader.setAttribute("aria-hidden", "false");
  } else {
    loader.classList.add("hidden");
    loader.setAttribute("aria-hidden", "true");
  }
}

// small escape helper to avoid injection in innerHTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

