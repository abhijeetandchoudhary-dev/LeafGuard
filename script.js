const MODEL_NAME = "plantvillage-8dgn3-8uzxq";
const VERSION = "1";
const API_KEY = "EyBDSnxhMhx2uAnxCWbl""; // <-- paste your key here (keep private)

document.getElementById("imageInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const preview = document.getElementById("preview");
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const file = document.getElementById("imageInput").files[0];
  if (!file) return alert("Please select an image first!");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `https://classify.roboflow.com/${MODEL_NAME}/${VERSION}?api_key=${API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const json = await response.json();
  const prediction = json.top;
  document.getElementById("result").innerText = prediction;

  document.getElementById("solution").innerText =
    diseaseSolutions[prediction] || "No treatment information available.";
});

