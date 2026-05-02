# i18n — Ko'p Tillik Qo'llab-quvvatlash

Tashqi kutubxonasiz O'zbek, Rus va Ingliz tillarini qo'llab-quvvatlash.

> Tashqi kutubxona kerak emas — faqat JSON fayllar va bitta hook.

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useTranslation.ts` | Til tanlash va tarjima hook |
| `locales/uz.json` | O'zbek tilidagi matnlar |
| `locales/ru.json` | Rus tilidagi matnlar |
| `locales/en.json` | Ingliz tilidagi matnlar |

## Ishlatish

```tsx
import { useTranslation } from "./useTranslation";

const Header = () => {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header>
      <h1>{t("common.loading")}</h1>
      <nav>
        <button onClick={() => setLocale("uz")}>O'zbek</button>
        <button onClick={() => setLocale("ru")}>Русский</button>
        <button onClick={() => setLocale("en")}>English</button>
      </nav>
      <p>Joriy til: {locale}</p>
    </header>
  );
};
```

## Dinamik qiymatlar (interpolation)

```json
// locales/uz.json
{
  "greeting": "Salom, {{name}}!",
  "itemCount": "{{count}} ta mahsulot"
}
```

```tsx
const { t } = useTranslation();

t("greeting", { name: "Ali" })     // → "Salom, Ali!"
t("itemCount", { count: 5 })       // → "5 ta mahsulot"
```

## Yangi matnlar qo'shish

1. Uch JSON fayliga ham qo'shing (uz, ru, en):

```json
// locales/uz.json
{
  "profile": {
    "title": "Profil",
    "editButton": "Profilni tahrirlash"
  }
}
```

2. Ishlatish:

```tsx
t("profile.title")       // → "Profil"
t("profile.editButton")  // → "Profilni tahrirlash"
```

## Til saqlash

Tanlangan til `localStorage` da saqlanadi — sahifa yangilanganda ham eslab qoladi.

## Katta loyiha uchun tavsiya

Katta loyihalarda `i18next` + `react-i18next` kutubxonasini ishlatish tavsiya etiladi — lazy loading, namespace, pluralization va boshqa imkoniyatlar bor.
