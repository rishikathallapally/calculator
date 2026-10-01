const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");
const buttons = document.querySelectorAll(".button");
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");

let currentNumber = "0";
let previousNumber = "";
let operator = null;
let resetDisplay = false;
let history = [];

// Update calculator display

function updateDisplay() {
    currentDisplay.textContent = currentNumber;
    previousDisplay.textContent = previousNumber;
}

// Add numbers
function addNumber(number) {
    if (currentNumber === "Error") {
        currentNumber = "0";
    }
    if (currentNumber === "0" || resetDisplay) {
        currentNumber = number;
        resetDisplay = false;
    } else {
        currentNumber += number;
    }
    updateDisplay();
}

// Add decimal point
function addDecimal() {
    if (resetDisplay) {
        currentNumber = "0";
        resetDisplay = false;
    }
    if (!currentNumber.includes(".")) {
        currentNumber += ".";
    }
    updateDisplay();
}

// Select an operator
function selectOperator(selectedOperator) {
    if (currentNumber === "Error") {
        return;
    }
    if (operator !== null && !resetDisplay) {
        calculate();
    }
    previousNumber = currentNumber;
    operator = selectedOperator;
    resetDisplay = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    if (operator === null || previousNumber === "") {
        return;
    }
    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);
    let result;
    if (operator === "+") {
        result = firstNumber + secondNumber;
    }
    else if (operator === "-") {
        result = firstNumber - secondNumber;
    }
    else if (operator === "*") {
        result = firstNumber * secondNumber;
    }
    else if (operator === "/") {
        if (secondNumber === 0) {
            currentNumber = "Error";
            previousNumber = "Cannot divide by zero";
            operator = null;
            resetDisplay = true;
            updateDisplay();
            return;
        }
        result = firstNumber / secondNumber;
    }

    let displayOperator = operator;
    if (operator === "*") {
        displayOperator = "×";
    }
    if (operator === "/") {
        displayOperator = "÷";
    }
    if (operator === "-") {
        displayOperator = "−";
    }

    const expression =
        firstNumber + " " +
        displayOperator + " " +
        secondNumber;
    currentNumber = formatResult(result);
    previousNumber = "";
    operator = null;
    resetDisplay = true;

    updateDisplay();
    addToHistory(expression, currentNumber);
}

// Format result
function formatResult(result) {
    if (!Number.isFinite(result)) {
        return "Error";
    }
    return Number(result.toFixed(10)).toString();
}

// Clear calculator
function clearCalculator() {
    currentNumber = "0";
    previousNumber = "";
    operator = null;
    resetDisplay = false;
    updateDisplay();
}

// Delete last number
function deleteNumber() {
    if (resetDisplay || currentNumber === "Error") {
        return;
    }
    if (currentNumber.length === 1) {
        currentNumber = "0";
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }
    updateDisplay();
}

// Percentage
function calculatePercentage() {
    if (currentNumber === "Error") {
        return;
    }
    currentNumber =
        (parseFloat(currentNumber) / 100).toString();
    updateDisplay();
}

// Positive / Negative
function changeSign() {
    if (currentNumber === "0" || currentNumber === "Error") {
        return;
    }
    if (currentNumber.startsWith("-")) {
        currentNumber = currentNumber.substring(1);
    } else {
        currentNumber = "-" + currentNumber;
    }
    updateDisplay();
}

// Button clicks
buttons.forEach(button => {
    button.addEventListener("click", function () {
        if (button.dataset.number !== undefined) {
            addNumber(button.dataset.number);
        }
        else if (button.dataset.operator !== undefined) {
            selectOperator(button.dataset.operator);
        }
        else if (button.dataset.action !== undefined) {
            const action = button.dataset.action;
            if (action === "clear") {
                clearCalculator();
            }
            else if (action === "delete") {
                deleteNumber();
            }
            else if (action === "percentage") {
                calculatePercentage();
            }
            else if (action === "sign") {
                changeSign();
            }
            else if (action === "decimal") {
                addDecimal();
            }
            else if (action === "calculate") {
                calculate();
            }
        }
    });
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key >= "0" && key <= "9") {
        addNumber(key);
    }
    else if (key === ".") {
        addDecimal();
    }
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        selectOperator(key);
    }
    else if (key === "Enter" || key === "=") {
        calculate();
    }
    else if (key === "Backspace") {
        deleteNumber();
    }
    else if (key === "Escape") {
        clearCalculator();
    }
    else if (key === "%") {
        calculatePercentage();
    }
});

// Add calculation to history
function addToHistory(expression, result) {
    history.unshift({
        expression: expression,
        result: result
    });
    saveHistory();
    showHistory();
}

// Save history in browser
function saveHistory() {
    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );
}

// Load history
function loadHistory() {
    const savedHistory =
        localStorage.getItem("calculatorHistory");
    if (savedHistory) {
        history = JSON.parse(savedHistory);
    }
    showHistory();
}

// Show history
function showHistory() {
    historyList.innerHTML = "";
    if (history.length === 0) {
        historyList.innerHTML =
            '<p class="empty-history">No calculations yet.</p>';
        return;
    }

    history.forEach(function (item) {
        const historyItem =
            document.createElement("div");
        historyItem.classList.add("history-item");
        const expression =
            document.createElement("div");
        expression.classList.add("history-expression");
        expression.textContent = item.expression;

        const result =
            document.createElement("div");
        result.classList.add("history-result");
        result.textContent = item.result;

        historyItem.appendChild(expression);
        historyItem.appendChild(result);
        historyList.appendChild(historyItem);
    });
}

// Open / close history
historyToggle.addEventListener("click", function () {
    historyPanel.classList.toggle("show");
});

// Clear history
clearHistory.addEventListener("click", function () {
    history = [];
    localStorage.removeItem("calculatorHistory");
    showHistory();
});

// Start calculator

loadHistory();
updateDisplay();