const MODEL_NAME = "plantvillage-8dgn3-8uzxq";
const VERSION = "1";
const API_KEY = "rf_XXXXXXXXXXXXXXXXXXXXXXXX"; // <-- Replace with your Roboflow key directly

const imageInput = document.getElementById("imageInput");
const cameraButton = document.getElementById("cameraButton");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const result = document.getElementById("result");

let stream;
let capturedBlob = null;

// CAMERA ACCESS
cameraButton.addEventListener("click", async () => {
  try {
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
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
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
  try {
    result.innerHTML = "🔍 Analyzing... please wait...";
    const formData = new FormData();

    if (capturedBlob) {
      formData.append("file", capturedBlob, "capture.jpg");
    } else if (imageInput.files[0]) {
      formData.append("file", imageInput.files[0]);
    } else {
      result.innerHTML = "⚠️ Please capture or upload a leaf image.";
      return;
    }

    const response = await fetch(
      `https://detect.roboflow.com/${MODEL_NAME}/${VERSION}?api_key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Response:", data);

    if (data.predictions && data.predictions.length > 0) {
      const disease = data.predictions[0].class;
      const confidence = (data.predictions[0].confidence * 100).toFixed(1);
      result.innerHTML = `
        <h2>🌿 Disease Detected: ${disease}</h2>
        <p>Confidence: ${confidence}%</p>
      `;
    } else {
      result.innerHTML = "<h3>No visible disease detected.</h3>";
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "<h3>⚠️ Error: Unable to reach model.</h3>";
  }
});

