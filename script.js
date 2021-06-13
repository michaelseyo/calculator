function add(a, b) {
    return a + b;
}

function subtract(a,b) {
    return a - b;
}

function multiply(a,b) {
    return a * b;
}

function divide(a,b) {
    return a / b;
}

function operate(a, operator, b) {
    return operator(a,b);
}

const btnToOperator = {
    "+": add,
    "-": subtract,
    "x": multiply,
    "÷": divide,
}

const displayHTML = document.querySelector("span");
let memory = []; 
let operatorBefore = false; 
let equalsBefore = false; 
const zeroDivisionMessage = "you sure?";

const btns = Array.from(document.querySelectorAll("button"));
const displayableBtns = btns.filter(btn => /[0-9.]/.test(btn.textContent));
const operatorBtns = btns.filter(btn => /[^ClearDelete=0-9.]/.test(btn.textContent)); 
const equalBtn = btns.find(btn => btn.textContent === "=");
const clearBtn = btns.find(btn => btn.textContent === "Clear");
const deleteBtn = btns.find(btn => btn.textContent === "Delete");

function displaySelectedBtn() { 
    if (equalsBefore) {
        equalsBefore = false;
        displayHTML.textContent = "";
    }

    if (operatorBefore || displayHTML.textContent === zeroDivisionMessage) { 
        operatorBefore = false;
        displayHTML.textContent = "";
    } 

    if (displayHTML.textContent.length === 9) {
        return;
    }

    if (!/[.]/.test(displayHTML.textContent) || this.textContent !== ".") {
        displayHTML.textContent += this.textContent;
    }
}

// round to 7dp
function roundNumber(num) {
    return Math.round(num * 10000000) / 10000000;
}

displayableBtns.forEach(dispBtn => dispBtn.addEventListener("click", displaySelectedBtn));

operatorBtns.forEach(operatorBtn => operatorBtn.addEventListener("click", function() {
    const num = (displayHTML.textContent !== "") ? Number(displayHTML.textContent) : NaN;

    // check validity of current display to be added
    if (!Number.isNaN(num) && !operatorBefore) {
        memory.push(num);
    }
    
    // to proceed with intermediate operations where memory = [num, operator, num]
    if (memory.length === 3) {
        const result = roundNumber(operate(...memory));
        displayHTML.textContent = result;
        memory.splice(0, memory.length); 
        memory.push(result);
    }

    // check validity of potential new input for adding operator next
    const afterNum = parseInt(displayHTML.textContent);
    if (!Number.isNaN(afterNum) && !operatorBefore) {
        const btnType = this.textContent;
        let operator = btnToOperator[`${btnType}`];
        memory.push(operator);
    }
    operatorBefore = true;
    console.log(memory);
}));

// checks zero division error and changes display to error if so
function checkDivisionByZero(finalNum) {
    if (finalNum === 0 && memory[memory.length - 1] === divide) {
        displayHTML.textContent = zeroDivisionMessage;
        memory.splice(0, memory.length);
        return true;
    }
    return false;
}

equalBtn.addEventListener("click", function() {
    // only if there is [number, operator] in memory, then calculate; for = bugs after evaluating alrdy
    if ((memory.length === 2) && (displayHTML.textContent !== zeroDivisionMessage)) {
        const finalNum = Number(displayHTML.textContent);
        const error = checkDivisionByZero(finalNum);
        if (!error) {
            memory.push(finalNum);
            const result = roundNumber(operate(...memory));
            displayHTML.textContent = result;
            memory.splice(0, memory.length); 
            equalsBefore = true;
        }
    }
});

clearBtn.addEventListener("click", function() {
    displayHTML.textContent = "";
    memory.splice(0, memory.length); 
});

deleteBtn.addEventListener("click", function() {
    displayHTML.textContent = displayHTML.textContent.slice(0, -1);
});

// keyboard support
window.addEventListener("keydown", function(e) {
    let key;
    switch (e.key) {
        case "*":
            key = "x";
            break;
        case "/":
            key = "÷";
            break;
        case "Escape":
            key = "Clear";
            break;
        case "Backspace":
            key = "Delete";
            break;
        default:
            key = e.key;
    }
    const selectedBtn = (/[ClearDelete=0-9.+-x÷]/.test(key)) ? btns.find(btn => btn.textContent === key) : null;
    if (selectedBtn) {
        selectedBtn.click();
    }
});
