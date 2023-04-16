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

let lastCardEl = null;

const currentMode = loadCurrentMode();
if (currentMode !== DEFAULT_MODE) changeMode(currentMode);

let currentPage = 1;
const LIMIT = 9;

function showSpinner() {

}

function hideSpinner() {

}
const photosContainerEl = document.querySelector('.photos-container');
function renderCard(card, cardIndex, cards) {
    const articleEl = document.createElement('article');
    articleEl.setAttribute('data-id', card.id);

    const imgEl = document.createElement('img');
    imgEl.src = card["download_url"];
    imgEl.alt = card["author"];
    imgEl.width = 356;
    imgEl.height = 200;
    articleEl.appendChild(imgEl);

    const headingEl = document.createElement('h3');
    headingEl.textContent = card["author"];
    articleEl.appendChild(headingEl);
    const pEl = document.createElement('p');
    pEl.textContent = 'Random Text. Todo: Generate Random Text Using Random Numbers Generator, AKA "random function".'
    articleEl.appendChild(pEl);

    const btnsContainerEl = document.createElement('div');
        const btnSaveEl = document.createElement('button');
        const btnShareEl = document.createElement('button');
        btnSaveEl.textContent = 'Save to collection';
        btnShareEl.textContent = 'Share';
        btnSaveEl.classList.add('btn', 'btn-warning');
        btnShareEl.classList.add('btn', 'btn-light');
        btnsContainerEl.appendChild(btnSaveEl);
        btnsContainerEl.appendChild(btnShareEl);
    articleEl.appendChild(btnsContainerEl);

    if (cardIndex === cards.length - 1) {
        lastCardEl = articleEl;
    }
    photosContainerEl.appendChild(articleEl);
}
loadCards();
function loadCards() {
    return fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=${LIMIT}`)
        .then(response => {
            currentPage++;
            return response.json().then(cards => {
                cards.forEach(renderCard);
            });
        })
        .catch(e => console.error(e))
        .finally(hideSpinner);
}
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
let loading = false;
window.onscroll = function() {
    setTimeout(() => {
        if (lastCardEl) {
            if (isInViewport(lastCardEl) && !loading) {
                loading = true;
                loadCards().then(() => setTimeout(()=>loading = false, 333));
            }
        }
    }, 0);
}
