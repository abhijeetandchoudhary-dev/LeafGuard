# LeafGuard – AI Plant Disease Identifier

LeafGuard helps farmers and hobby gardeners quickly screen leaf photos for common diseases. Upload an image (or capture one live), and LeafGuard uses a PlantVillage-trained computer vision model to predict the disease, highlight confidence, and instantly share curated remedies.

![LeafGuard UI screenshot](screenshots/leafguard-ui.png) <!-- Replace with your actual screenshot path -->

## ✨ Features

- **AI diagnosis** – Roboflow-hosted classifier trained on the PlantVillage dataset.
- **Capture & upload** – Drag‑and‑drop upload, or capture via browser camera with front/back lens control.
- **Confidence-aware** – Minimum confidence threshold plus “retake photo” guidance for low-confidence predictions.
- **Leaf sanity check** – Quick green-pixel heuristic helps block non-leaf images before calling the model.
- **Remedy library** – Human-friendly instructions for 30+ crop/disease combinations in `disease_solutions.js`.
- **Friendly UI** – Modern responsive layout, loading overlay, and “Sprout” mascot whose eyes track the cursor and smiles on hover.

## 🧱 Tech Stack

| Layer      | Details |
|-----------|---------|
| Frontend  | HTML, CSS, vanilla JavaScript, Canvas API |
| Backend   | Vercel Serverless Function (`/api/predict`) |
| Model     | Roboflow PlantVillage classifier (classification endpoint) |
| Deployment| Vercel |
| Versioning| Git + GitHub |

## 🧠 How It Works

1. **Image intake**  
   - User uploads/captures a photo.  
   - Image is drawn to a hidden `<canvas>` and converted to Base64.

2. **Pre-flight checks**  
   - A lightweight heuristic looks for green-ish pixels to ensure it looks like a leaf.  
   - If the check fails, the user is asked to retake the photo.

3. **Prediction**  
   - Frontend POSTs the Base64 image to `/api/predict`.  
   - The serverless function strips headers and forwards the raw base64 string to `https://classify.roboflow.com/...`.

4. **Post-processing**  
   - We normalize class names (`Tomato___Early_blight` → `tomato early blight`, etc.).  
   - We enforce a `MIN_CONFIDENCE` of 0.7; below that, the UI asks for another photo.  
   - We look up remedies from `disease_solutions.js` and display a detailed plan.

5. **UI feedback**  
   - Result + confidence, warning blocks, and suggested remedy.  
   - Sprout mascot animates to keep the experience fun but unobtrusive.

## 🚀 Getting Started

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR-USER/leafguard.git
   cd leafguard
   npm install           # if you have root-level deps
   cd server && npm install && cd ..
   ```

2. **Environment variables**  
   Set the following (e.g., in Vercel or `.env`):
   ```
   ROBOFLOW_API_KEY=your_key
   ROBOFLOW_MODEL_ID=plantvillage-model-id
   ```

3. **Run locally**  
   - If you are using a simple static server: `npm run dev` (configure as needed).  
   - Or use Vercel CLI: `vercel dev`.

4. **Deploy**  
   - Push to GitHub.  
   - Make sure your Vercel project is linked to this repo/branch; it will auto-deploy.

## 📂 Key Files

- `index.html` – Layout for hero panel, upload/camera controls, results, loader, Sprout.
- `style.css` – Theme variables, responsive grid, loader styles, mascot animations.
- `script.js` – Camera + upload handling, validation, fetch to `/api/predict`, confidence messaging, remedy lookup, mascot logic.
- `disease_solutions.js` – Map of PlantVillage class names → remedy text.
- `api/predict.js` – Vercel serverless function that forwards images to the Roboflow classify API.

## 🧪 Testing Tips

- Use sample PlantVillage images (healthy + diseased) to validate predictions.
- Try a non-leaf photo to confirm the sanity check blocks the request.
- Test low-light or blurry photos to see the confidence warning in action.

## 🔮 Future Enhancements

- Add multi-language support for remedy text.
- Allow users to download/share a simple “field report”.
- Train/fine-tune the model with more field-condition photos and a “not a leaf” class.
- Add offline/PWA capabilities for low-connectivity areas.

## 🙌 Credits

- Dataset: **PlantVillage**  
- Model hosting: **Roboflow**  
- Deployment: **Vercel**

---

Feel free to fork, open issues, or suggest improvements. If you use LeafGuard in your own project, I’d love to hear about it!

