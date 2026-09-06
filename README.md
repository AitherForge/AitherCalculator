# Aither Calculator

A fast, mobile-first calculator by Aither.

## Version

**6.0.0**

## What's new in 6.0

- Rebuilt the calculator around a real expression parser instead of chained single-operation state.
- Parentheses now evaluate as real grouped expressions.
- Supports full expressions with operator precedence: `+`, `−`, `×`, `÷`, `^`.
- Scientific functions can be used inside expressions.
- Added postfix percent and factorial evaluation.
- Added constants `π`, `e`, and `Ans` to expressions.
- Improved negative-number and sign handling.
- Improved reciprocal calculation.
- History entries can be loaded back into the calculator.
- Improved keyboard support for expressions, parentheses, percent, and powers.
- Force Update now asks the service worker to check for a newer version before reloading.
- Updated the PWA cache from v5 to v6 so GitHub Pages users receive the new calculator engine.

## Shared Aither Account

Aither Calculator uses the same Aither Account service as the other Aither apps. Use the same account credentials across Aither services rather than creating separate calculator accounts.

## Features

- Basic arithmetic
- Parentheses and expression evaluation
- Percentage, sign, reciprocal, and backspace controls
- Scientific mode with sin, cos, tan, square root, square, cube, absolute value, factorial, exponent, log, ln, pi, e, and Ans
- DEG and RAD angle modes
- Calculator memory: MC, MR, M+, and M−
- Calculation history stored locally and synced through the existing Aither cloud integration when signed in
- Unit converter with length, mass, temperature, and speed
- Light and dark themes
- Optional haptic feedback
- Optional sound effects
- Optional automatic clipboard copying after calculations
- Copy result to clipboard
- Keyboard support on desktop
- Responsive layout for iPhone, Android, tablet, and desktop
- PWA manifest and offline service worker
- Settings with Force Update
- No calculator API key required

## Run

Open `index.html` in a browser, or deploy the repository with GitHub Pages.

## Files

- `index.html` — app structure, calculator, settings, converter, and install UI
- `style.css` — responsive UI, themes, converter, and mobile layout
- `app.js` — expression parser, calculator engine, scientific functions, memory, history, settings, unit conversion, keyboard support, and PWA install handling
- `aither-auth.js` — shared Aither Account client
- `aither-cloud.js` — per-account calculator data synchronization
- `manifest.json` — web app metadata
- `sw.js` — offline cache and update worker

## License

MIT
