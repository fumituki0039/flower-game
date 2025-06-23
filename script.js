
const flowerOrder = ["チューリップ", "ひまわり", "ダリア", "パンジー", "たんぽぽ", "ガーベラ", "桜", "アネモネ", "ムスカリ", "菜の花", "鈴蘭", "ラベンダー", "バラ", "ノースポール", "マリーゴールド", "ボタン", "ユリ", "紫陽花"];

const flowerImageSets = {
  "チューリップ": ["https://i.imgur.com/eufdO25.png", "https://i.imgur.com/XmCOi5q.png", "https://i.imgur.com/bWZoPZE.png"],
  "ひまわり": ["https://i.imgur.com/Kb4QaOk.png", "https://i.imgur.com/gUTrmYM.png", "https://i.imgur.com/1l94l7N.png"],
  "ダリア": ["https://i.imgur.com/S0zEQC9.png", "https://i.imgur.com/J94U3wg.png", "https://i.imgur.com/bvKgwsv.png"],
  "パンジー": ["https://i.imgur.com/5HtJAAm.png", "https://i.imgur.com/12I9SvM.png", "https://i.imgur.com/DWVk7Rm.png"],
  "たんぽぽ": ["https://i.imgur.com/uUljbtk.png", "https://i.imgur.com/ooju9UP.png", "https://i.imgur.com/NY2ArNg.png"],
  "ガーベラ": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/PIUJxMo.png", "https://i.imgur.com/VUs6wAM.png"],
  "桜": ["https://i.imgur.com/sFzLxOT.png", "https://i.imgur.com/z0oMg4T.png", "https://i.imgur.com/ntaV1O0.png"],
  "アネモネ": ["https://i.imgur.com/5zLTXOr.png", "https://i.imgur.com/yT1g3hM.png", "https://i.imgur.com/o0dqJ06.png"],
  "ムスカリ": ["https://i.imgur.com/KWi6yxW.png", "https://i.imgur.com/Zomu92R.png", "https://i.imgur.com/U3dybcw.png"],
  "菜の花": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/XD4SHrE.png", "https://i.imgur.com/wZ7NO1c.png"],
  "鈴蘭": ["https://i.imgur.com/LTXCMJw.png", "https://i.imgur.com/3MIPBLA.png", "https://i.imgur.com/DmPQyVC.png"],
  "ラベンダー": ["https://i.imgur.com/LTXCMJw.png", "https://i.imgur.com/lqXySOx.png", "https://i.imgur.com/A1NOyBy.png"],
  "バラ": ["https://i.imgur.com/raNKKSy.png", "https://i.imgur.com/QXGc89i.png", "https://i.imgur.com/S1wnEto.png"],
  "ノースポール": ["https://i.imgur.com/KWi6yxW.png", "https://i.imgur.com/Zomu92R.png", "https://i.imgur.com/U3dybcw.png"],
  "マリーゴールド": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/YZI3Aq7.png", "https://i.imgur.com/2oxlsKZ.png"],
  "ボタン": ["https://i.imgur.com/raNKKSy.png", "https://i.imgur.com/67KjwRa.png", "https://i.imgur.com/kRogF9j.png"],
  "ユリ": ["https://i.imgur.com/5zLTXOr.png", "https://i.imgur.com/vAK02qE.png", "https://i.imgur.com/XmJclu2.png"],
  "紫陽花": ["https://i.imgur.com/IEuiffh.png", "https://i.imgur.com/PIUJxMo.png", "https://i.imgur.com/VUs6wAM.png"]
};

const goalsKey = "fixedGoals";
const wateredKey = "waterCount";
const dateKey = "lastDate";
const currentFlowerKey = "currentFlower";

let flowerType = localStorage.getItem(currentFlowerKey) || flowerOrder[0];

function setupUI() {
  document.getElementById("dateDisplay").textContent = new Date().toLocaleDateString("ja-JP");
  const savedGoals = JSON.parse(localStorage.getItem(goalsKey));
  const today = new Date().toLocaleDateString();
  const lastDate = localStorage.getItem(dateKey);

  if (!savedGoals) {
    const inputArea = document.getElementById("goalInputs");
    for (let i = 0; i < 10; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `目標${i + 1}`;
      inputArea.appendChild(input);
      inputArea.appendChild(document.createElement("br"));
    }
  } else {
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    if (today !== lastDate) {
      localStorage.setItem(dateKey, today);
      for (let i = 0; i < savedGoals.length; i++) {
        localStorage.removeItem(`goal${i}`);
      }
    }

    showGoals(savedGoals);
    updateFlower();
  }
}

function saveGoals() {
  const inputs = document.querySelectorAll("#goalInputs input");
  const goals = Array.from(inputs).map(input => input.value || "（空欄）");
  localStorage.setItem(goalsKey, JSON.stringify(goals));
  localStorage.setItem(wateredKey, "0");
  localStorage.setItem(dateKey, new Date().toLocaleDateString());
  setupUI();
}

function showGoals(goals) {
  const list = document.getElementById("goalList");
  list.innerHTML = "";
  let allChecked = true;
  goals.forEach((goal, i) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = localStorage.getItem(`goal${i}`) === "true";
    checkbox.onchange = () => {
      localStorage.setItem(`goal${i}`, checkbox.checked);
      checkAllGoals(goals.length);
    };
    label.appendChild(checkbox);
    label.append(" " + goal);
    list.appendChild(label);
    list.appendChild(document.createElement("br"));
    if (!checkbox.checked) allChecked = false;
  });
  if (allChecked) doWatering();
}

function checkAllGoals(count) {
  let allChecked = true;
  for (let i = 0; i < count; i++) {
    if (localStorage.getItem(`goal${i}`) !== "true") {
      allChecked = false;
      break;
    }
  }
  if (allChecked) doWatering();
}

function doWatering() {
  let count = parseInt(localStorage.getItem(wateredKey) || "0");
  if (count >= 4) return;
  count++;
  localStorage.setItem(wateredKey, count.toString());
  updateFlower();
  alert("水やりできました！");
}

function updateFlower() {
  const count = parseInt(localStorage.getItem(wateredKey) || "0");
  const flowerImages = flowerImageSets[flowerType] || [];
  const img = document.getElementById("flowerImage");
  if (flowerImages.length < 3) {
    img.alt = flowerType + "（画像準備中）";
    img.src = "";
  } else if (count < 2) {
    img.src = flowerImages[0];
  } else if (count < 4) {
    img.src = flowerImages[1];
  } else {
    img.src = flowerImages[2];
    document.getElementById("harvestBtn").classList.remove("hidden");
  }
  document.getElementById("waterDisplay").textContent = `水やり回数: ${count}`;
}

function harvest() {
  const currentIndex = flowerOrder.indexOf(flowerType);
  const nextIndex = (currentIndex + 1) % flowerOrder.length;
  flowerType = flowerOrder[nextIndex];
  localStorage.setItem(currentFlowerKey, flowerType);
  localStorage.setItem(wateredKey, "0");
  document.getElementById("harvestBtn").classList.add("hidden");
  updateFlower();
  location.reload();
}

setupUI();
