
const flowerImages = {
  "チューリップ": ["https://i.imgur.com/eufdO25.png", "https://i.imgur.com/XmCOi5q.png", "https://i.imgur.com/bWZoPZE.png"],
  "ひまわり": ["https://i.imgur.com/Kb4QaOk.png", "https://i.imgur.com/gUTrmYM.png", "https://i.imgur.com/1l94l7N.png"],
  "ダリア": ["https://i.imgur.com/S0zEQC9.png", "https://i.imgur.com/J94U3wg.png", "https://i.imgur.com/bvKgwsv.png"],
  "パンジー": ["https://i.imgur.com/5HtJAAm.png", "https://i.imgur.com/12I9SvM.png", "https://i.imgur.com/DWVk7Rm.png"],
  "たんぽぽ": ["https://i.imgur.com/uUljbtk.png", "https://i.imgur.com/ooju9UP.png", "https://i.imgur.com/NY2ArNg.png"],
  "ノースポール": ["https://i.imgur.com/KWi6yxW.png", "https://i.imgur.com/Zomu92R.png", "https://i.imgur.com/U3dybcw.png"],
  "紫陽花": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/PIUJxMo.png", "https://i.imgur.com/VUs6wAM.png"],
  "牡丹": ["https://i.imgur.com/raNKKSy.png", "https://i.imgur.com/67KjwRa.png", "https://i.imgur.com/kRogF9j.png"],
  "鈴蘭": ["https://i.imgur.com/LTXCMJw.png", "https://i.imgur.com/3MIPBLA.png", "https://i.imgur.com/DmPQyVC.png"],
  "百合": ["https://i.imgur.com/5zLTXOr.png", "https://i.imgur.com/vAK02qE.png", "https://i.imgur.com/XmJclu2.png"],
  "薔薇": ["https://i.imgur.com/raNKKSy.png", "https://i.imgur.com/QXGc89i.png", "https://i.imgur.com/S1wnEto.png"],
  "菜の花": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/XD4SHrE.png", "https://i.imgur.com/wZ7NO1c.png"],
  "桜": ["https://i.imgur.com/sFzLxOT.png", "https://i.imgur.com/z0oMg4T.png", "https://i.imgur.com/ntaV1O0.png"],
  "ラベンダー": ["https://i.imgur.com/LTXCMJw.png", "https://i.imgur.com/lqXySOx.png", "https://i.imgur.com/A1NOyBy.png"],
  "勿忘草": ["https://i.imgur.com/KWi6yxW.png", "https://i.imgur.com/z4z0eif.png", "https://i.imgur.com/1hIBOUb.png"],
  "マリーゴールド": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/YZI3Aq7.png", "https://i.imgur.com/2oxlsKZ.png"],
  "アネモネ": ["https://i.imgur.com/5zLTXOr.png", "https://i.imgur.com/yT1g3hM.png", "https://i.imgur.com/o0dqJ06.png"],
  "デージー": ["https://i.imgur.com/LTXCMJw.png", "https://i.imgur.com/SdfVvPp.png", "https://i.imgur.com/pLjzW6q.png"]
};

const flowerRotation = [
  "チューリップ", "ひまわり", "ダリア", "パンジー", "たんぽぽ",
  "ガーベラ", "桜", "アネモネ", "ムスカリ", "菜の花",
  "鈴蘭", "ラベンダー", "薔薇", "ノースポール", "マリーゴールド",
  "牡丹", "百合", "紫陽花"
];

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

  localStorage.setItem("goals", JSON.stringify(goals));
  localStorage.setItem("goalsSet", "true");
  if (!localStorage.getItem("currentFlower")) {
    localStorage.setItem("currentFlower", "チューリップ");
  }
  document.getElementById("setup").style.display = "none";
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

  // 次の花へローテーション
  const current = localStorage.getItem("currentFlower") || "チューリップ";
  const currentIndex = flowerRotation.indexOf(current);
  const nextIndex = (currentIndex + 1) % flowerRotation.length;
  const nextFlower = flowerRotation[nextIndex];
  localStorage.setItem("currentFlower", nextFlower);

  updateFlowerImage();
}

function editGoals() {
  if (confirm("現在の目標を編集しますか？（内容は上書きされます）")) {
    localStorage.removeItem("goalsSet");
    localStorage.removeItem("goals");
    document.getElementById("game").classList.add("hidden");
    setupGoalInputs();
    document.getElementById("setup").style.display = "block";
  }
}

window.onload = function () {
  const today = new Date().toLocaleDateString();
  document.getElementById("dateDisplay").innerText = `今日の日付: ${today}`;

  if (localStorage.getItem("goalsSet") === "true") {
    showGame();
  } else {
    setupGoalInputs();
    document.getElementById("setup").style.display = "block";
  }
};
