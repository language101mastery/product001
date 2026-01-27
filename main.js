
// 1. Data
let cheonjamunData = {}; // Will be loaded from data.json


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
            phraseElement.textContent = this.currentData.phrase;
            phraseElement.style.fontFamily = getFontVariable(charset);
        }
    }
}
customElements.define('cheonjamun-card', CheonjamunCard);


// 4. Application Logic
document.addEventListener('DOMContentLoaded', async () => { // Made async to await data fetch
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

    // --- Data Loading ---
    async function loadCheonjamunData(charset) {
        if (cheonjamunData[charset]) {
            return; // Data for this charset already loaded
        }
        try {
                                            let fileName;
                                            if (charset === 'chineseS') {
                                                fileName = `data/simplified_chinese_data.json`;
                                            } else {
                                                fileName = `data/${charset}_data.json`;
                                            }            const response = await fetch(fileName);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            cheonjamunData[charset] = await response.json();
        } catch (error) {
            console.error(`Failed to load cheonjamunData for ${charset}:`, error);
            detailsContainer.innerHTML = `<p style="color: red;">천자문 데이터를 불러오는데 실패했습니다 (${charset}). ${charset}_data.json 파일이 올바른지 확인해주세요.</p>`;
            throw error; // Re-throw to propagate the error
        }
    }

    try {
        await loadCheonjamunData(currentCharset); // Load initial data for currentCharset
    } catch (error) {
        // Error already handled in loadCheonjamunData, just prevent further execution
        return;
    }
    // --- End Data Loading ---


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
            
            // Determine which set of details to use based on currentCharset
            let selectedDetailData = null;
            if (charDetail[currentCharset]) {
                selectedDetailData = charDetail[currentCharset];
            } else if (charDetail.hanja) { // Fallback to hanja if specific charset not found
                selectedDetailData = charDetail.hanja;
            }

            if (selectedDetailData) {
                const soundEl = document.createElement('p');
                soundEl.innerHTML = `<strong>음:</strong> ${selectedDetailData.sound || 'N/A'}`;
                detailCard.appendChild(soundEl);

                const meaningEl = document.createElement('p');
                meaningEl.innerHTML = `<strong>뜻:</strong> ${selectedDetailData.meaning || 'N/A'}`;
                detailCard.appendChild(meaningEl);
            } else {
                const noDataEl = document.createElement('p');
                noDataEl.textContent = '정보 없음';
                detailCard.appendChild(noDataEl);
            }

            grid.appendChild(detailCard);
        });
        detailsContainer.appendChild(grid);
    }
    
    function showCheonjamun(index) {
        // Ensure data for the current charset is available
        const currentLanguageData = cheonjamunData[currentCharset];
        if (!currentLanguageData || currentLanguageData.length === 0) {
            console.warn(`Data for charset "${currentCharset}" is not loaded or is empty.`);
            return;
        }

        cheonjamunCard.style.opacity = '0';
        cheonjamunCard.style.transform = 'scale(0.95)';
        
        const data = currentLanguageData[index];

        setTimeout(() => {
            cheonjamunCard.update(data);
            renderCharacterDetails(data.details); // Render details for the new phrase
            cheonjamunCard.style.opacity = '1';
            cheonjamunCard.style.transform = 'scale(1)';
        }, 200);
    }

    prevBtn.addEventListener('click', () => {
        currentCheonjamunIndex = (currentCheonjamunIndex - 1 + cheonjamunData[currentCharset].length) % cheonjamunData[currentCharset].length;
        showCheonjamun(currentCheonjamunIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentCheonjamunIndex = (currentCheonjamunIndex + 1) % cheonjamunData[currentCharset].length;
        showCheonjamun(currentCheonjamunIndex);
    });

    charsetButtons.forEach(button => {
        button.addEventListener('click', async () => {
            currentCharset = button.dataset.charset;
            charsetButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Load data for the new charset if not already loaded
            try {
                await loadCheonjamunData(currentCharset);
            } catch (error) {
                // Error handled in loadCheonjamunData, prevent further execution
                return;
            }

            // Reset index to 0 when changing charset
            currentCheonjamunIndex = 0;
            
            // Update both the main card and the details view
            cheonjamunCard.switchCharset(currentCharset);
            showCheonjamun(currentCheonjamunIndex); // Call showCheonjamun to re-render with new data
        });
    });

    async function initialize() {
        // Ensure initial data is loaded before trying to display
        if (!cheonjamunData[currentCharset] || cheonjamunData[currentCharset].length === 0) {
            console.warn('Initialization delayed: cheonjamunData for current charset not yet loaded.');
            return;
        }
        showCheonjamun(currentCheonjamunIndex);
    }

    initialize(); // Initial call to show the first card after data is loaded
});
