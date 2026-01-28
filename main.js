// main.js loaded
console.log('main.js loaded');

// 0. i18n
const translations = {};

async function setLanguage(lang) {
    await loadTranslations(lang);
    translatePage(lang);
    updateLangUI(lang);
    localStorage.setItem('userLanguage', lang);
    document.documentElement.lang = lang;
}

async function loadTranslations(lang) {
    if (translations[lang]) {
        return; // Already loaded
    }
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Could not load translation file for ${lang}`);
        }
        translations[lang] = await response.json();
    } catch (error) {
        console.error(error);
        // Fallback to Korean if the selected language fails to load
        if (lang !== 'ko') {
            await setLanguage('ko');
        }
    }
}

function translatePage(lang) {
    const translatableElements = document.querySelectorAll('[data-i18n-key]');
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
          console.warn(`No translation found for key: ${key} in language: ${lang}`);
        }
    });
}

function updateLangUI(lang) {
    const langConfig = {
        ko: '🇰🇷',
        en: '🇺🇸',
        zh: '🇨🇳',
        ja: '🇯🇵'
    };

    const dropdownBtn = document.querySelector('.lang-dropdown-btn');
    if (dropdownBtn) {
        dropdownBtn.textContent = langConfig[lang] || '🌐';
    }

    const langButtons = document.querySelectorAll('.lang-dropdown-content button');
    langButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });
}

async function initI18n() {
    const langButtons = document.querySelectorAll('.lang-dropdown-content button');
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const newLang = e.currentTarget.dataset.lang;
            if(newLang) setLanguage(newLang);
        });
    });

    const savedLang = localStorage.getItem('userLanguage');
    const browserLang = navigator.language.split('-')[0]; 
    const defaultLang = savedLang || (['ko', 'en', 'zh', 'ja'].includes(browserLang) ? browserLang : 'ko');

    await setLanguage(defaultLang);
}


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
                    flex-direction: column; /* Stack phrase and meaning */
                    justify-content: center;
                    align-items: center;
                    background-color: var(--card-background, #ffffff);
                    border-radius: 15px;
                    padding: 2.5rem; /* Default padding for desktop */
                    min-height: 250px; 
                    width: 100%;
                    box-sizing: border-box;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0,0,0,0.05);
                    text-align: center;
                    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, padding 0.3s ease;
                }
                .phrase {
                    font-family: var(--font-hanja); /* Default font */
                    font-size: 3rem;
                    font-weight: 700;
                    color: var(--text-color);
                    line-height: 1.5;
                }
                .meaning {
                    margin-top: 1rem;
                    font-family: var(--main-font);
                    font-size: 1.2rem;
                    font-weight: 400;
                    color: var(--text-color);
                    opacity: 0.9;
                }

                /* Responsive styles for the card itself */
                @media (max-width: 600px) {
                    :host {
                        padding: 1.5rem; /* Reduced padding on smaller screens */
                        min-height: 200px;
                    }
                    .phrase {
                        font-size: 2.2rem; /* Adjust font size for mobile */
                    }
                    .meaning {
                        font-size: 1rem; /* Adjust font size for mobile */
                    }
                }
            </style>
            <div class="phrase"></div>
            <div class="meaning"></div>
        `;
    }

    update(data) {
        this.currentData = data;
        this.switchCharset(currentCharset);
    }

    switchCharset(charset) {
        if (this.currentData) {
            const phraseElement = this.shadowRoot.querySelector('.phrase');
            const meaningElement = this.shadowRoot.querySelector('.meaning');
            
            phraseElement.textContent = this.currentData.phrase;
            phraseElement.style.fontFamily = getFontVariable(charset);
            
            meaningElement.textContent = this.currentData.meaning || '';
        }
    }
}
customElements.define('cheonjamun-card', CheonjamunCard);


// 4. Application Logic
// Helper to get query parameters
function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split('&').forEach(param => {
        const parts = param.split('=');
        if (parts[0]) {
            params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
        }
    });
    return params;
}

// --- Theme Management Logic (moved here to be globally available) ---
const htmlElement = document.documentElement; // Get the html element for data-theme attribute
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'; // Update icon
}

// Initialize theme on page load (run once)
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark'); // System preference is dark
    } else {
        setTheme('light'); // Default to light
    }
})();
// --- End Theme Management Logic ---

