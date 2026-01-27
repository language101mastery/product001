// 1. Data
// NOTE: This is a sample dataset for demonstration purposes.
// The Simplified Chinese and Japanese characters are partially generated
// and may not be fully accurate.
const cheonjamunData = [
    { hanja: '天地玄黃 宇宙洪荒', chineseS: '天地玄黄 宇宙洪荒', japanese: '天地玄黄 宇宙洪荒' },
    { hanja: '日月盈昃 辰宿列張', chineseS: '日月盈昃 辰宿列张', japanese: '日月盈昃 辰宿列張' },
    { hanja: '寒來暑往 秋收冬藏', chineseS: '寒来暑往 秋收冬藏', japanese: '寒来暑往 秋収冬蔵' },
    { hanja: '閏餘成歲 律呂調陽', chineseS: '闰余成岁 律吕调阳', japanese: '閏余成歳 律呂調陽' },
    { hanja: '雲騰致雨 露結爲霜', chineseS: '云腾致雨 露结为霜', japanese: '雲騰致雨 露結為霜' },
    { hanja: '金生麗水 玉出崑岡', chineseS: '金生丽水 玉出昆冈', japanese: '金生麗水 玉出崑岡' },
    { hanja: '劍號巨闕 珠稱夜光', chineseS: '剑号巨阙 珠称夜光', japanese: '剣号巨闕 珠称夜光' },
    { hanja: '果珍李柰 菜重芥薑', chineseS: '果珍李柰 菜重芥姜', japanese: '果珍李柰 菜重芥薑' }
];


// 2. State Management
let currentCheonjamunIndex = 0;
let currentCharset = 'hanja'; // 'hanja', 'chineseS', 'japanese'

// 3. Web Component
class CheonjamunCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentData = null;
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--card-background, #ffffff);
                    border-radius: 15px;
                    padding: 2.5rem;
                    min-height: 350px;
                    width: 100%;
                    box-sizing: border-box;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0,0,0,0.05);
                    text-align: center;
                    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
                }
                .phrase {
                    font-family: var(--hanja-font, 'Noto Serif KR', serif);
                    font-size: 3rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    line-height: 1.5;
                }
            </style>
            <div class="phrase"></div>
        `;
    }

    update(data) {
        this.currentData = data;
        this.switchCharset(currentCharset); // Immediately display with the current charset
    }

    switchCharset(charset) {
        if (this.currentData) {
            const phrase = this.currentData[charset] || this.currentData['hanja'];
            this.shadowRoot.querySelector('.phrase').textContent = phrase;
        }
    }
}
customElements.define('cheonjamun-card', CheonjamunCard);


// 4. Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const cheonjamunCard = document.querySelector('cheonjamun-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charsetButtons = document.querySelectorAll('.char-set-selector button');
    
    function showCheonjamun(index) {
        cheonjamunCard.style.opacity = '0';
        cheonjamunCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cheonjamunCard.update(cheonjamunData[index]);
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
            cheonjamunCard.switchCharset(currentCharset);
        });
    });

    function initialize() {
        showCheonjamun(currentCheonjamunIndex);
    }

    initialize();
});