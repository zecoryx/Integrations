// @ts-nocheck
// Rasmni kichraytirish (Canvas orqali). Bu funksiya Promise qaytaradi, chunki bu og'ir operatsiya.

import React, { useState } from 'react';

// MANTIQ
export const compressFile = async (file: File, quality: number = 0.7): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => blob ? resolve(blob) : reject(), 'image/jpeg', quality);
            } else reject();
        };
        img.onerror = reject;
    });
};

// KOMPONENT: <ImageUploader onCompressed={(blob) => sendToServer(blob)} />
export const ImageUploader: React.FC<{ onCompressed: (file: Blob) => void }> = ({ onCompressed }) => {
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const compressed = await compressFile(e.target.files[0]);
            onCompressed(compressed);
        }
    };

    return <input type="file" accept="image/*" onChange={handleChange} />;
};