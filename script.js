const flowerImages = {
  "チューリップ": ["https://i.imgur.com/eufdO25.png", "https://i.imgur.com/XmCOi5q.png", "https://i.imgur.com/bWZoPZE.png"]
};

const flowerRotation = ["チューリップ", "ひまわり", "ダリア"];
let waterCount = 0;
let stage = 0;

function saveGoals() {
  const goals = [];
  for (let i = 0; i < 10; i++) {
    const input = document.getElementById(`goal${i}`);
    if (input && input.value.trim()) {
      goals.push(input.value.trim());
    }
  }

  if (goals.length === 0) {
    alert("目標を1つ以上入力してください！");
    return;
  }

  localStorage.setItem("goals", JSON.stringify(goals));
  localStorage.setItem("goalsSet", "true");
  alert("目標を保存しました！");
  showGame();
}

function setupGoalInputs() {
  const goalInputs = document.getElementById("goalInputs");
  goalInputs.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = `goal${i}`;
    input.placeholder = `目標 ${i + 1}`;
    goalInputs.appendChild(input);
    goalInputs.appendChild(document.createElement("br"));
  }
}

function showGame() {
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").classList.remove("hidden");

  const goals = JSON.parse(localStorage.getItem("goals") || "[]");
  const goalList = document.getElementById("goalList");
  goalList.innerHTML = "";

  goals.forEach((goal, index) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox${index}`;
    checkbox.onchange = checkGoals;

    const label = document.createElement("label");
    label.htmlFor = `checkbox${index}`;
    label.innerText = goal;

    goalList.appendChild(checkbox);
    goalList.appendChild(label);
    goalList.appendChild(document.createElement("br"));
  });

  updateFlowerImage();
  updateWaterDisplay();
}

function checkGoals() {
  const goals = JSON.parse(localStorage.getItem("goals") || "[]");
  let allChecked = true;

  goals.forEach((_, index) => {
    if (!document.getElementById(`checkbox${index}`).checked) {
      allChecked = false;
    }
  });

  if (allChecked) {
    waterCount++;
    updateWaterDisplay();
    advanceStage();

    goals.forEach((_, index) => {
      document.getElementById(`checkbox${index}`).checked = false;
    });
  }
}

function updateWaterDisplay() {
  document.getElementById("waterDisplay").innerText = `水やり回数: ${waterCount}`;
}

function updateFlowerImage() {
  const flowerName = localStorage.getItem("currentFlower") || "チューリップ";
  const img = document.getElementById("flowerImage");
  const images = flowerImages[flowerName] || ["", "", ""];
  img.src = images[stage] || "";
  img.alt = flowerName;

  if (stage === 2) {
    document.getElementById("harvestBtn").classList.remove("hidden");
  } else {
    document.getElementById("harvestBtn").classList.add("hidden");
  }
}

function advanceStage() {
  if (stage < 2) {
    stage++;
    updateFlowerImage();
  }
}

function harvest() {
  alert("「" + localStorage.getItem("currentFlower") + "」を収穫しました！");
  stage = 0;
  waterCount = 0;
  updateWaterDisplay();

  const current = localStorage.getItem("currentFlower") || "チューリップ";
  const currentIndex = flowerRotation.indexOf(current);
  const nextIndex = (currentIndex + 1) % flowerRotation.length;
  const nextFlower = flowerRotation[nextIndex];
  localStorage.setItem("currentFlower", nextFlower);

  updateFlowerImage();
}

function changeBackgroundColor() {
  const selectedColor = document.getElementById("bgColor").value;
  document.body.style.backgroundColor = selectedColor;
  localStorage.setItem("backgroundColor", selectedColor);
}

function editGoals() {
  document.getElementById("game").classList.add("hidden");
  setupGoalInputs();
  const savedGoals = JSON.parse(localStorage.getItem("goals") || "[]");

  savedGoals.forEach((goal, index) => {
    const input = document.getElementById(`goal${index}`);
    if (input) {
      input.value = goal;
    }
  });

  document.getElementById("setup").style.display = "block";
}

window.onload = function () {
  const today = new Date().toLocaleDateString();
  document.getElementById("dateDisplay").innerText = `今日の日付: ${today}`;

  const savedColor = localStorage.getItem("backgroundColor");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    document.getElementById("bgColor").value = savedColor;
  }

  if (localStorage.getItem("goalsSet") === "true") {
    showGame();
  } else {
    setupGoalInputs();
    document.getElementById("setup").style.display = "block";
  }
