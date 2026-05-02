// E-IMZO — O'zbekiston elektron imzo tizimi
// Rasmiy: https://e-imzo.uz
// E-IMZO brauzer plaginini talab qiladi: https://e-imzo.uz/main/downloads/

const EIMZO_API_URL = "https://127.0.0.1:64646/frontend/cms/sign";

export interface EImzoSignResult {
  pkcs7: string;       // Imzolangan ma'lumot (PKCS#7 format)
  serialNumber: string; // Sertifikat seriya raqami
  subjectName: string; // Sertifikat egasi
  validFrom: string;
  validTo: string;
}

interface EImzoKey {
  serialNumber: string;
  subjectName: string;
  validFrom: string;
  validTo: string;
  alias: string;
}

// O'rnatilgan kalitlar ro'yxatini olish
export async function getEImzoKeys(): Promise<EImzoKey[]> {
  const response = await fetch("https://127.0.0.1:64646/api/listAllUserKeys", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      "E-IMZO plagin topilmadi. Iltimos, https://e-imzo.uz dan yuklab o'rnating."
    );
  }

  const data = await response.json();
  return data.keys || [];
}

// Matnni E-IMZO bilan imzolash
export async function signWithEImzo(challengeText: string): Promise<EImzoSignResult> {
  const keys = await getEImzoKeys();

  if (keys.length === 0) {
    throw new Error("Hech qanday E-IMZO kaliti topilmadi. Kalitingizni ulang.");
  }

  // Birinchi kalitni ishlatish (amalda foydalanuvchi tanlashi kerak)
  const key = keys[0];

  const response = await fetch(EIMZO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      alias: key.alias,
      data: btoa(challengeText), // Base64 formatida yuborish
    }),
  });

  if (!response.ok) {
    throw new Error("Imzolash muvaffaqiyatsiz tugadi.");
  }

  const data = await response.json();

  return {
    pkcs7: data.pkcs7_64,
    serialNumber: key.serialNumber,
    subjectName: key.subjectName,
    validFrom: key.validFrom,
    validTo: key.validTo,
  };
}
