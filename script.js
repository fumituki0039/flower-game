// 🔄 花の順番ローテーション
const flowerOrder = ["チューリップ", "ひまわり", "ダリア", "パンジー", "たんぽぽ"];

// 🖼️ 各花の画像セット（自分のURLに差し替えてね！）
const flowerImageSets = {
  "チューリップ": ["https://i.imgur.com/eufdO25.png", "https://i.imgur.com/XmCOi5q.png", "https://i.imgur.com/bWZoPZE.png"],
  "ひまわり": ["https://i.imgur.com/Kb4QaOk.png", "https://i.imgur.com/gUTrmYM.png", "https://i.imgur.com/1l94l7N.png"],
  "ダリア": ["https://i.imgur.com/S0zEQC9.png", "https://i.imgur.com/J94U3wg.png", "https://i.imgur.com/bvKgwsv.png"],
  "パンジー": ["https://i.imgur.com/5HtJAAm.png", "https://i.imgur.com/12I9SvM.png", "https://i.imgur.com/DWVk7Rm.png"],
  "たんぽぽ": ["https://i.imgur.com/uUljbtk.png", "https://i.imgur.com/ooju9UP.png", "https://i.imgur.com/NY2ArNg.png"]
};

// 🔐 保存キー
const goalsKey = "fixedGoals";
const wateredKey = "waterCount";
const dateKey = "lastDate";
const currentFlowerKey = "currentFlower";
const unlockedSeedsKey = "unlockedSeeds";
const streakKey = "streakCount";

let flowerType = localStorage.getItem(currentFlowerKey) || "チューリップ";

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
    showSeedInventory();
  }
}

function saveGoals() {
  const inputs = document.querySelectorAll("#goalInputs input");
  const goals = Array.from(inputs).map(input => input.value || "（空欄）");
  localStorage.setItem(goalsKey, JSON.stringify(goals));
  localStorage.setItem(wateredKey, "0");
  localStorage.setItem(dateKey, new Date().toLocaleDateString());
  localStorage.setItem(currentFlowerKey, "チューリップ");
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
  if (count >= 9) return;

  count++;
  localStorage.setItem(wateredKey, count.toString());
  updateFlower();
  alert("水やりできました！");

  if (count === 9) grantNewSeed(); // 収穫可能になったら
}

function updateFlower() {
  const count = parseInt(localStorage.getItem(wateredKey) || "0");
  const flowerImages = flowerImageSets[flowerType];
  const img = document.getElementById("flowerImage");

  // 水やり回数2回ごとに成長段階1つアップ
  if (count < 2) {
    img.src = flowerImages[0];
  } else if (count < 4) {
    img.src = flowerImages[1];
  } else if (count < 6) {
    img.src = flowerImages[1];
  } else if (count < 8) {
    img.src = flowerImages[2];
  } else {
    img.src = flowerImages[2];
  }

  document.getElementById("waterDisplay").textContent = `水やり回数: ${count}`;

  if (count >= 8) {
    document.getElementById("harvestBtn").classList.remove("hidden");
  } else {
    document.getElementById("harvestBtn").classList.add("hidden");
  }
}

function harvest() {
  const currentIndex = flowerOrder.indexOf(flowerType);
  const nextIndex = (currentIndex + 1) % flowerOrder.length;
  const nextFlower = flowerOrder[nextIndex];
  let seeds = JSON.parse(localStorage.getItem(unlockedSeedsKey)) || [];

  if (seeds.includes(nextFlower)) {
    flowerType = nextFlower;
    seeds = seeds.filter(s => s !== nextFlower);
    alert(`${nextFlower}の種を植えました！`);
  } else {
    flowerType = "チューリップ";
    alert("新しい種がないため、チューリップを植えました。");
  }

  localStorage.setItem(unlockedSeedsKey, JSON.stringify(seeds));
  localStorage.setItem(currentFlowerKey, flowerType);
  localStorage.setItem(wateredKey, "0");
  document.getElementById("harvestBtn").classList.add("hidden");
  updateFlower();
  showSeedInventory();
  location.reload();
}

function grantNewSeed() {
  let streak = parseInt(localStorage.getItem(streakKey) || "0");
  streak++;
  localStorage.setItem(streakKey, streak.toString());

  if (streak % 7 === 0) {
    const current = localStorage.getItem(currentFlowerKey) || "チューリップ";
    const index = flowerOrder.indexOf(current);
    const next = flowerOrder[(index + 1) % flowerOrder.length];

    let seeds = JSON.parse(localStorage.getItem(unlockedSeedsKey)) || [];
    seeds.push(next);
    localStorage.setItem(unlockedSeedsKey, JSON.stringify(seeds));
    alert(`1週間達成🎉「${next}の種」を手に入れました！`);
  }
}

function showSeedInventory() {
  const box = document.getElementById("seedBox");
  const seeds = JSON.parse(localStorage.getItem(unlockedSeedsKey)) || [];
  box.innerHTML = "<h3>アイテムボックス</h3>";
  if (seeds.length === 0) {
    box.innerHTML += "<p>（種はありません）</p>";
  } else {
    seeds.forEach(s => {
      const item = document.createElement("div");
      item.textContent = `🌱 ${s}の種`;
      box.appendChild(item);
    });
  }
}

setupUI();