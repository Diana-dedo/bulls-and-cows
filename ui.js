import { generateSecret, evaluateGuess, isValidGuess, createDigitValidator, } from './game.js';
const currentSettings = {
    length: 4,
    base: 10,
};
let activeGameSecret = '';
let gameHistory = [];
let startTime = 0;
function getRecords() {
    const data = localStorage.getItem('bulls_cows_records');
    return data ? JSON.parse(data) : [];
}
function saveRecord(attempts, timeInSeconds) {
    const records = getRecords();
    const newRecord = {
        length: currentSettings.length,
        base: currentSettings.base,
        attempts: attempts,
        time: timeInSeconds,
        date: new Date().toLocaleDateString(),
    };
    const updatedRecords = [...records, newRecord]
        .sort((a, b) => {
        if (a.attempts !== b.attempts)
            return a.attempts - b.attempts;
        return a.time - b.time;
    })
        .slice(0, 5);
    localStorage.setItem('bulls_cows_records', JSON.stringify(updatedRecords));
}
export function renderSetupScreen() {
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
        if (Number(sys.value) === currentSettings.base)
            option.selected = true;
        baseSelect.appendChild(option);
    });
    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = ' Длина числа: ';
    const lengthSelect = document.createElement('select');
    function updateLengthOptions(selectedBase) {
        while (lengthSelect.firstChild) {
            lengthSelect.removeChild(lengthSelect.firstChild);
        }
        for (let i = 2; i <= 6; i++) {
            if (selectedBase === 2 && i !== 2)
                continue;
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i);
            if (i === currentSettings.length)
                option.selected = true;
            lengthSelect.appendChild(option);
        }
    }
    updateLengthOptions(currentSettings.base);
    baseSelect.addEventListener('change', () => {
        currentSettings.base = Number(baseSelect.value);
        if (currentSettings.base === 2)
            currentSettings.length = 2;
        updateLengthOptions(currentSettings.base);
    });
    lengthSelect.addEventListener('change', () => {
        currentSettings.length = Number(lengthSelect.value);
    });
    const startButton = document.createElement('button');
    startButton.textContent = 'Старт игры';
    startButton.addEventListener('click', () => {
        activeGameSecret = generateSecret(currentSettings.length, currentSettings.base);
        gameHistory = [];
        startTime = Date.now();
        console.log('Загаданное секретное число:', activeGameSecret);
        renderGameScreen();
    });
    setupContainer.appendChild(baseLabel);
    setupContainer.appendChild(baseSelect);
    setupContainer.appendChild(lengthLabel);
    setupContainer.appendChild(lengthSelect);
    setupContainer.appendChild(startButton);
    app.appendChild(setupContainer);
    renderHighScores(app);
}
function renderHighScores(parent) {
    const recordsContainer = document.createElement('div');
    recordsContainer.className = 'records-container';
    recordsContainer.style.marginTop = '20px';
    const subtitle = document.createElement('h3');
    subtitle.textContent = '🏆 Таблица рекордов (ТОП-5)';
    recordsContainer.appendChild(subtitle);
    const records = getRecords();
    if (records.length === 0) {
        const noRecords = document.createElement('p');
        noRecords.textContent = 'Рекордов пока нет. Будьте первыми!';
        recordsContainer.appendChild(noRecords);
    }
    else {
        records.forEach((rec, index) => {
            const row = document.createElement('div');
            row.style.padding = '5px 0';
            row.textContent = `#${index + 1} | [Длина: ${rec.length}, База: ${rec.base}] — Попыток: ${rec.attempts}, Время: ${rec.time} сек. (${rec.date})`;
            recordsContainer.appendChild(row);
        });
    }
    parent.appendChild(recordsContainer);
}
function renderGameScreen() {
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
        const lastChar = val.charAt(val.length - 1);
        if (val.length > 0 && !isCharValid(val.slice(-1))) {
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
        if (!isValidGuess(currentGuess, currentSettings.length, currentSettings.base)) {
            alert('Неверный формат ввода! Проверьте длину и уникальность цифр.');
            return;
        }
        const isDuplicate = gameHistory.some((entry) => entry.guess === currentGuess);
        if (isDuplicate) {
            alert('Вы уже вводили этот вариант! Попробуйте другое число.');
            guessInput.value = ''; // Просто очищаем поле, без ошибок и задвоений
            return;
        }
        const result = evaluateGuess(activeGameSecret, currentGuess);
        const newEntry = { guess: currentGuess, ...result };
        gameHistory = [...gameHistory, newEntry];
        updateHistoryUI();
        guessInput.value = '';
        if (result.bulls === currentSettings.length) {
            const timeFinished = Math.floor((Date.now() - startTime) / 1000);
            alert(`Поздравляем! Вы победили!\nПопыток: ${gameHistory.length}\nВремя: ${timeFinished} сек.`);
            saveRecord(gameHistory.length, timeFinished);
            renderSetupScreen();
        }
    });
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Новая игра';
    restartButton.style.marginTop = '20px';
    restartButton.style.backgroundColor = '#6c757d';
    restartButton.addEventListener('click', () => {
        renderSetupScreen();
    });
    gameContainer.appendChild(guessInput);
    gameContainer.appendChild(checkButton);
    gameContainer.appendChild(historyList);
    gameContainer.appendChild(restartButton);
    app.appendChild(gameContainer);
}
renderSetupScreen();
//# sourceMappingURL=ui.js.map