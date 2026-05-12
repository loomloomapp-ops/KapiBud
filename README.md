# KapiBud — лендінг ремонтної компанії

Pixel-perfect перенесення Figma-дизайну з `_legacy/` HTML-артбордів у живий React-сайт. Адаптив desktop/mobile в одному додатку, преміум-анімації GSAP, форми відправляють ліди в Telegram через PHP-проксі.

## Стек

- **Vite + React 18 + TypeScript** — статичний білд → завантажується на Hostinger як звичайний сайт.
- **GSAP + ScrollTrigger** — hero intro, scroll-reveal, hover, modal pop.
- **PHP `api/lead.php`** — Telegram Bot API проксі (токен НЕ потрапляє в клієнтський бандл).
- **Дизайн-токени** — у `src/styles/tokens.css` як CSS-змінні; усі стилі через `var(--*)`.

## Запуск локально

```sh
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/
npm run preview      # перевірити продакшн-білд локально
```

Форми у dev-режимі симулюють успішну відправку (немає PHP). На проді потрібен крок «Telegram» нижче.

## Деплой на Hostinger

1. Локально: `npm run build` → отримуєш папку `dist/`.
2. У `dist/` лежить `index.html`, `assets/`, `cases/`. Папку `api/` (з `lead.php`) Vite автоматично копіює з `public/api/`.
3. Через File Manager / FTP заливаєш **вміст** `dist/` у `public_html/` (або в піддиректорію).
4. На сервері створюєш `public_html/api/lead.config.php` (поряд із `lead.php`):

   ```php
   <?php
   define('TELEGRAM_TOKEN',   '8123456789:AA...');
   define('TELEGRAM_CHAT_ID', '123456789');
   ```

   - **TELEGRAM_TOKEN** отримаєш від [@BotFather](https://t.me/BotFather) → `/newbot`.
   - **TELEGRAM_CHAT_ID** — пиши боту → відкрий `https://api.telegram.org/bot<TOKEN>/getUpdates`, скопіюй `chat.id`. Для групи додай бота в групу адміністратором.

5. Перевір: відправ форму → лід має прилетіти в Telegram. Якщо ні — Hostinger пише все в `public_html/api/leads.log`.

## Структура

```
src/
  components/       — секції лендінгу (Header, Hero, Services, Cases…)
  data/cases.ts     — auto-generated з public/cases/*/description.txt
  styles/
    tokens.css      — дизайн-токени (єдина точка істини)
    global.css      — усі стилі (desktop ≥ 1024, mobile ≤ 640)
  anim/             — GSAP-хелпери
  lib/lead.ts       — клієнт для api/lead.php
public/
  api/lead.php      — PHP→Telegram проксі (НЕ комітимо lead.config.php!)
  assets/           — лого, hero-фотки, фон CTA
  cases/<slug>/     — фото кейсів (01.jpg…), video-NN.mp4, description.txt
_legacy/            — оригінальні HTML-артборди (не білдяться)
assets/Cases/       — сирі HEIC/JPG/MOV від замовника (не комітяться)
```

## Робота з кейсами

13 кейсів вже згенеровано в `public/cases/`. Якщо додаєш новий — поклади фото та `description.txt` у `public/cases/<slug>/` із полями:

```
Назва - …
Локація - …
Дата - 2026 рік
Бюджет - 1 000 000 грн
Площа - 75 м²
```

Потім перегенеруй TS-дані:
```sh
python3 /tmp/build_cases_ts.py    # див. конвертор у репі дизайнера
```

## Що НЕ робити

- Не хардкодити кольори/розміри — тільки через `var(--c-*)`, `var(--fs-*)` з `tokens.css`.
- Не комітити `public/api/lead.config.php` (токен!).
- Не редагувати `src/data/cases.ts` руками — це auto-generated файл.
