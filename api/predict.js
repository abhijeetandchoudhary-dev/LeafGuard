const MODEL_NAME = "plantvillage-8dgn3-8uzxq";
const VERSION = "1";
const API_KEY = import.meta.env?.VITE_RF_API_KEY || "YOUR_FALLBACK_API_KEY"; // Fallback for local testing

const imageInput = document.getElementById("imageInput");
const cameraButton = document.getElementById("cameraButton");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const result = document.getElementById("result");

let stream;

// CAMERA ACCESS
cameraButton.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    video.style.width = "300px";
    video.style.borderRadius = "10px";
    result.innerHTML = "";
    result.appendChild(video);

    // Capture image from camera when clicked again
    cameraButton.textContent = "📸 Capture Photo";
    cameraButton.onclick = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");

      // Stop the video stream
      stream.getTracks().forEach(track => track.stop());

      preview.src = dataURL;
      video.remove();
      cameraButton.textContent = "📷 Use Camera";
    };
  } catch (err) {
    alert("Camera access denied or not supported.");
    console.error(err);
  }
});

// IMAGE PREVIEW
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) preview.src = URL.createObjectURL(file);
});

// PREDICTION FUNCTION
predictBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file && !preview.src) {
    alert("Please upload or capture a photo first.");
    return;
  }

  result.innerHTML = "🔍 Analyzing... please wait...";

  try {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    } else {
      const blob = await fetch(preview.src).then(res => res.blob());
      formData.append("file", blob, "capture.jpg");
    }

    const response = await fetch(
      `https://detect.roboflow.com/${MODEL_NAME}/${VERSION}?api_key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Prediction result:", data);

    if (data.predictions && data.predictions.length > 0) {
      const disease = data.predictions[0].class;
      const confidence = (data.predictions[0].confidence * 100).toFixed(2);
      result.innerHTML = `
        <h2>🌿 Disease: ${disease}</h2>
        <p>Confidence: ${confidence}%</p>
      `;
    } else {
      result.innerHTML = "<h3>No disease detected.</h3>";
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "<h3>Error connecting to model. Check console.</h3>";
  }
});

