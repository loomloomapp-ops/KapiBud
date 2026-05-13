# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

KapiBud — лендінг ремонтної компанії на **Vite + React 18 + TypeScript**, з GSAP-анімаціями та PHP→Telegram проксі для лідів. Дизайн перенесено 1:1 з Figma-артбордів (зберігаються в `_legacy/`).

## Розробка

- `npm install` — встановити залежності.
- `npm run dev` — dev-сервер на :5173.
- `npm run build` — продакшн-білд у `dist/` (заливається на Hostinger).
- `npm run preview` — превʼю білда локально.
- `npm run lint` — eslint.

Тестів немає. Hostinger хостить статику + один PHP-ендпойнт `api/lead.php`.

## Архітектура

### Єдина точка істини — токени
`src/styles/tokens.css` визначає всю палітру/типографіку/відступи як CSS-змінні. **Будь-яку зміну стилів робити через `var(--*)`**, ніколи не хардкодити значення в компонентах. Адаптив реалізовано через `@media (max-width: 1024px / 640px)` у `src/styles/global.css`, який перевизначає `--pad-x` та layout-сітки. Окремого мобільного збірника немає.

### Лендінг = одна сторінка з композицією секцій
`src/App.tsx` тримає глобальний стан модалок (`openCase`) і скрол-якорі (`scrollToEstimate`, `scrollToCases`). Кожна секція — окремий компонент у `src/components/`:

- `Hero.tsx` — фон з parallax-зумом + інтро-анімація + права колонка з формою. Анімації навʼязуються через `gsap.context()` у `useEffect`.
- `Cases.tsx` — слайдер кейсів (3/2/1 колонки залежно від `useColsPerPage`); клік відкриває `CaseModal`.
- `CaseModal.tsx` — overlay із сіткою фото + lightbox (Esc/←/→). Блокує scroll `body.style.overflow`.
- `Estimate.tsx` — 3-крокова квіз-форма, на фінальному кроці шле `sendLead({source:'quiz'})`.

Інші — статичний контент із hover/scroll-reveal анімаціями (`useScrollReveal`).

### Контент сайту — JSON у `public/data/*.json`
Послуги, кейси, тарифи, відгуки, FAQ і партнери лежать як JSON у `public/data/`. Фронтенд читає їх через `useContent()` ([src/lib/content.ts](src/lib/content.ts)). Редагувати ці файли — або через адмінку (`/admin/`), або вручну в JSON. `src/data/cases.ts` тепер тримає лише `CaseItem` тип і fallback-копію.

### Адмінка — `/admin/`
Окрема React-SPA (другий entry-point Vite, збирається в `dist/admin/`). PHP-бекенд у `public/api/admin/`. Сесійна авторизація, CSRF, валідація типів. Конфіг із хешем пароля — `public/api/admin/admin.config.php` (НЕ в git, є `admin.config.example.php`).

Локально для адмінки потрібен PHP-сервер: `npm run dev:php` поряд із `npm run dev`. Vite проксиює `/api` → `127.0.0.1:8081`.

### Бекап клієнту
`./make-backup.sh` створює `primebud-backup-YYYY-MM-DD.zip` готовий до завантаження на будь-який PHP-хостинг.

Конвертація сирих фото від замовника (`assets/Cases/Кейс N "…"/*.HEIC`/`.MOV`) → `public/cases/<slug>/*.jpg`/`video-NN.mp4` робиться `/tmp/convert_cases.py` (sips + ffmpeg).

### Ліди → Telegram
`src/lib/lead.ts` шле POST на `/api/lead.php`. У dev-режимі без бекенду симулює успіх — щоб не блокувати UI-флоу. PHP читає `lead.config.php` (НЕ в git) з `TELEGRAM_TOKEN`/`TELEGRAM_CHAT_ID`, шле в `https://api.telegram.org/bot<TOKEN>/sendMessage`. Якщо конфіг відсутній — логує в `leads.log` поряд.

### Vite-нюанси
- `base: './'` у `vite.config.ts` — щоб білд працював у будь-якій піддиректорії Hostinger.
- `public/api/` копіюється у `dist/api/` як є → PHP лишається працездатним.

## Що НЕ робити

- Не комітити `public/api/lead.config.php` і `public/api/admin/admin.config.php` (секрети!) — обидва в `.gitignore`.
- Не повертати імпорти даних з TS-констант у компонентах — фронт читає лише з `/data/*.json`.
- Не дублювати mobile.html — адаптив у `global.css` через media-queries; mobile.html залишений у `_legacy/` лише як референс.
- Не вмикати `width=1440` viewport — нам треба реальна адаптивність.
