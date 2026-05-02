# Text-to-Speech (TTS)

Brauzerning Web Speech API yordamida matnni ovozga aylantirish.

> Tashqi API kerak emas — brauzerning o'zi matnni o'qiydi. Barcha zamonaviy brauzerlarda ishlaydi.

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useTextToSpeech.ts` | Matnni ovoz bilan o'qitish hook |

## Ishlatish

```tsx
import { useTextToSpeech } from "./useTextToSpeech";

const TTSButton = () => {
  const { isSpeaking, error, speak } = useTextToSpeech();

  return (
    <div>
      <button
        onClick={() => speak("Salom! Bu ovozli xabar.")}
        disabled={isSpeaking}
      >
        {isSpeaking ? "O'qilmoqda..." : "O'qish"}
      </button>
      {error && <p>Xato: {error}</p>}
    </div>
  );
};
```

## Hook qaytaradigan qiymatlar

| Qiymat | Turi | Tavsif |
|--------|------|--------|
| `isSpeaking` | `boolean` | Ovoz chiqarilayapti |
| `error` | `string \| null` | Brauzer qo'llab-quvvatlamasa |
| `speak` | `(text: string) => void` | Matnni o'qitadi |

## Ovozni sozlash

`useTextToSpeech.ts` dagi `speak` funksiyasida qo'shimcha sozlamalar qo'shishingiz mumkin:

```ts
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = "uz-UZ";  // Til
utterance.rate = 1.0;       // Tezlik (0.1 – 10)
utterance.pitch = 1.0;      // Balandlik (0 – 2)
utterance.volume = 1.0;     // Ovoz balandligi (0 – 1)
```

## STT bilan birga ishlatish

```tsx
import { useSpeechRecognition } from "../stt/useSpeechRecognition";
import { useTextToSpeech } from "./useTextToSpeech";

const VoiceAssistant = () => {
  const { transcript, startListening } = useSpeechRecognition();
  const { speak } = useTextToSpeech();

  // Foydalanuvchi gapirgandan keyin javob berish
  useEffect(() => {
    if (transcript) {
      speak(`Siz aytdingiz: ${transcript}`);
    }
  }, [transcript]);
};
```
