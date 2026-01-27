
// 1. Data
const cheonjamunData = [
    {
        phrase: { hanja: '天地玄黃 宇宙洪荒', chineseS: '天地玄黄 宇宙洪荒', japanese: '天地玄黄 宇宙洪荒' },
        details: [
            {
                char: '天',
                hanja: { sound: '천', meaning: '하늘' },
                chineseS: { sound: 'tiān', meaning: 'sky' },
                japanese: { sound: 'てん (ten)', meaning: 'あめ' }
            },
            // --- Placeholder for the other 7 characters ---
            { char: '地', hanja: { sound: '지', meaning: '땅' } },
            { char: '玄', hanja: { sound: '현', meaning: '검을' } },
            { char: '黃', hanja: { sound: '황', meaning: '누를' } },
            { char: '宇', hanja: { sound: '우', meaning: '집' } },
            { char: '宙', hanja: { sound: '주', meaning: '집' } },
            { char: '洪', hanja: { sound: '홍', meaning: '넓을' } },
            { char: '荒', hanja: { sound: '황', meaning: '거칠' } },
        ]
    },
    {
        phrase: { hanja: '日月盈昃 辰宿列張', chineseS: '日月盈昃 辰宿列张', japanese: '日月盈昃 辰宿列張' },
        details: [ { char: '日' }, { char: '月' }, { char: '盈' }, { char: '昃' }, { char: '辰' }, { char: '宿' }, { char: '列' }, { char: '張' } ]
    },
    {
        phrase: { hanja: '寒來暑往 秋收冬藏', chineseS: '寒来暑往 秋收冬藏', japanese: '寒来暑往 秋収冬蔵' },
        details: [ { char: '寒' }, { char: '來' }, { char: '暑' }, { char: '往' }, { char: '秋' }, { char: '收' }, { char: '冬' }, { char: '藏' } ]
    }
    // ... more data would follow this structure
];


// 2. State Management
let currentCheonjamunIndex = 0;
let currentCharset = 'hanja'; // 'hanja', 'chineseS', 'japanese'

// 3. Web Component

function getFontVariable(charset) {
    switch (charset) {
        case 'hanja': return 'var(--font-hanja)';
        case 'chineseS': return 'var(--font-chineseS)';
        case 'japanese': return 'var(--font-japanese)';
        default: return 'var(--font-hanja)'; // Default to hanja font
    }
}

class CheonjamunCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentData = null;
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--card-background, #ffffff);
                    border-radius: 15px;
                    padding: 2.5rem;
                    min-height: 250px; /* Adjusted height */
                    width: 100%;
                    box-sizing: border-box;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0,0,0,0.05);
                    text-align: center;
                    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
                }
                .phrase {
                    font-family: var(--font-hanja); /* Default font */
                    font-size: 3rem;
                    font-weight: 700;
                    color: var(--text-color);
                    line-height: 1.5;
                }
            </style>
            <div class="phrase"></div>
        `;
    }

    update(data) {
        this.currentData = data;
        this.switchCharset(currentCharset);
    }

    switchCharset(charset) {
        if (this.currentData) {
            const phraseElement = this.shadowRoot.querySelector('.phrase');
            phraseElement.textContent = this.currentData.phrase[charset] || this.currentData.phrase['hanja'];
            phraseElement.style.fontFamily = getFontVariable(charset);
        }
    }
}
customElements.define('cheonjamun-card', CheonjamunCard);


// 4. Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const cheonjamunCard = document.querySelector('cheonjamun-card');
    const detailsContainer = document.getElementById('details-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charsetButtons = document.querySelectorAll('.char-set-selector button');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Get the html element for data-theme attribute

    // --- Theme Management Logic ---
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'; // Update icon
    }

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark'); // System preference is dark
    } else {
        setTheme('light'); // Default to light
    }

    // Theme toggle button listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    // --- End Theme Management Logic ---


    function renderCharacterDetails(details) {
        detailsContainer.innerHTML = ''; // Clear previous details
        if (!details) return;

        const grid = document.createElement('div');
        grid.className = 'details-grid';

        details.forEach(charDetail => {
            const detailCard = document.createElement('div');
            detailCard.className = 'detail-card';

            const charHeader = document.createElement('h3');
            charHeader.textContent = charDetail.char;
            charHeader.style.fontFamily = getFontVariable(currentCharset);
            detailCard.appendChild(charHeader);
            
            // For the demo, we only have full details for '天'
            if (charDetail.details) {
                 const selectedDetail = charDetail.details[currentCharset] || charDetail.details.hanja;
                 if(selectedDetail) {
                    const soundEl = document.createElement('p');
                    soundEl.innerHTML = `<strong>음:</strong> ${selectedDetail.sound}`;
                    detailCard.appendChild(soundEl);

                    const meaningEl = document.createElement('p');
                    meaningEl.innerHTML = `<strong>뜻:</strong> ${selectedDetail.meaning}`;
                    detailCard.appendChild(meaningEl);
                 }
            } else if (charDetail.hanja) { // Fallback for placeholders
                const soundEl = document.createElement('p');
                soundEl.innerHTML = `<strong>음:</strong> ${charDetail.hanja.sound}`;
                detailCard.appendChild(soundEl);

                const meaningEl = document.createElement('p');
                meaningEl.innerHTML = `<strong>뜻:</strong> ${charDetail.hanja.meaning}`;
                detailCard.appendChild(meaningEl);
            }


            grid.appendChild(detailCard);
        });
        detailsContainer.appendChild(grid);
    }
    
    function showCheonjamun(index) {
        cheonjamunCard.style.opacity = '0';
        cheonjamunCard.style.transform = 'scale(0.95)';
        
        const data = cheonjamunData[index];

        setTimeout(() => {
            cheonjamunCard.update(data);
            renderCharacterDetails(data.details); // Render details for the new phrase
            cheonjamunCard.style.opacity = '1';
            cheonjamunCard.style.transform = 'scale(1)';
        }, 200);
    }

    prevBtn.addEventListener('click', () => {
        currentCheonjamunIndex = (currentCheonjamunIndex - 1 + cheonjamunData.length) % cheonjamunData.length;
        showCheonjamun(currentCheonjamunIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentCheonjamunIndex = (currentCheonjamunIndex + 1) % cheonjamunData.length;
        showCheonjamun(currentCheonjamunIndex);
    });

    charsetButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCharset = button.dataset.charset;
            charsetButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update both the main card and the details view
            cheonjamunCard.switchCharset(currentCharset);
            const currentData = cheonjamunData[currentCheonjamunIndex];
            renderCharacterDetails(currentData.details);
        });
    });

    function initialize() {
        showCheonjamun(currentCheonjamunIndex);
    }

    initialize();
});
