
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
- **Hanja Card Component (`<hanja-card>`):** A custom Web Component that encapsulates the structure, style, and behavior for displaying a single character.
  - It shows the large character itself.
  - It displays the character's pronunciation (Hangeul - *hun-eum*).
  - It provides the meaning of the character in Korean.
- **Interactive Navigation:**
  - "Previous" and "Next" buttons allow the user to cycle through a predefined list of characters.
- **Data:**
  - A sample set of character data is included directly in the JavaScript.

## Current Plan

### Task: Add Character Set Selection

The following steps will be taken to allow users to switch between Korean (Hanja), Chinese (Traditional/Simplified), and Japanese (Kanji) character forms:

1.  **Update `main.js` Data:**
    -   The `hanjaData` array will be updated to include the corresponding characters for Chinese Traditional, Chinese Simplified, and Japanese Kanji for each entry.
2.  **Update `index.html`:**
    -   Add a set of selection buttons above the Hanja card to allow users to choose the character set they want to view.
3.  **Update `style.css`:**
    -   Add styles for the new character set selection buttons, including an 'active' state to indicate the current selection.
4.  **Update `main.js` Logic:**
    -   The `HanjaCard` web component will be modified to handle rendering the selected character set.
    -   Event listeners will be added to the new selection buttons to update the view when a different character set is chosen.
