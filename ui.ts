import {
    GameState,
    HistoryEntry,
    generateSecret,
    evaluateGuess,
    isValidGuess,
    createDigitValidator,
} from './game.js';

const currentSettings = {
    length: 4,
    base: 10,
};

let activeGameSecret = '';
let gameHistory: HistoryEntry[] = [];

export function renderSetupScreen(): void {
    const app = document.body;
    while (app.firstChild) {
        app.removeChild(app.firstChild);
    }

    const title = document.createElement('h1');
    title.textContent = 'Игра: Быки и Коровы';
    app.appendChild(title);

    const setupContainer = document.createElement('div');
    setupContainer.className = 'setup-container';

    const baseLabel = document.createElement('label');
    baseLabel.textContent = 'Система счисления: ';
    const baseSelect = document.createElement('select');

    const systems = [
        { value: '2', text: 'Двоичная (bin)' },
        { value: '8', text: 'Восьмеричная (oct)' },
        { value: '10', text: 'Десятичная (dec)' },
        { value: '16', text: 'Шестнадцатеричная (hex)' },
    ];

    systems.forEach((sys) => {
        const option = document.createElement('option');
        option.value = sys.value;
        option.textContent = sys.text;
        if (Number(sys.value) === currentSettings.base) option.selected = true;
        baseSelect.appendChild(option);
    });

    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = ' Длина числа: ';
    const lengthSelect = document.createElement('select');

    function updateLengthOptions(selectedBase: number) {
        while (lengthSelect.firstChild) {
            lengthSelect.removeChild(lengthSelect.firstChild);
        }
        for (let i = 2; i <= 6; i++) {
            if (selectedBase === 2 && i !== 2) continue;
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i);
            if (i === currentSettings.length) option.selected = true;
            lengthSelect.appendChild(option);
        }
    }

    updateLengthOptions(currentSettings.base);

    baseSelect.addEventListener('change', () => {
        currentSettings.base = Number(baseSelect.value);
        if (currentSettings.base === 2) currentSettings.length = 2;
        updateLengthOptions(currentSettings.base);
    });

    lengthSelect.addEventListener('change', () => {
        currentSettings.length = Number(lengthSelect.value);
    });

    const startButton = document.createElement('button');
    startButton.textContent = 'Старт игры';

    startButton.addEventListener('click', () => {
        activeGameSecret = generateSecret(
            currentSettings.length,
            currentSettings.base,
        );
        gameHistory = [];
        console.log('Секрет:', activeGameSecret);
        renderGameScreen();
    });

    setupContainer.appendChild(baseLabel);
    setupContainer.appendChild(baseSelect);
    setupContainer.appendChild(lengthLabel);
    setupContainer.appendChild(lengthSelect);
    setupContainer.appendChild(startButton);
    app.appendChild(setupContainer);
}

function renderGameScreen(): void {
    const app = document.body;
    while (app.firstChild) {
        app.removeChild(app.firstChild);
    }

    const title = document.createElement('h2');
    title.textContent = `Угадайте число (длина: ${currentSettings.length}, база: ${currentSettings.base})`;
    app.appendChild(title);

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';

    const guessInput = document.createElement('input');
    guessInput.type = 'text';
    guessInput.maxLength = currentSettings.length;
    guessInput.placeholder = 'Ваш вариант';

    const isCharValid = createDigitValidator(currentSettings.base);
    guessInput.addEventListener('input', () => {
        const val = guessInput.value;
        if (val.length > 0 && !isCharValid(val[val.length - 1])) {
            guessInput.value = val.slice(0, -1);
        }
    });

    const checkButton = document.createElement('button');
    checkButton.textContent = 'Проверить';

    const historyList = document.createElement('div');
    historyList.className = 'history-list';

    function updateHistoryUI() {
        while (historyList.firstChild) {
            historyList.removeChild(historyList.firstChild);
        }
        gameHistory.forEach((entry) => {
            const item = document.createElement('div');
            item.textContent = `Попытка: ${entry.guess} | Быки: ${entry.bulls}, Коровы: ${entry.cows}`;
            historyList.appendChild(item);
        });
    }

    checkButton.addEventListener('click', () => {
        const currentGuess = guessInput.value;

        if (
            !isValidGuess(
                currentGuess,
                currentSettings.length,
                currentSettings.base,
            )
        ) {
            alert(
                'Неверный формат ввода! Проверьте длину и уникальность цифр.',
            );
            return;
        }

        const result = evaluateGuess(activeGameSecret, currentGuess);
        const newEntry: HistoryEntry = { guess: currentGuess, ...result };

        gameHistory = [...gameHistory, newEntry];

        updateHistoryUI();
        guessInput.value = '';

        if (result.bulls === currentSettings.length) {
            alert('Поздравляем! Вы победили!');
            renderSetupScreen();
        }
    });

    gameContainer.appendChild(guessInput);
    gameContainer.appendChild(checkButton);
    gameContainer.appendChild(historyList);
    app.appendChild(gameContainer);
}

renderSetupScreen();
