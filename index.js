let lastCardEl = null;
let currentPage = 1;
let loading = false;

const LIMIT = 9;
const STORAGE_KEY = 'theme-mode';
const DEFAULT_MODE = 'light';

const photosContainerEl = document.querySelector('.photos-container');
const spinner = document.getElementById('spinner');

main();

function main() {
    const currentMode = loadCurrentMode();
    if (currentMode !== DEFAULT_MODE) changeMode(currentMode);
    loadCards();
}

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

function showSpinner() {
    spinner.classList.remove('visually-hidden');
}

function hideSpinner() {
    spinner.classList.add('visually-hidden');
}

function createNode(tagName, attrs, parent = null) {
    const el = document.createElement(tagName);
    for (const attrName in attrs) {
        if (attrName === 'textContent') {
            el.textContent = attrs[attrName];
        } else {
            el.setAttribute(attrName === 'className' ? 'class' : attrName, attrs[attrName]);
        }
    }
    parent && parent.appendChild(el);
    return el;
}

const btnToggleMode = document.getElementById('btn-toggle-mode');
btnToggleMode.addEventListener('click', e => toggleMode());

function renderCard(card, cardIndex, cards) {
    const cardEl = createNode('div', {
        className: 'card',
        "data-id": card.id
    });

    const cardBodyEl = createNode('div', {className: 'card-body'});

    createNode('img', {
        src: card["download_url"],
        alt: card["author"],
        className: 'card-img-top'
    }, cardEl);

    createNode('h3', {textContent: card["author"]}, cardBodyEl);

    const cardText = Math.random() > 0.5
        ? 'Random Text. Todo: Generate Random Text Using Random Numbers Generator, AKA "random function"length of this text is ridiculous. It could be hundred times shorter. But this is life, unfortunately, there is no way to avoid very long and useless sentences.'
        : 'The Short Description, should fit well';

    const pEl = createNode('p', {
        textContent: cardText,
        className: 'card-text',
    }, cardBodyEl)
    if (cardText.length >= 120) {
        pEl.classList.add('cut-off');
        createNode('button', {
            className: 'btn btn-link text-decoration-none text-dark',
            textContent: 'Show more'
        }, cardBodyEl);
    }


    cardEl.appendChild(cardBodyEl);
    const btnsContainerEl = createNode('div', {className: 'card-btns-container'}, cardEl);
    createNode('button', {className: 'btn btn-warning', textContent: 'Save to collection'}, btnsContainerEl);
    createNode('button', {className: 'btn btn-light', textContent: 'Share'}, btnsContainerEl);

    if (cardIndex === cards.length - 1) {
        lastCardEl = cardEl;
    }
    photosContainerEl.appendChild(cardEl);
}

function loadCards() {
    showSpinner();
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

window.addEventListener('scroll', () => {
    setTimeout(() => {
        if (lastCardEl) {
            if (isInViewport(lastCardEl) && !loading) {
                loading = true;
                loadCards().then(() => setTimeout(() => loading = false, 333));
            }
        }
    }, 0);
});
window.onscroll = function () {
}
