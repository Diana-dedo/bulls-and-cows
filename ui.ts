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
        if (currentSettings.base === 2) {
            currentSettings.length = 2;
        }
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
        console.log('Загаданное секретное число:', activeGameSecret);
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
    title.textContent = `Игра началась! База: ${currentSettings.base}, Длина: ${currentSettings.length}`;
    app.appendChild(title);
}

renderSetupScreen();
