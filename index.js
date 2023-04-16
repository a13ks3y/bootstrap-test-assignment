const STORAGE_KEY = 'theme-mode';
const DEFAULT_MODE = 'light';

function toggleMode() {
    const currentMode = loadCurrentMode();
    const nextMode = currentMode === 'light' ? 'dark' : 'light';
    changeMode(nextMode);
}
function loadCurrentMode() {
    return localStorage.getItem(STORAGE_KEY) || "light";
}
function saveCurrentMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);        
}
function changeMode(nextMode) {
    const currentMode = nextMode === 'light' ? 'dark' : 'light';
    const elements = document.querySelectorAll(`.bg-${currentMode}`);
    for (let element of elements) {
        element.classList.toggle(`bg-${currentMode}`);
        element.classList.add(`bg-${nextMode}`);        
    }
    saveCurrentMode(nextMode);
}
const currentMode = loadCurrentMode();
if (currentMode !== DEFAULT_MODE) changeMode(currentMode);
