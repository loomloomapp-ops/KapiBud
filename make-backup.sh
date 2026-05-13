#!/bin/bash
# Створює готовий до розгортання архів сайту PrimeBud для клієнта.
# Usage: ./make-backup.sh
#
# Що робить:
#   1. npm run build  → dist/
#   2. Копіює всі PHP-ендпойнти, дані (data/) і завантажені медіа (uploads/, cases/)
#   3. Кладе README з інструкцією
#   4. Архівує в primebud-backup-YYYY-MM-DD.zip

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "→ Збираємо фронтенд (vite build)…"
npm run build

DIST="$ROOT/dist"
DATE=$(date +%Y-%m-%d)
OUT="primebud-backup-$DATE"

echo "→ Готуємо $OUT/ …"
rm -rf "$OUT" "$OUT.zip"
cp -R "$DIST" "$OUT"

# PHP-ендпойнти (бекенд адмінки + лід-форма)
echo "→ Копіюємо PHP api/ …"
cp -R public/api "$OUT/api"
# admin.config.php з реальним хешем — НЕ копіюємо, замість нього кладемо приклад
rm -f "$OUT/api/admin/admin.config.php"

# Дані сайту
echo "→ Копіюємо data/ …"
cp -R public/data "$OUT/data"

# Завантажена клієнтом адмінкою медіа (якщо є)
if [ -d public/uploads ]; then
  cp -R public/uploads "$OUT/uploads"
else
  mkdir "$OUT/uploads"
fi

# Існуючі кейси (стартові)
if [ -d public/cases ]; then
  cp -R public/cases "$OUT/cases"
fi

# Lead config приклад (НЕ кладемо реальний)
[ -f public/api/lead.config.php ] && rm "$OUT/api/lead.config.php" || true

cat > "$OUT/README.md" <<'EOF'
# PrimeBud — інструкція з розгортання

Бекап містить готовий до завантаження сайт + PHP-бекенд адмінки.

## Вимоги до хостингу

- PHP **8.1+** (включно `finfo`, `mbstring`, `fileinfo`, `json`, `session`).
- HTTPS дуже бажано (сесійні куки `secure` вмикаються автоматично).
- Підтримка `mod_rewrite` НЕ потрібна (адмінка на HashRouter).

## Кроки розгортання

1. Завантажте весь вміст архіву у кореневу папку сайту (наприклад `public_html/`).
2. Створіть файл `api/admin/admin.config.php` за прикладом `api/admin/admin.config.example.php`.
   Згенерувати хеш паролю:
   ```bash
   php -r "echo password_hash('ваш-пароль', PASSWORD_BCRYPT);"
   ```
3. (Опційно) Створіть `api/lead.config.php` за прикладом `api/lead.config.example.php` —
   щоб форми надсилали ліди у Telegram.
4. Перевірте, що папки `data/`, `uploads/`, `cases/` мають права запису (рекомендовано `755`).

## Перевірка

- Сайт: `https://your-domain/`
- Адмінка: `https://your-domain/admin/` — увійдіть з логіном/паролем з admin.config.php.
- Лід-форми: спробуйте відправити тестову заявку.

## Структура

```
/index.html, /assets/        — фронтенд (vite build)
/admin/                      — адмін-SPA
/api/lead.php                — приймання лідів → Telegram
/api/admin/*.php             — бекенд адмінки
/data/*.json                 — контент сайту (services, plans, cases, ...)
/uploads/                    — завантажені медіа (тарифи, відгуки)
/cases/<slug>/               — фото та відео кейсів
```

## Зміна пароля адміна

Відредагуйте `api/admin/admin.config.php`, замініть `pass_hash` на новий хеш.

## Безпека

- НЕ комітьте `admin.config.php` у git.
- Для додаткового захисту можна обмежити доступ до `/admin/` HTTP Basic Auth через `.htaccess`.
- Логи lead-форми пишуться в `api/leads.log` (gitignore).
EOF

echo "→ Архівуємо…"
zip -rq "$OUT.zip" "$OUT"
rm -rf "$OUT"

SIZE=$(du -h "$OUT.zip" | cut -f1)
echo ""
echo "✓ Готово: $OUT.zip ($SIZE)"
echo ""
echo "Передайте клієнту цей архів + інструкцію в ньому (README.md)."
