const MODEL_NAME = "plantvillage-8dgn3-8uzxq";
const VERSION = "1";
const API_KEY = "YOUR_API_KEY_HERE"; // replace this with your real Roboflow API key

const predictBtn = document.getElementById("predictBtn");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const cameraButton = document.getElementById("cameraButton");

// Camera access
cameraButton.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  document.body.appendChild(video);
  video.srcObject = stream;
  video.play();
});

// Preview image
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  preview.src = URL.createObjectURL(file);
});

predictBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please upload an image first.");
    return;
  }

  result.innerHTML = "Analyzing...";
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `https://detect.roboflow.com/${MODEL_NAME}/${VERSION}?api_key=${API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  console.log(data);

  if (data.predictions && data.predictions.length > 0) {
    const disease = data.predictions[0].class;
    result.innerHTML = `<h2>Disease: ${disease}</h2>`;
  } else {
    result.innerHTML = `<h2>No disease detected.</h2>`;
  }
});

