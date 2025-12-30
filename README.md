# To-Do List App

Simple, browser-based to-do list that lets you add, edit, and remove tasks with optional descriptions, stored locally in your browser.

## Features

**Core**

- Create tasks with a title and optional description via a popup editor, keeping the main list uncluttered.
- Edit existing tasks in place using the same editor, so updates are consistent.
- Delete tasks with a brief fade/scale animation to reduce abrupt UI changes.
- Persist tasks in `localStorage`, so the list survives page reloads.

**UI / UX**

- Responsive layout with media queries for mobile and tablet sizes.
- Scroll behavior that activates only after the list grows, preventing unnecessary scrollbars.

## Tech Stack

**Frontend**

- HTML5 for structure (`index.html`).
- CSS3 for layout, responsive design, and animations (`style.css`).
- Vanilla JavaScript for DOM manipulation and application logic (`main.js`).
- Font Awesome icons loaded via CDN for edit/add/delete glyphs.

**State and persistence**

- Browser `localStorage` for saving the list as JSON under the `list` key.

## Architecture / Project Structure

Single-page, static application with DOM-driven state management.

**Key files**

- `index.html`: App shell and DOM structure, includes external Font Awesome CSS and local assets.
- `main.js`: Task model, localStorage persistence, popup editor logic, and event handlers. Sets `LIST_SCROLL_DELAY_MS` to control when scrolling is enabled for the list.
- `style.css`: Layout, responsive breakpoints, and UI styles (header/footer, list, popup).

## Security / Privacy Notes

- All data is stored locally in the browser via `localStorage`.
- Clearing site data or using a different browser/profile will remove or hide existing tasks.
- There is no authentication or authorization layer.

## Live Demo

[Open the app](https://my-app-todo-list.vercel.app/)
