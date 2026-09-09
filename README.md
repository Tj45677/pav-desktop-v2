# President Audio Visual Interactive Desktop Platform

An interactive desktop-style web application built with Next.js, React, and TypeScript.

This project serves two purposes:
1. A **creative platform** to showcase original music and media
2. A **technical portfolio** demonstrating frontend architecture and system design

---

## Purpose

This website is primarily designed as a **music platform**, not just a portfolio.

When accessed normally, it functions as an **interactive environment for fans**, featuring:
- Music discovery (released and unreleased)
- Visual identity and branding
- Desktop-style exploration

The experience is intentionally immersive — users are not navigating a website, but interacting with a system.

When navigating to `/portfolio`, the **terminal becomes accessible**, revealing:
- Technical projects
- Work experience
- Skills and contact information

This creates a **dual-purpose platform**:
- Public-facing creative experience
- Hidden technical portfolio

---

## Core Concept

Instead of building separate pages, the application simulates an **operating system inside the browser**, where:

- Apps behave like real desktop applications
- Windows can be opened, minimized, and layered
- State persists across interactions

The architecture is designed to support future features such as:
- Measurable engagement (streams, likes, interactions)
- Unlockable or hidden content (e.g. unreleased music)
- Scalable media and app expansion

---

## Features

### Desktop Environment
- Full-screen wallpaper-based layout
- Taskbar with app state tracking
- Window lifecycle management (open, minimize, maximize, close)
- Focus system with z-index layering

### Window System
- Shared window container for all apps
- Smooth animation system (minimize, restore, maximize)
- State-driven positioning and resizing
- Persistent app state (no reset on minimize)

---

## Applications

### Music App
- Audio playback using the **HTML5 Audio API**
- Track selection and active playback state
- Custom controls (play, pause, next, previous)
- Volume control and scrubber
- Featured page with:
  - Banner
  - Featured tracks
  - Scrollable discography

### Terminal (SuperShell)
- Interactive command-line interface
- Custom command system (`help`, `projects`, `experience`, etc.)
- Paginated viewer (Enter / Escape navigation)
- Custom text parsing for formatted output
- Hidden behind `/portfolio` route

### Browser (Mock)
- Internal navigation environment for content (merch / about)
- Designed for future expansion into real content delivery

---

## Architecture

### System Design

The application is built around a **desktop shell**, not individual pages.

All applications are:
- Independent
- Modular
- Controlled by a shared window system

---

## Custom File Breakdown

### `DesktopManager.tsx`
The core of the entire system.

- Manages all window state (open, minimized, focused, position, z-index)
- Handles animations (minimize, restore, maximize)
- Controls which apps are rendered
- Acts as the “operating system”

---

### `Window.tsx`
Reusable window container.

- Provides consistent UI (title bar, controls, borders)
- Handles user interactions (drag, resize, controls)
- Accepts different app content as children
- Allows styling variations per app

---

### `Taskbar.tsx`
Controls application access and state visibility.

- Displays available apps
- Shows active/minimized state
- Handles app launching and restoring
- Anchors the desktop experience

---

### `MusicApp.tsx`
Handles all music-related UI and logic.

- Displays library (featured, albums, songs, artists)
- Manages track selection
- Communicates playback state to the main system
- Designed for scalability (future releases, hidden tracks)

---

### `MusicTitleBar.tsx`
Custom media control layer.

- Play / pause / skip controls
- Volume slider
- Track preview and scrubber
- Designed to mimic native media UI

---

### `TerminalApp.tsx`
Interactive terminal system.

- Parses and executes commands
- Maintains command history
- Implements paginated content viewer
- Custom formatting system (bold parsing)

---

### `ChromeApp.tsx`
Mock browser environment.

- Used for internal navigation and content display
- Acts as a placeholder for future real web features

---

### `musicLibrary.ts`
Centralized data source for music.

- Defines releases, tracks, and metadata
- Supports both released and unreleased content
- Feeds into the Music App dynamically

---

## Major Challenges

### 1. Architecture Limitation (V1 → V2 Rebuild)

**Problem:**
The initial version (V1) had the terminal tightly integrated into the main page.  
This made the system rigid and limited scalability.

**Impact:**
- Could not easily add new apps
- No reusable window system
- Difficult to maintain or expand

**Solution:**
Rebuilt the project around a **desktop shell architecture**, where:
- Apps are modular
- Windows are reusable
- State is centralized

This was a full structural reset, not a small fix.

---

### 2. Window Lifecycle & State Persistence

**Problem:**
Minimizing a window caused it to unmount, resetting all internal state (e.g. terminal history, music state)

**Solution:**
Switched from conditional rendering to **CSS-based visibility**, keeping components mounted while hidden

---

### 3. Media Playback in Production

**Problem:**
Audio worked locally but failed in production

**Cause:**
Incorrect file paths and case-sensitive directory issues

**Solution:**
- Standardized asset structure in `/public`
- Fixed path casing (`/music` vs `/Music`)
- Ensured proper deployment compatibility

---

### 4. Event Propagation Conflicts

**Problem:**
Double-clicking controls triggered unintended window maximize

**Solution:**
Controlled event propagation using `stopPropagation()` on interactive elements

---

### 5. Custom Terminal Rendering

**Problem:**
Formatted text (`**bold**`) displayed as raw text

**Solution:**
Built a custom parser to render styled terminal output

---

## Deployment

Deployed using Vercel.

### Run locally

```bash
npm install
npm run dev
