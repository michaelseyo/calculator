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
    "*": multiply,
    "÷": divide,
}

const displayHTML = document.querySelector("span");
let memory = []; // stores all the recorded numbers & operators
let operatorBefore = false; // flag for checking
const zeroDivisionMessage = "you sure?";

const btns = Array.from(document.querySelectorAll("button"));
const displayableBtns = btns.filter(btn => /[0-9]/.test(btn.textContent));
const operatorBtns = btns.filter(btn => /[^Clear=0-9]/.test(btn.textContent)); 
const equalBtn = btns.find(btn => btn.textContent === "=");
const clearBtn = btns.find(btn => btn.textContent === "Clear");

function displaySelectedBtn() { 
    if (operatorBefore || displayHTML.textContent === zeroDivisionMessage) { 
        operatorBefore = false;
        displayHTML.textContent = "";
    } 
    displayHTML.textContent += this.textContent;
}

displayableBtns.forEach(dispBtn => dispBtn.addEventListener("click", displaySelectedBtn));

operatorBtns.forEach(operatorBtn => operatorBtn.addEventListener("click", function() {
    // get what is present on the display & stored in memory
    const num = parseInt(displayHTML.textContent);

    // only if input is a valid number, and we dont want to add the number if before is alrdy operator: + + 
    if (!Number.isNaN(num) && !operatorBefore) {
        memory.push(num);
    }
    
    // For intermediate operations; check if it is already a pair of numbers with operator present
    // actually.. can we use the same function in equal to evaluate?? (before adding the number);
    if (memory.length === 3) {
        console.log("operated");
        console.log(memory);
        const result = operate(...memory);
        // show result on display
        displayHTML.textContent = result;
        // reset memory
        memory.splice(0, memory.length); 
        memory.push(result);
    }
    // retrieve what operator it is

    const afterNum = parseInt(displayHTML.textContent);

    if (!operatorBefore) {
        const btnType = this.textContent;
        let operator = btnToOperator[`${btnType}`];
        memory.push(operator);
        // change flag; note we want to check if we did a + +, so we leave changing the flag at the end
        operatorBefore = true; 
    }
    console.log(memory);
}));

equalBtn.addEventListener("click", function() {
    // only if there is [number, operator] in memory, then calculate; for = bugs
    if (displayHTML.textContent === zeroDivisionMessage) {
            
    } else if (memory.length === 2) {
        const finalNum = parseInt(displayHTML.textContent);
        const error = checkDivisionByZero(finalNum);
        if (!error) {
            memory.push(finalNum);
            const result = operate(...memory);
            // show result on display
            displayHTML.textContent = result;
            // reset memory
            memory.splice(0, memory.length); 
        }
    }
});

function calculate() {
    const result = operate(...memory);
    // show result on display
    displayHTML.textContent = result;
    // reset memory
    memory.splice(0, memory.length); 
    return result;
}

clearBtn.addEventListener("click", function() {
    displayHTML.textContent = "";
    memory.splice(0, memory.length); // reset memory
});

function checkDivisionByZero(finalNum) {
    if (finalNum === 0 && memory[memory.length - 1] === divide) {
        displayHTML.textContent = zeroDivisionMessage;
        memory.splice(0, memory.length); // reset memory
        return true;
    }
    return false;
}

// clean up code for the buggy + + scenarios