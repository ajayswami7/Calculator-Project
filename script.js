// Grab display elements
const previousDisplay = document.getElementById("previousDisplay");
const currentDisplay = document.getElementById("currentDisplay");

// State
let currentInput = "0"; // current typed number as string
let previousValue = null; // stored number for operation
let currentOperator = null; // pending operator: '+', '-', '*', '/',
let resultJustComputed = false;

// Update display visuals
function updateDisplay() {
  currentDisplay.innerText = currentInput;
  if (currentOperator && previousValue !== null) {
    previousDisplay.innerText = `${previousValue} ${currentOperator}`;
  } else {
    previousDisplay.innerText = "";
  }
}

// Append number or decimal
function appendNumber(char) {
  if (resultJustComputed) {
    // If last action was '=', start fresh when typing a new number
    currentInput = "0";
    resultJustComputed = false;
  }

  // prevent leading zeros like 00
  if (currentInput === "0" && char !== ".") {
    currentInput = char;
  } else if (char === "." && currentInput.includes(".")) {
    // ignore multiple decimals
    return;
  } else {
    currentInput += char;
  }
  updateDisplay();
}

// Choose operator (handles chaining)
function chooseOperator(op) {
  const currNum = parseFloat(currentInput);

  if (previousValue !== null && currentOperator && !resultJustComputed) {
    // compute intermediate result for chaining (e.g., 2 + 3 + 4)
    const inter = compute();
    if (inter === null) return; // error handled in compute
    previousValue = inter;
  } else {
    previousValue = currNum;
  }

  currentOperator = op;
  currentInput = "0";
  resultJustComputed = false;
  updateDisplay();
}

// Compute based on previousValue and current input
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
  } else {
    showError("Error");
    return null;
  }

  return normalizeResult(res);
}

// Normalize floating point results (trim artifacts)
function normalizeResult(num) {
  if (Math.abs(num - Math.round(num)) < 1e-12) return Math.round(num);
  return parseFloat(num.toFixed(10));
}

// Equal handler
function handleEqual() {
  const computed = compute();
  if (computed === null) return;
  currentInput = computed.toString();
  previousValue = null;
  currentOperator = null;
  resultJustComputed = true;
  updateDisplay();
}

// Clear all (AC)
function clearAll() {
  currentInput = "0";
  previousValue = null;
  currentOperator = null;
  resultJustComputed = false;
  updateDisplay();
}

// Square current input
function squareCurrent() {
  const num = parseFloat(currentInput);
  const sq = normalizeResult(num * num);
  currentInput = sq.toString();
  resultJustComputed = true;
  updateDisplay();
}

// Backspace - remove last digit
function backspace() {
  if (resultJustComputed) {
    // If last was result, reset instead of backspacing
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


// Setup event listeners using loops
document.addEventListener("DOMContentLoaded", () => {
  // Number buttons
  document.querySelectorAll(".num-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      appendNumber(btn.getAttribute("data-value"));
    });
  });

  // Operator buttons
  document.querySelectorAll(".op-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      chooseOperator(btn.getAttribute("data-value"));
    });
  });

  // Control buttons (AC, square, x^2)
  document.querySelectorAll(".control-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action === "clear") clearAll();
      else if (action === "square") squareCurrent();
      else if (action === "backspace") backspace();
    });
  });

  // Equal
  document.querySelector(".equal-btn").addEventListener("click", handleEqual);

  // Initialize display
  updateDisplay();
});
