document.addEventListener('DOMContentLoaded', function () {
    const displayPrevious = document.querySelector('.previous-operand');
    const displayCurrent = document.querySelector('.current-operand');
    const buttons = document.querySelectorAll('button');

    let currentOperand = '';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetDisplay = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                appendNumber(button.textContent);
            } else if (button.classList.contains('operator')) {
                chooseOperation(button.textContent);
            } else if (button.classList.contains('equals')) {
                compute();
            } else if (button.classList.contains('clear')) {
                clear();
            } else if (button.classList.contains('delete')) {
                deleteNumber();
            }
            updateDisplay();
        });
    });

    document.addEventListener('keydown', event => {
        if (/[0-9]/.test(event.key)) {
            appendNumber(event.key);
        } else if (event.key === '.') {
            appendNumber(event.key);
        } else if (event.key === '+' || event.key === '-' || event.key === '*') {
            chooseOperation(event.key);
        } else if (event.key === '/') {
            event.preventDefault();
            chooseOperation('÷');
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            compute();
        } else if (event.key === 'Backspace') {
            deleteNumber();
        } else if (event.key === 'Escape') {
            clear();
        } else if (event.key === '%') {
            chooseOperation('%');
        }
        updateDisplay();
    });

    function appendNumber(number) {
        if (shouldResetDisplay) {
            currentOperand = '';
            shouldResetDisplay = false;
        }

        if (number === '.' && currentOperand.includes('.')) return;

        if (number === '.' && currentOperand === '') {
            currentOperand = '0.';
        } else {
            // Prevent numbers from being too long
            if (currentOperand.length >= 12) return;

            currentOperand += number;
        }
    }

    function chooseOperation(op) {
        if (currentOperand === '' && previousOperand === '') return;

        if (previousOperand !== '') {
            compute();
        }

        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        currentOperand = computation.toString();
        if (currentOperand.length > 12) {
            currentOperand = parseFloat(currentOperand).toExponential(6);
        }

        operation = undefined;
        previousOperand = '';
        shouldResetDisplay = true;
    }

    function clear() {
        currentOperand = '';
        previousOperand = '';
        operation = undefined;
    }

    function deleteNumber() {
        currentOperand = currentOperand.toString().slice(0, -1);
        if (currentOperand === '') {
            currentOperand = '0';
            shouldResetDisplay = true;
        }
    }

    function updateDisplay() {
        displayCurrent.textContent = formatDisplayNumber(currentOperand);

        if (operation != null) {
            const operatorSymbol =
                operation === '+' ? '+' :
                    operation === '-' ? '-' :
                        operation === '×' ? '×' :
                            operation === '÷' ? '÷' :
                                operation === '%' ? '%' : '';

            displayPrevious.textContent = `${formatDisplayNumber(previousOperand)} ${operatorSymbol}`;
        } else {
            displayPrevious.textContent = '';
        }
    }

    function formatDisplayNumber(num) {
        if (num === '') return '0';

        const number = parseFloat(num);
        if (isNaN(number)) return '0';

        // Format large numbers with exponent notation
        if (num.length > 12) {
            return number.toExponential(6);
        }

        return num;
    }

    updateDisplay();
});