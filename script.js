const previousDisplay = document.getElementById("previousDisplay");
const currentDisplay = document.getElementById("currentDisplay");

let currentInput = "0";
let previousValue = null;
let currentOperator = null;
let resultJustComputed = false;

function updateDisplay() {
  currentDisplay.innerText = currentInput;
  if (currentOperator && previousValue !== null) {
    previousDisplay.innerText = `${previousValue} ${currentOperator}`;
  } else {
    previousDisplay.innerText = "";
  }
}

function appendNumber(char) {
  if (resultJustComputed) {
    currentInput = "0";
    resultJustComputed = false;
  }

  if (currentInput === "0" && char !== ".") {
    currentInput = char;
  } else if (char === "." && currentInput.includes(".")) {
    return;
  } else {
    currentInput += char;
  }
  updateDisplay();
}

function chooseOperator(op) {
  const currNum = parseFloat(currentInput);

  if (previousValue !== null && currentOperator && !resultJustComputed) {
    const inter = compute();
    if (inter === null) return;
    previousValue = inter;
  } else {
    previousValue = currNum;
  }

  currentOperator = op;
  currentInput = "0";
  resultJustComputed = false;
  updateDisplay();
}

function compute() {
  if (previousValue === null || currentOperator === null)
    return parseFloat(currentInput);

  const curr = parseFloat(currentInput);
  let res;

  if (currentOperator === "+") res = previousValue + curr;
  else if (currentOperator === "-") res = previousValue - curr;
  else if (currentOperator === "*") res = previousValue * curr;
  else if (currentOperator === "/") {
    if (curr === 0) {
      showError("Error: Division by 0");
      return null;
    }
    res = previousValue / curr;
  }
  else if (currentOperator === "%") {
    if (curr === 0) {
      showError("Error: Modulo by 0");
      return null;
    }
    res = previousValue % curr;
  }
  else {
    showError("Error");
    return null;
  }

  return normalizeResult(res);
}

function normalizeResult(num) {
  if (Math.abs(num - Math.round(num)) < 1e-12) return Math.round(num);
  return parseFloat(num.toFixed(10));
}

function handleEqual() {
  const computed = compute();
  if (computed === null) return;
  currentInput = computed.toString();
  previousValue = null;
  currentOperator = null;
  resultJustComputed = true;
  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  previousValue = null;
  currentOperator = null;
  resultJustComputed = false;
  updateDisplay();
}

function squareCurrent() {
  const num = parseFloat(currentInput);
  const sq = normalizeResult(num * num);
  currentInput = sq.toString();
  resultJustComputed = true;
  updateDisplay();
}

function backspace() {
  if (resultJustComputed) {
    currentInput = '0';
    resultJustComputed = false;
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '' || currentInput === '-') {
      currentInput = '0';
    }
  }
  updateDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".num-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      appendNumber(btn.getAttribute("data-value"));
    });
  });

  document.querySelectorAll(".op-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      chooseOperator(btn.getAttribute("data-value"));
    });
  });

  document.querySelectorAll(".control-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action === "clear") clearAll();
      else if (action === "square") squareCurrent();
      else if (action === "backspace") backspace();
    });
  });

  document.querySelector(".equal-btn").addEventListener("click", handleEqual);

  updateDisplay();
});
