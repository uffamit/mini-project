# **App Name**: Real-Time Password Analyzer

## Core Features:

- Password Input: Displays a password input field with cyberpunk styling, simulating a terminal command line.
- Password Analysis: Analyzes password strength using an HTTP-triggered Firebase Cloud Function, providing a strength level and feedback using rules for password security and length.
- Feedback Display: Presents visual and textual feedback on password strength using a strength meter and checklist in a cyberpunk style.
- User Authentication: Allows users to create accounts and log in using Firebase Authentication (email/password provider), styled to match the cyberpunk theme.
- Session Management: Manages user sessions using React Context and Firebase's onAuthStateChanged to control access to protected routes, like the dashboard.
- Check History: Saves password check results (strength level, feedback, timestamp, and user ID) to Cloud Firestore, providing a history of password checks.
- Dashboard Display: Displays the password check history as a log file readout, showing timestamps, strength levels, and results in a cyberpunk-themed dashboard, called "Session Logs".

## Style Guidelines:

- Background color: Near-black (#0A0A1A) to provide a dark mode base for the cyberpunk aesthetic.
- Primary color: Neon cyan (#00FFFF) for primary text, buttons, and borders to create a glowing effect.
- Accent color: Neon magenta (#FF00FF) for highlights and secondary actions to add contrast.
- Font: 'Roboto Mono' (monospace sans-serif) to simulate a computer terminal, applied throughout the application. Note: currently only Google Fonts are supported.
- Containers and cards: Sharp edges (rounded-none) with subtle neon borders and slightly transparent backgrounds for a holographic panel feel.
- Buttons: No rounded corners, with a solid neon border; they glow on hover (e.g., using shadow-[0_0_15px_cyan]).
- Input Fields: Transparent backgrounds, glowing neon border on focus, and a blinking cursor effect, simulating a terminal command line.
- Subtle animations such as a scan line effect on the background and text that appears as if being typed, along with glowing hover effects on interactive elements.