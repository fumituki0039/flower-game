const flowerImages = {
  "チューリップ": [
    "https://i.imgur.com/eufdO25.png", // 芽
    "https://i.imgur.com/XmCOi5q.png", // つぼみ
    "https://i.imgur.com/bWZoPZE.png"  // 満開
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
  ],
  "ノースポール": [
    "https://i.imgur.com/KWi6yxW.png",
    "https://i.imgur.com/Zomu92R.png",
    "https://i.imgur.com/U3dybcw.png"
  ],
  "紫陽花": [
    "https://i.imgur.com/IEuiffh.png",
    "https://i.imgur.com/PIUJxMo.png",
    "https://i.imgur.com/VUs6wAM.png"
  ],
  "牡丹": [
    "https://i.imgur.com/raNKKSy.png",
    "https://i.imgur.com/67KjwRa.png",
    "https://i.imgur.com/kRogF9j.png"
  ],
  "鈴蘭": [
    "https://i.imgur.com/LTXCMJw.png",
    "https://i.imgur.com/3MIPBLA.png",
    "https://i.imgur.com/DmPQyVC.png"
  ],
  "百合": [
    "https://i.imgur.com/5zLTXOr.png",
    "https://i.imgur.com/vAK02qE.png",
    "https://i.imgur.com/XmJclu2.png"
  ],
  "薔薇": [
    "https://i.imgur.com/raNKKSy.png",
    "https://i.imgur.com/QXGc89i.png",
    "https://i.imgur.com/S1wnEto.png"
  ],
  "菜の花": [
    "https://i.imgur.com/IEuiffh.png",
    "https://i.imgur.com/XD4SHrE.png",
    "https://i.imgur.com/wZ7NO1c.png"
  ],
  "桜": [
    "https://i.imgur.com/sFzLxOT.png",
    "https://i.imgur.com/z0oMg4T.png",
    "https://i.imgur.com/ntaV1O0.png"
  ],
  "ラベンダー": [
    "https://i.imgur.com/LTXCMJw.png",
    "https://i.imgur.com/lqXySOx.png",
    "https://i.imgur.com/A1NOyBy.png"
  ],
  "物忘草": [
    "https://i.imgur.com/KWi6yxW.png",
    "https://i.imgur.com/z4z0eif.png",
    "https://i.imgur.com/1hIBOUb.png"
  ],
  "マリーゴールド": [
    "https://i.imgur.com/IEuiffh.png",
    "https://i.imgur.com/YZI3Aq7.png",
    "https://i.imgur.com/2oxlsKZ.png"
  ],
  "アネモネ": [
    "https://i.imgur.com/5zLTXOr.png",
    "https://i.imgur.com/yT1g3hM.png",
    "https://i.imgur.com/o0dqJ06.png"
  ],
  "デージー": [
    "https://i.imgur.com/LTXCMJw.png",
    "https://i.imgur.com/SdfVvPp.png",
    "https://i.imgur.com/pLjzW6q.png"
  ]
};

const flowerRotation = [
  "チューリップ",
  "ひまわり",
  "ダリア",
  "パンジー",
  "たんぽぽ",
  "ノースポール",
  "紫陽花",
  "牡丹",
  "鈴蘭",
  "百合",
  "薔薇",
  "菜の花",
  "桜",
  "ラベンダー",
  "物忘草",
  "マリーゴールド",
  "アネモネ",
  "デージー"
];

let waterCount = 0;
let stage = 0;
let currentFlowerIndex = 0;

function loadGameState() {
    waterCount = parseInt(localStorage.getItem('waterCount') || '0', 10);
    stage = parseInt(localStorage.getItem('stage') || '0', 10);
    currentFlowerIndex = parseInt(localStorage.getItem('currentFlowerIndex') || '0', 10);
}

function saveGameState() {
    localStorage.setItem('waterCount', waterCount.toString());
    localStorage.setItem('stage', stage.toString());
    localStorage.setItem('currentFlowerIndex', currentFlowerIndex.toString());
}

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
        const goalDiv = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox${index}`;
        checkbox.onchange = checkGoals;

        const label = document.createElement("label");
        label.htmlFor = `checkbox${index}`;
        label.innerText = goal;

        goalDiv.appendChild(checkbox);
        goalDiv.appendChild(label);
        goalList.appendChild(goalDiv);
    });

    loadGameState();
    updateFlowerImage();
    updateWaterDisplay();
}

function checkGoals() {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    let checkedCount = 0;

    goals.forEach((_, index) => {
        if (document.getElementById(`checkbox${index}`).checked) {
            checkedCount++;
        }
    });

    if (checkedCount === goals.length && goals.length > 0) {
        waterCount++;
        updateWaterDisplay();
        saveGameState(); // 水やり回数が増えたので状態を保存

        // ★★★ このif文の条件のみ変更 ★★★
        // waterCountが3の倍数になったら（かつステージが最大でなければ）花を成長させる
        if (waterCount % 3 === 0 && stage < 2) {
            advanceStage();
        }
        // ★★★ ここまで変更 ★★★

        goals.forEach((_, index) => {
            document.getElementById(`checkbox${index}`).checked = false;
        });
    }
}

function updateWaterDisplay() {
    document.getElementById("waterDisplay").innerText = `水やり回数: ${waterCount}`;
}

function updateFlowerImage() {
    const flowerName = flowerRotation[currentFlowerIndex];
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
        saveGameState();
    }
}

function harvest() {
    const harvestedFlowerName = flowerRotation[currentFlowerIndex];
    alert(`「${harvestedFlowerName}」を収穫しました！`);

    currentFlowerIndex = (currentFlowerIndex + 1) % flowerRotation.length;
    stage = 0;
    waterCount = 0;

    saveGameState();
    updateWaterDisplay();
    updateFlowerImage();
}

function changeBackgroundColor() {
    const selectedColor = document.getElementById("bgColor").value;
    document.body.style.backgroundColor = selectedColor;
    localStorage.setItem("backgroundColor", selectedColor);
}

function editGoals() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("setup").style.display = "block";

    setupGoalInputs();

    const savedGoals = JSON.parse(localStorage.getItem("goals") || "[]");
    savedGoals.forEach((goal, index) => {
        const input = document.getElementById(`goal${index}`);
        if (input) {
            input.value = goal;
        }
    });

    localStorage.setItem("goalsSet", "false");
}

window.onload = function () {
    const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById("dateDisplay").innerText = `今日の日付: ${today}`;

    const savedColor = localStorage.getItem("backgroundColor");
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
        document.getElementById("bgColor").value = savedColor;
    }

    loadGameState();

    if (localStorage.getItem("goalsSet") === "true") {
        showGame();
    } else {
        setupGoalInputs();
        document.getElementById("setup").style.display = "block";
    }
};