// --- Data Loading (Cheonjamun) ---
async function loadCheonjamunData(charset) {
    if (cheonjamunData[charset]) {
        return; // Data for this charset already loaded
    }
    const detailsContainer = document.getElementById('details-container'); 
    try {
        let fileName;
        if (charset === 'chineseS') {
            fileName = 'data/simplified_chinese_data.json';
        } else {
            fileName = `data/${charset}_data.json`;
        }
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cheonjamunData[charset] = await response.json();
    } catch (error) {
        console.error(`Failed to load cheonjamunData for ${charset}:`, error);
        if (detailsContainer) { 
            detailsContainer.innerHTML = `<p style="color: red;">천자문 데이터를 불러오는데 실패했습니다 (${charset}). 파일을 확인해주세요.</p>`;
        }
        throw error; 
    }
}

// --- Cheonjamun Logic ---
async function handleIndexPage() {
    const cheonjamunCard = document.querySelector('cheonjamun-card');
    const detailsContainer = document.getElementById('details-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charsetButtons = document.querySelectorAll('.char-set-selector button');
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) { 
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function renderCharacterDetails(details) {
        if (!detailsContainer) return; 
        detailsContainer.innerHTML = ''; 
        if (!details || details.length === 0) {
            detailsContainer.innerHTML = '<p>상세 정보가 없습니다.</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'details-grid';

        details.forEach(charDetail => {
            const detailCard = document.createElement('div');
            detailCard.className = 'detail-card';

            const charHeader = document.createElement('h3');
            charHeader.textContent = charDetail.char;
            charHeader.style.fontFamily = getFontVariable(currentCharset);
            detailCard.appendChild(charHeader);
            
            let selectedDetailData = charDetail[currentCharset] || charDetail.hanja;

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
        const currentLanguageData = cheonjamunData[currentCharset];
        if (!currentLanguageData || currentLanguageData.length === 0) {
            console.warn(`Data for charset "${currentCharset}" is not loaded or is empty.`);
            return;
        }

        if (cheonjamunCard) {
            cheonjamunCard.style.opacity = '0';
            cheonjamunCard.style.transform = 'scale(0.95)';
            
            const data = currentLanguageData[index];

            setTimeout(() => {
                cheonjamunCard.update(data);
                renderCharacterDetails(data.details);
                cheonjamunCard.style.opacity = '1';
                cheonjamunCard.style.transform = 'scale(1)';
            }, 200);
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentCheonjamunIndex = (currentCheonjamunIndex - 1 + cheonjamunData[currentCharset].length) % cheonjamunData[currentCharset].length;
            showCheonjamun(currentCheonjamunIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentCheonjamunIndex = (currentCheonjamunIndex + 1) % cheonjamunData[currentCharset].length;
            showCheonjamun(currentCheonjamunIndex);
        });
    }

    if (charsetButtons) {
        charsetButtons.forEach(button => {
            button.addEventListener('click', async () => {
                currentCharset = button.dataset.charset;
                charsetButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                try {
                    await loadCheonjamunData(currentCharset);
                } catch (error) {
                    return;
                }

                currentCheonjamunIndex = 0;
                
                if (cheonjamunCard) cheonjamunCard.switchCharset(currentCharset);
                showCheonjamun(currentCheonjamunIndex);
            });
        });
    }

    try {
        await loadCheonjamunData(currentCharset); 
        if (cheonjamunData[currentCharset] && cheonjamunData[currentCharset].length > 0) {
            showCheonjamun(currentCheonjamunIndex);
        } else {
            console.warn('Initialization delayed: data for current charset not yet loaded.');
        }
    } catch (error) {
        console.error("Initial data load failed:", error);
    }
}

// --- Blog Listing Page Logic ---
async function handleBlogListPage() {
    const blogPostsListDiv = document.getElementById('blog-posts-list');
    if (!blogPostsListDiv) return;
    
    try {
        const response = await fetch('blog/blog_posts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blogPosts = await response.json();

        blogPostsListDiv.innerHTML = ''; 

        if (blogPosts.length === 0) {
            blogPostsListDiv.innerHTML = '<p>게시물이 없습니다.</p>';
            return;
        }

        const postList = document.createElement('ul');
        postList.className = 'blog-list';

        blogPosts.forEach(post => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `post.html?slug=${post.slug}`;
            link.textContent = post.title;

            const dateSpan = document.createElement('span');
            dateSpan.className = 'post-date';
            dateSpan.textContent = ` (${post.date})`;

            const summaryP = document.createElement('p');
            summaryP.className = 'post-summary';
            summaryP.textContent = post.summary;

            listItem.appendChild(link);
            listItem.appendChild(dateSpan);
            listItem.appendChild(summaryP);
            postList.appendChild(listItem);
        });
        blogPostsListDiv.appendChild(postList);

    } catch (error) {
        console.error('Failed to load blog posts:', error);
        blogPostsListDiv.innerHTML = '<p style="color: red;">블로그 게시물을 불러오는데 실패했습니다.</p>';
    }
}

// --- Blog Post Detail Page Logic ---
async function handleBlogPostPage() {
    const queryParams = getQueryParams();
    const postSlug = queryParams.slug;
    const postTitleH1 = document.querySelector('h1');
    const blogPostContentDiv = document.getElementById('blog-post-content');

    if (!postSlug || !blogPostContentDiv) {
        if (blogPostContentDiv) blogPostContentDiv.innerHTML = '<p style="color: red;">게시물을 찾을 수 없습니다.</p>';
        if (postTitleH1) postTitleH1.textContent = '게시물 없음';
        return;
    }

    try {
        // Fetch metadata and content simultaneously
        const [metaResponse, mdResponse] = await Promise.all([
            fetch('blog/blog_posts.json'),
            fetch(`blog/${postSlug}.md`)
        ]);

        if (!metaResponse.ok) throw new Error(`HTTP error! status: ${metaResponse.status}`);
        const blogPostsMeta = await metaResponse.json();
        const postMeta = blogPostsMeta.find(p => p.slug === postSlug);
        const currentIndex = blogPostsMeta.findIndex(p => p.slug === postSlug);

        if (!mdResponse.ok) throw new Error(`HTTP error! status: ${mdResponse.status}`);
        const markdownContent = await mdResponse.text();

        // Update Title
        if (postTitleH1 && postMeta) {
            postTitleH1.textContent = postMeta.title;
            document.title = `${postMeta.title} - 한자 학습`;
        } else if (postTitleH1) {
             postTitleH1.textContent = '게시물 없음';
             document.title = '게시물 없음 - 한자 학습';
        }

        // Render Content
        if (typeof marked !== 'undefined') {
            blogPostContentDiv.innerHTML = marked.parse(markdownContent);
        } else {
            console.error('marked library is not defined!');
            blogPostContentDiv.innerHTML = '<p>Error rendering content.</p>';
        }

        // --- Navigation Buttons Logic ---
        const navContainer = document.getElementById('post-navigation');
        if (navContainer && currentIndex !== -1) {
            const nextPost = currentIndex > 0 ? blogPostsMeta[currentIndex - 1] : null;
            const prevPost = currentIndex < blogPostsMeta.length - 1 ? blogPostsMeta[currentIndex + 1] : null;
            
            navContainer.innerHTML = `
                ${prevPost ? `<a href="post.html?slug=${prevPost.slug}" class="nav-btn prev">← 이전 글</a>` : '<span></span>'}
                <a href="blog.html" class="nav-btn list">목록</a>
                ${nextPost ? `<a href="post.html?slug=${nextPost.slug}" class="nav-btn next">다음 글 →</a>` : '<span></span>'}
            `;
        }

    } catch (error) {
        console.error(`Failed to load blog post "${postSlug}":`, error);
        if (blogPostContentDiv) blogPostContentDiv.innerHTML = '<p style="color: red;">게시물을 불러오는데 실패했습니다.</p>';
        if (postTitleH1) postTitleH1.textContent = '오류 발생';
    }
}

// Main routing logic
document.addEventListener('DOMContentLoaded', () => {
    initI18n().then(() => {
        if (document.querySelector('cheonjamun-card')) {
            handleIndexPage();
        } else if (document.getElementById('blog-posts-list')) {
            handleBlogListPage();
        } else if (document.getElementById('blog-post-content')) {
            handleBlogPostPage();
        }
    });
});
