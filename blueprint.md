# Blueprint: Hanja Study Website

## Overview

This project is a web application designed to help users study Hanja (Chinese characters) and their counterparts in Chinese and Japanese. It provides a clean, modern, and interactive interface for learning and reviewing characters from multiple perspectives.

## Design and Features

### Visual Design
- **Aesthetics:** The application will have a minimalist and modern design with a focus on readability and a premium feel.
- **Layout:** A centered, card-based layout will be used to present the characters. The app will be responsive and work well on both desktop and mobile devices.
- **Color Palette:** A sophisticated color scheme will be used, with a textured background and vibrant accent colors for interactive elements.
- **Typography:** Expressive and legible fonts will be chosen. A traditional or calligraphic style font will be used for the large characters, while modern sans-serif fonts will be used for explanations.
- **Effects:** Subtle drop shadows and glow effects will be used to create a sense of depth and interactivity, making UI elements feel "lifted" and responsive.

### Implemented Features
- **Hanja Card Component (`<cheonjamun-card>`):** A custom Web Component that encapsulates the structure, style, and behavior for displaying a single character. (Previously `hanja-card`)
  - It shows the large character itself.
  - It displays the character's pronunciation (Hangeul - *hun-eum*).
  - It provides the meaning of the character in Korean.
- **Interactive Navigation:**
  - "Previous" and "Next" buttons allow the user to cycle through a predefined list of characters.
- **Data Management:**
  - **Separated Data Files:** Instead of a single `data.json`, character data is now organized into `hanja_data.json`, `simplified_chinese_data.json`, and `japanese_data.json` for better modularity and language-specific focus.
  - **Dynamic Data Loading:** The application dynamically loads the relevant language-specific data file (`hanja_data.json`, `simplified_chinese_data.json`, or `japanese_data.json`) only when needed, based on the user's selected character set. This improves efficiency and reduces initial load times.

## Current Plan

### Task: Add Sample Blog Content
- Created 4 new Markdown blog posts in `blog/`:
  - `importance-of-stroke-order.md`
  - `kanji-vs-hanja.md`
  - `learning-simplified-chinese.md`
  - `memory-techniques.md`
- Updated `blog/blog_posts.json` to include metadata for these new posts.

### Task: Fix Blog Routing and Asset Loading

This task addressed a critical bug where the blog list page (`blog.html`) and blog post page (`post.html`) were failing to load content due to incorrect routing logic and a missing library reference.

1.  **Robust Routing in `main.js`:**
    -   Replaced fragile URL-based routing (`window.location.pathname.endsWith(...)`) with robust element-presence detection.
    -   The application now checks for unique DOM elements (`cheonjamun-card`, `blog-posts-list`, `blog-post-content`) to determine which page logic to execute. This ensures compatibility across different hosting environments and URLs.
2.  **Fix `post.html` Script Reference:**
    -   Corrected the `script` tag for the `marked` library in `post.html`. It was pointing to a non-existent `js/marked.v4.umd.js` and has been updated to use the available `js/marked.min.js`.

### Previous Task: Refactor Data Handling and Add Dynamic Language Switching

This task involved refactoring how character data is stored and loaded, and implementing dynamic switching between Hanja, Simplified Chinese, and Japanese character sets.

1.  **Data Separation:**
    -   The original `data.json` file was split into three distinct JSON files: `hanja_data.json`, `simplified_chinese_data.json`, and `japanese_data.json`. Each file contains phrases and character details specific to its respective language set.
2.  **`main.js` Modifications:**
    -   The `cheonjamunData` variable was changed from an array to an object (`let cheonjamunData = {};`) to store language-specific data.
    -   A new `loadCheonjamunData(charset)` asynchronous function was introduced to fetch the appropriate JSON file based on the `charset` and store it in `cheonjamunData[charset]`.
    -   The `DOMContentLoaded` event listener was updated to use `loadCheonjamunData` for initial data loading.
    -   The `showCheonjamun` function was modified to retrieve data from `cheonjamunData[currentCharset]` and handle cases where data for the current charset might not be loaded yet.
    -   Navigation (`prev-btn`, `next-btn`) and charset selection buttons were updated to correctly reference the length of the currently loaded language data and to trigger dynamic loading when switching charsets.
    -   The `initialize()` function was updated to ensure data for the current charset is loaded before displaying.
3.  **`index.html`:**
    -   No changes were required in `index.html` as it already contained the necessary `data-charset` attributes for the selection buttons.
4.  **Cleanup:**
    -   The original `data.json` file has been removed.
