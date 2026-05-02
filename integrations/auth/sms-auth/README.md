# SMS Authentication

Telefon raqami va OTP (bir martalik parol) orqali foydalanuvchini autentifikatsiya qilish.

## Qanday ishlaydi

```
1. Foydalanuvchi telefon raqamini kiritadi
2. Backend raqamga SMS OTP jo'natadi
3. Foydalanuvchi 4-6 xonali kodni kiritadi
4. Backend kodni tasdiqlaydi → foydalanuvchi tizimga kiradi
5. OTP muddati o'tsa — qayta jo'natish tugmasi faollashadi (60 soniya)
```

## Setup

SMS jo'natish uchun backend tarafida SMS provider (masalan, Eskiz.uz) sozlanishi kerak.

`.env` fayliga qo'shing:

```env
SMS_AUTH_API_URL=http://your-backend.com/api/auth
```

Backend quyidagi endpointlarni ta'minlashi kerak:
- `POST /send-otp` — `{ phoneNumber }` qabul qiladi
- `POST /verify-otp` — `{ phoneNumber, otp }` qabul qiladi

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useSmsAuth.ts` | Autentifikatsiya oqimini boshqaruvchi hook |
| `useTimer.ts` | Qayta jo'natish countdown taymer |
| `api.ts` | Backend bilan bog'lanish |
| `OTPInput.tsx` | Har bir raqam uchun alohida input maydoni |

## Ishlatish

```tsx
import { useSmsAuth } from "./useSmsAuth";
import OTPInput from "./OTPInput";

const SmsLoginPage = () => {
  const {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isLoading,
    error,
    isOtpSent,
    isOtpVerified,
    sendOtp,
    verifyOtp,
    resendOtp,
    timer,
    isTimerRunning,
  } = useSmsAuth(60); // 60 soniya kutish vaqti

  if (isOtpVerified) return <p>Muvaffaqiyatli kirildi!</p>;

  if (!isOtpSent) {
    return (
      <div>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+998901234567"
        />
        <button onClick={() => sendOtp(phoneNumber)} disabled={isLoading}>
          Kodni jo'natish
        </button>
      </div>
    );
  }

  return (
    <div>
      <OTPInput length={6} value={otp} onChange={setOtp} />
      <button onClick={() => verifyOtp(otp)} disabled={isLoading}>
        Tasdiqlash
      </button>
      <button onClick={resendOtp} disabled={isTimerRunning}>
        {isTimerRunning ? `Qayta jo'natish (${timer}s)` : "Qayta jo'natish"}
      </button>
      {error && <p>Xato: {error.message}</p>}
    </div>
  );
};
```

## OTPInput komponenti

Har bir raqam uchun alohida input field. Clipboard paste va Backspace navigatsiyasini qo'llab-quvvatlaydi.

```tsx
<OTPInput
  length={6}        // OTP necha xonali
  value={otp}       // Joriy qiymat
  onChange={setOtp} // O'zgarish callback
/>
```
