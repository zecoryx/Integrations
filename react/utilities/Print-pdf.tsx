// @ts-nocheck
// Berilgan ma'lumotdan CHEK yasab, chop etish oynasini ochadi.

import React from 'react';

// 1. MANTIQ (Logic)

interface PrintOptions {
    title?: string;
    data: Record<string, any>; // { nomi: "Iphone", narxi: "100$" }
    footer?: string;
}

/**
 * Berilgan ma'lumotdan CHEK yasab, chop etish oynasini ochadi.
 */
export const printReceipt = ({ title = 'Check', data, footer = 'Xaridingiz uchun rahmat!' }: PrintOptions) => {
    // 1. Yangi ko'rinmas oyna ochamiz
    const printWindow = window.open('', '', 'height=600,width=400');

    if (!printWindow) {
        alert("Pop-up bloklangan! Iltimos, ruxsat bering.");
        return;
    }

    // 2. HTML yasaymiz (Chek dizayni)
    const listItems = Object.entries(data).map(([key, value]) => `
    <div class="row">
      <span class="label">${key}:</span>
      <span class="value">${value}</span>
    </div>
  `).join('');

    const htmlContent = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; text-align: center; }
          h2 { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dotted #ccc; }
          .label { font-weight: bold; }
          .footer { margin-top: 30px; font-size: 12px; border-top: 2px dashed #000; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <div class="content">
          ${listItems}
        </div>
        <div class="footer">${footer}</div>
        <script>
          // Oyna ochilishi bilan chop etishni so'raymiz
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

    // 3. Oynaga yozamiz va chop etamiz
    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

// 2. KOMPONENT (UI)

export const PrintButton = () => {
    const myData = {
        "Mahsulot": "iPhone 15 Pro",
        "Xotira": "256 GB",
        "Rangi": "Titanium",
        "Soni": "1 dona",
        "Narxi": "14 000 000 so'm",
        "Sana": new Date().toLocaleDateString()
    };

    return (
        <button
            onClick={() => printReceipt({ title: 'Aniclub Shop', data: myData })}
            style={{
                padding: '10px 20px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            🖨️ Chekni chiqarish
        </button>
    );
};