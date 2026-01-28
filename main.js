// main.js loaded
console.log('main.js loaded');

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
    const detailsContainer = document.getElementById('details-container'); // Need to get this here or pass
    try {
        let fileName;
        if (charset === 'chineseS') {
            fileName = `data/simplified_chinese_data.json`;
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
        if (detailsContainer) { // Only update if element exists on current page
            detailsContainer.innerHTML = `<p style="color: red;">천자문 데이터를 불러오는데 실패했습니다 (${charset}). ${charset}_data.json 파일이 올바른지 확인해주세요.</p>`;
        }
        throw error; // Re-throw to propagate the error
    }
}

// --- Cheonjamun Logic (extracted to a function) ---
async function handleIndexPage() {
    const cheonjamunCard = document.querySelector('cheonjamun-card');
    const detailsContainer = document.getElementById('details-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charsetButtons = document.querySelectorAll('.char-set-selector button');
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) { // Attach listener only if theme toggle exists
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function renderCharacterDetails(details) {
        if (!detailsContainer) return; // Guard for pages without details container
        detailsContainer.innerHTML = ''; // Clear previous details
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
            
            let selectedDetailData = null;
            if (charDetail[currentCharset]) {
                selectedDetailData = charDetail[currentCharset];
            } else if (charDetail.hanja) {
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
        const currentLanguageData = cheonjamunData[currentCharset];
        if (!currentLanguageData || currentLanguageData.length === 0) {
            console.warn(`Data for charset "${currentCharset}" is not loaded or is empty.`);
            return;
        }

        if (cheonjamunCard) { // Check if card exists on this page
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

    if (prevBtn) { // Attach listener only if button exists
        prevBtn.addEventListener('click', () => {
            currentCheonjamunIndex = (currentCheonjamunIndex - 1 + cheonjamunData[currentCharset].length) % cheonjamunData[currentCharset].length;
            showCheonjamun(currentCheonjamunIndex);
        });
    }

    if (nextBtn) { // Attach listener only if button exists
        nextBtn.addEventListener('click', () => {
            currentCheonjamunIndex = (currentCheonjamunIndex + 1) % cheonjamunData[currentCharset].length;
            showCheonjamun(currentCheonjamunIndex);
        });
    }

    if (charsetButtons) { // Attach listeners only if buttons exist
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
        await loadCheonjamunData(currentCharset); // Load initial data for currentCharset
        if (cheonjamunData[currentCharset] && cheonjamunData[currentCharset].length > 0) {
            showCheonjamun(currentCheonjamunIndex);
        } else {
            console.warn('Initialization delayed: cheonjamunData for current charset not yet loaded.');
        }
    } catch (error) {
        console.error("Initial Cheonjamun data load failed:", error);
    }
}

// --- Blog Listing Page Logic ---
async function handleBlogListPage() {
    console.log('handleBlogListPage: Function started.'); // Added log
    const blogPostsListDiv = document.getElementById('blog-posts-list');
    if (!blogPostsListDiv) {
        console.log('handleBlogListPage: blog-posts-list div not found, exiting.');
        return;
    }
    console.log('handleBlogListPage: Initiated for blog.html');

    try {
        console.log('handleBlogListPage: Attempting to fetch blog/blog_posts.json');
        const response = await fetch('blog/blog_posts.json');
        console.log(`handleBlogListPage: Fetch response received. Status: ${response.status}, OK: ${response.ok}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogPosts = await response.json();
        console.log('handleBlogListPage: blog_posts.json parsed successfully.', blogPosts);

        blogPostsListDiv.innerHTML = ''; // Clear "Loading..."
        console.log('handleBlogListPage: Cleared "Loading..." message.');

        if (blogPosts.length === 0) {
            blogPostsListDiv.innerHTML = '<p>게시물이 없습니다.</p>';
            console.log('handleBlogListPage: No blog posts found.');
            return;
        }

        const postList = document.createElement('ul');
        postList.className = 'blog-list';
        console.log('handleBlogListPage: Created ul.blog-list element.');

        blogPosts.forEach(post => {
            // console.log(`handleBlogListPage: Processing post: ${post.slug}`); // Removed for less verbosity
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
            // console.log(`handleBlogListPage: Appended post ${post.slug} to list.`); // Removed for less verbosity
        });
        blogPostsListDiv.appendChild(postList);
        console.log('handleBlogListPage: All blog posts rendered and appended to blog-posts-list.');

    } catch (error) {
        console.error('handleBlogListPage: Failed to load blog posts:', error);
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
        console.log('handleBlogPostPage: No post slug or content div found.');
        if (blogPostContentDiv) blogPostContentDiv.innerHTML = '<p style="color: red;">게시물을 찾을 수 없습니다.</p>';
        if (postTitleH1) postTitleH1.textContent = '게시물 없음';
        return;
    }

    try {
        // Fetch blog post metadata to get the title
        console.log(`handleBlogPostPage: Fetching blog_posts.json for slug: ${postSlug}`);
        const responseMeta = await fetch('blog/blog_posts.json');
        if (!responseMeta.ok) throw new Error(`HTTP error! status: ${responseMeta.status}`);
        const blogPostsMeta = await responseMeta.json();
        const postMeta = blogPostsMeta.find(p => p.slug === postSlug);

        if (postTitleH1 && postMeta) {
            postTitleH1.textContent = postMeta.title;
            document.title = `${postMeta.title} - 한자 학습`; // Update page title
        } else if (postTitleH1) {
             postTitleH1.textContent = '게시물 없음';
             document.title = '게시물 없음 - 한자 학습';
        }

        // Fetch Markdown content
        console.log(`handleBlogPostPage: Fetching Markdown for slug: ${postSlug}`);
        const responseMd = await fetch(`blog/${postSlug}.md`);
        if (!responseMd.ok) {
            throw new Error(`HTTP error! status: ${responseMd.status}`);
        }
        const markdownContent = await responseMd.text();

        // Render Markdown to HTML
        console.log('handleBlogPostPage: Markdown content fetched. Checking marked...');
        if (typeof marked === 'undefined') {
            console.error('handleBlogPostPage: "marked" library is not defined!');
        } else {
            console.log('handleBlogPostPage: "marked" library is defined. Parsing Markdown.');
            blogPostContentDiv.innerHTML = marked.parse(markdownContent);
            console.log('handleBlogPostPage: Markdown parsed and rendered.');
        }


    } catch (error) {
        console.error(`handleBlogPostPage: Failed to load blog post "${postSlug}":`, error);
        if (blogPostContentDiv) blogPostContentDiv.innerHTML = '<p style="color: red;">게시물을 불러오는데 실패했습니다.</p>';
        if (postTitleH1) postTitleH1.textContent = '오류 발생';
    }
}

// Main routing logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Added log
    
    // Use element detection for robust routing
    if (document.querySelector('cheonjamun-card')) {
        handleIndexPage();
    } else if (document.getElementById('blog-posts-list')) {
        handleBlogListPage();
    } else if (document.getElementById('blog-post-content')) {
        handleBlogPostPage();
    }
});
