import { GameState, HistoryEntry } from './game.js';

const currentSettings = {
    length: 4,
    base: 10,
};

export function renderSetupScreen(): void {
    const app = document.body;
    app.innerHTML = '';

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
        if (Number(sys.value) === currentSettings.base) {
            option.selected = true;
        }
        baseSelect.appendChild(option);
    });

    setupContainer.appendChild(baseLabel);
    setupContainer.appendChild(baseSelect);
    app.appendChild(setupContainer);
}
