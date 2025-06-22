const flowerImages = {
  "チューリップ": [
    "https://i.imgur.com/eufdO25.png",
    "https://i.imgur.com/XmCOi5q.png",
    "https://i.imgur.com/bWZoPZE.png"
  ],
  "ひまわり": [
    "https://i.imgur.com/Kb4QaOk.png",
    "https://i.imgur.com/gUTrmYM.png",
    "https://i.imgur.com/1l94l7N.png"
  ],
  "ダリア": [
    "https://i.imgur.com/S0zEQC9.png",
    "https://i.imgur.com/J94U3wg.png",
    "https://i.imgur.com/bvKgwsv.png"
  ],
  "パンジー": [
    "https://i.imgur.com/5HtJAAm.png",
    "https://i.imgur.com/12I9SvM.png",
    "https://i.imgur.com/DWVk7Rm.png"
  ],
  "たんぽぽ": [
    "https://i.imgur.com/uUljbtk.png",
    "https://i.imgur.com/ooju9UP.png",
    "https://i.imgur.com/NY2ArNg.png"
  ]
};

let currentFlower = null;
let growthStage = 0; // 0〜2

const flowerArea = document.getElementById("flowerArea");
const flowerTypeSelect = document.getElementById("flowerType");
const plantFlowerBtn = document.getElementById("plantFlowerBtn");
const waterBtn = document.getElementById("waterBtn");

plantFlowerBtn.addEventListener("click", () => {
  currentFlower = flowerTypeSelect.value;
  growthStage = 0;
  updateFlowerImage();
  waterBtn.disabled = false;
});

waterBtn.addEventListener("click", () => {
  if (currentFlower === null) return;
  if (growthStage < 2) {
    growthStage++;
    updateFlowerImage();
    if (growthStage === 2) {
      alert("花が満開になりました！");
    }
  }
});

function updateFlowerImage() {
  flowerArea.innerHTML = "";
  if (!currentFlower) return;

  const img = document.createElement("img");
  img.src = flowerImages[currentFlower][growthStage];
  img.alt = `${currentFlower} の成長段階 ${growthStage + 1}`;
  flowerArea.appendChild(img);
}