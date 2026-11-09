(function () {
  "use strict";

  const STORAGE_KEY = "well-day-health-records-v1";
  const form = document.getElementById("health-form");
  const dateInput = document.getElementById("record-date");
  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const errorBox = document.getElementById("form-error");
  const resultBox = document.getElementById("result");
  const list = document.getElementById("records-list");
  const emptyList = document.getElementById("records-empty");
  const canvas = document.getElementById("bmi-chart");
  const emptyChart = document.getElementById("chart-empty");
  const recordsCount = document.getElementById("record-count");
  const { calculateBMI, categoryForBMI, validateInput } = window.HealthTrackerBMI;
  let records = loadRecords();

  function localDateString(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  function loadRecords() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
        && Number.isFinite(item.height) && Number.isFinite(item.weight)
        && Number.isFinite(item.bmi) && item.height > 0 && item.weight > 0);
    } catch (_error) {
      return [];
    }
  }

  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (_error) {
      showError("브라우저 저장 공간을 사용할 수 없어요. 저장 공간 설정을 확인해 주세요.");
      return false;
    }
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.style.color = "#b64b45";
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.style.color = "";
  }

  function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  }

  function renderResult(bmi) {
    const rounded = bmi.toFixed(1);
    const category = categoryForBMI(bmi);
    document.getElementById("bmi-value").textContent = rounded;
    document.getElementById("bmi-category").textContent = category.label;
    document.getElementById("bmi-guidance").textContent = category.guidance;
    resultBox.dataset.category = category.group;
    resultBox.hidden = false;
  }

  function renderRecords() {
    records.sort((a, b) => b.date.localeCompare(a.date));
    list.replaceChildren();
    emptyList.hidden = records.length > 0;
    recordsCount.textContent = `${records.length} 기록`;

    records.forEach((record) => {
      const row = document.createElement("div");
      row.className = "record-row";
      const description = document.createElement("div");
      const date = document.createElement("div");
      date.className = "record-date";
      date.textContent = formatDate(record.date);
      const details = document.createElement("div");
      details.className = "record-details";
      details.textContent = `키 ${record.height} cm · 몸무게 ${record.weight} kg`;
      description.append(date, details);

      const bmi = document.createElement("div");
      bmi.className = "record-bmi";
      const value = document.createElement("strong");
      value.textContent = record.bmi.toFixed(1);
      const label = document.createElement("span");
      label.textContent = categoryForBMI(record.bmi).label;
      bmi.append(value, label);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${formatDate(record.date)} 기록 삭제`);
      remove.addEventListener("click", () => deleteRecord(record.date));
      row.append(description, bmi, remove);
      list.append(row);
    });
    drawChart();
  }

  function deleteRecord(date) {
    records = records.filter((record) => record.date !== date);
    if (saveRecords()) renderRecords();
  }

  function drawChart() {
    const context = canvas.getContext("2d");
    if (!context) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);
    emptyChart.hidden = records.length > 0;
    if (!records.length) return;

    const ordered = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const values = ordered.map((record) => record.bmi);
    const min = Math.floor(Math.min(...values, 18) - 1);
    const max = Math.ceil(Math.max(...values, 24) + 1);
    const pad = { top: 15, right: 12, bottom: 27, left: 32 };
    const plotWidth = Math.max(1, width - pad.left - pad.right);
    const plotHeight = Math.max(1, height - pad.top - pad.bottom);
    const x = (index) => pad.left + (ordered.length === 1 ? plotWidth / 2 : (index / (ordered.length - 1)) * plotWidth);
    const y = (value) => pad.top + ((max - value) / (max - min)) * plotHeight;

    context.font = '10px "DM Sans", "Noto Sans KR", sans-serif';
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillStyle = "#9aa69d";
    [min, (min + max) / 2, max].forEach((tick) => {
      const tickY = y(tick);
      context.strokeStyle = "#edf1ed";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(pad.left, tickY);
      context.lineTo(width - pad.right, tickY);
      context.stroke();
      context.fillText(tick.toFixed(0), pad.left - 7, tickY);
    });

    context.strokeStyle = "#68a678";
    context.lineWidth = 2.5;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.beginPath();
    ordered.forEach((record, index) => {
      if (index === 0) context.moveTo(x(index), y(record.bmi));
      else context.lineTo(x(index), y(record.bmi));
    });
    context.stroke();

    ordered.forEach((record, index) => {
      context.beginPath();
      context.fillStyle = "#fff";
      context.arc(x(index), y(record.bmi), 4, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#68a678";
      context.lineWidth = 2;
      context.stroke();
    });

    context.fillStyle = "#9aa69d";
    context.textAlign = "center";
    context.textBaseline = "top";
    const indexes = ordered.length <= 4
      ? ordered.map((_, index) => index)
      : [0, Math.floor((ordered.length - 1) / 2), ordered.length - 1];
    [...new Set(indexes)].forEach((index) => {
      context.fillText(ordered[index].date.slice(5).replace("-", "/"), x(index), height - pad.bottom + 10);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();
    const date = dateInput.value;
    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);

    const validationMessage = validateInput(date, height, weight);
    if (validationMessage) return showError(validationMessage);

    const bmi = calculateBMI(height, weight);
    renderResult(bmi);
    const previous = records.find((record) => record.date === date);
    const next = { date, height, weight, bmi };
    records = previous ? records.map((record) => record.date === date ? next : record) : [...records, next];
    if (saveRecords()) {
      renderRecords();
      showError(previous ? "같은 날짜의 기록을 새 값으로 업데이트했어요." : "건강 기록을 저장했어요.");
      errorBox.style.color = "#477e5e";
    }
  });

  window.addEventListener("resize", drawChart);
  dateInput.value = localDateString(new Date());
  renderRecords();
})();
