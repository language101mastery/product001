
// 1. Data: Hanja characters with Chinese and Japanese variations
const hanjaData = [
  { hanja: '愛', chineseT: '愛', chineseS: '爱', japanese: '愛', huneum: '사랑 애', meaning: '사랑' },
  { hanja: '信', chineseT: '信', chineseS: '信', japanese: '信', huneum: '믿을 신', meaning: '믿음' },
  { hanja: '仁', chineseT: '仁', chineseS: '仁', japanese: '仁', huneum: '어질 인', meaning: '어짊' },
  { hanja: '義', chineseT: '義', chineseS: '义', japanese: '義', huneum: '옳을 의', meaning: '의로움' },
  { hanja: '禮', chineseT: '禮', chineseS: '礼', japanese: '礼', huneum: '예절 례', meaning: '예절' },
  { hanja: '智', chineseT: '智', chineseS: '智', japanese: '智', huneum: '지혜 지', meaning: '지혜' },
  { hanja: '學', chineseT: '學', chineseS: '学', japanese: '学', huneum: '배울 학', meaning: '배움' },
  { hanja: '敎', chineseT: '教', chineseS: '教', japanese: '教', huneum: '가르칠 교', meaning: '가르침' }
];

// 2. State Management
let currentIndex = 0;
let currentCharset = 'hanja'; // e.g., 'hanja', 'chineseT', 'chineseS', 'japanese'

// 3. Web Component: <hanja-card>
class HanjaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { /* ... existing styles ... */ }
        .character {
          font-family: var(--hanja-font, 'Noto Serif KR', serif);
          font-size: 8rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 2rem; /* Adjusted margin */
        }
        .details { /* ... existing styles ... */ }
        .huneum { /* ... existing styles ... */ }
        .meaning { /* ... existing styles ... */ }
      </style>
      <div class="character"></div>
      <div class="details">
        <div class="huneum"></div>
        <div class="meaning"></div>
      </div>
    `;
     // Re-apply existing styles from style.css since they are not inherited by shadow DOM
    const style = document.createElement('style');
    style.textContent = `
        :host {
          display: block;
          background-color: var(--card-background, #ffffff);
          border-radius: 15px;
          padding: 2.5rem;
          min-height: 350px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0,0,0,0.05);
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .character {
          font-family: var(--hanja-font, 'Noto Serif KR', serif);
          font-size: 8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          line-height: 1;
        }
        .details {
          margin-top: 2rem;
        }
        .huneum {
          font-family: var(--main-font, 'Orbitron', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #444;
        }
        .meaning {
          margin-top: 0.75rem;
          font-family: var(--main-font, 'Orbitron', sans-serif);
          font-size: 1.1rem;
          color: #666;
        }
    `;
    this.shadowRoot.appendChild(style);
  }

  update(data, charset) {
    if (data) {
      const character = data[charset] || data['hanja'];
      this.shadowRoot.querySelector('.character').textContent = character;
      this.shadowRoot.querySelector('.huneum').textContent = data.huneum;
      this.shadowRoot.querySelector('.meaning').textContent = data.meaning;
    }
  }
}
customElements.define('hanja-card', HanjaCard);

// 4. Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const hanjaCard = document.querySelector('hanja-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charsetButtons = document.querySelectorAll('.char-set-selector button');

    function showHanja(index) {
        if (!hanjaCard) return;
        hanjaCard.style.opacity = '0';
        hanjaCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            hanjaCard.update(hanjaData[index], currentCharset);
            hanjaCard.style.opacity = '1';
            hanjaCard.style.transform = 'scale(1)';
        }, 200);
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + hanjaData.length) % hanjaData.length;
        showHanja(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % hanjaData.length;
        showHanja(currentIndex);
    });

    charsetButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCharset = button.dataset.charset;
            charsetButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            showHanja(currentIndex);
        });
    });

    function initialize() {
        if (hanjaData.length > 0) {
            const initialButton = document.querySelector(`[data-charset='${currentCharset}']`);
            if(initialButton) {
                initialButton.classList.add('active');
            }
            showHanja(currentIndex);
        }
    }

    initialize();
});
