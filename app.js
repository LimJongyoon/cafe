let RECIPES = {};
let selectedMenu = null;
let selectedType = "ice";   // 기본 HOT 선택

// ---------------------------
// JSON 로드
// ---------------------------
fetch("recipes.json")
  .then(res => res.json())
  .then(data => {
    RECIPES = data;
  });

const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

const btnHot = document.getElementById("btn-hot");
const btnIce = document.getElementById("btn-ice");
const qrBox = document.getElementById("qrShare");

btnIce.classList.add("active-ice");


// ========================================================
// 1) 검색창 입력 (자동완성 + 박스 숨김)
// ========================================================
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  suggestions.innerHTML = "";

  // 검색창 비면 모든 박스 숨김
  if (!q) {
    suggestions.style.display = "none";
    clearBoxes();
    return;
  }

  qrBox.style.display = "none";

  const list = Object.keys(RECIPES).filter(name => name.includes(q));

  if (list.length > 0) suggestions.style.display = "block";
  else suggestions.style.display = "none";

  list.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      searchInput.value = item;
      selectedMenu = item;
      suggestions.innerHTML = "";
      suggestions.style.display = "none";

      renderRecipe();
    });

    suggestions.appendChild(li);
  });
});


// ========================================================
// 2) HOT / ICE 버튼
// ========================================================
btnHot.addEventListener("click", () => {
  selectedType = "hot";
  btnHot.classList.add("active-hot");
  btnIce.classList.remove("active-ice");
  renderRecipe();
});

btnIce.addEventListener("click", () => {
  selectedType = "ice";
  btnIce.classList.add("active-ice");
  btnHot.classList.remove("active-hot");
  renderRecipe();
});


// ========================================================
// 3) 레시피 박스 출력
// ========================================================
function renderRecipe() {
  if (!selectedMenu || !selectedType) return;

  const data = RECIPES[selectedMenu]?.[selectedType];
  if (!data) {
    clearBoxes();
    return;
  }

  fillBox("box1", data.box1);
  fillBox("box2", data.box2);
  fillBox("box3", data.box3);
}


// 박스 내용 채우기
function fillBox(id, arr) {
  const box = document.getElementById(id);
  const parent = box.parentElement;  // 전체 recipe-box

  if (!arr || arr.length === 0) {
    parent.style.display = "none";
    box.innerHTML = "";
    return;
  }

  parent.style.display = "block";
  box.innerHTML = "";

  arr.forEach(line => {
    const [name, amount] = splitIngredient(line);
    const row = document.createElement("div");
    row.classList.add("ingredient-row");

    // 숫자 포함 여부
    const hasNumber = /\d/.test(amount);

    if (hasNumber) {
      const m = amount.match(/(\d+)(.*)/);
      const num = m[1];
      const unit = m[2];

      row.innerHTML = `
        <span>${name}</span>
        <span>
          <span class="num">${num}</span><span class="unit">${unit}</span>
        </span>
      `;
    } else {
      row.innerHTML = `
        <span>${name}</span>
        <span class="unit">${amount}</span>
      `;
    }

    box.appendChild(row);
  });
}


// ========================================================
// 4) 박스 전체 숨김 함수
// ========================================================
function clearBoxes() {
  document.querySelectorAll(".recipe-box").forEach(box => {
    box.style.display = "none";
    box.querySelector("div").innerHTML = "";
  });
}


// ========================================================
// 5) "이름 + 양" 분리 ("초코시럽 20g" → ["초코시럽","20g"])
// ========================================================
function splitIngredient(str) {
  const parts = str.trim().split(" ");
  const amount = parts.pop();
  const name = parts.join(" ");
  return [name, amount];
}


// ========================================================
// 6) 라이트/다크 모드 스위치
// ========================================================
document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function generateQR() {
  const url = window.location.href;

  new QRCode(document.getElementById("qrCanvas"), {
    text: url,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

generateQR();

searchInput.addEventListener("focus", () => {
  searchInput.value = "";     // 검색창 비우기
});
