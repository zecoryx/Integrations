// @ts-nocheck

import React, { useState, useEffect } from 'react';

// 1. MANTIQ (Logic Hook)

export const useDeviceInfo = () => {
    const [info, setInfo] = useState({
        os: 'Unknown',
        browser: 'Unknown',
        cpuCores: 0,
        memory: 0, // RAM (taxminiy GB)
        screen: '',
        network: 'Unknown',
        battery: { level: '...', charging: '...' },
        isOnline: navigator.onLine
    });

    useEffect(() => {
        const nav: any = window.navigator;

        // 1. OS va Browserni aniqlash
        const ua = nav.userAgent;
        let os = 'Unknown';
        if (/Android/i.test(ua)) os = 'Android';
        else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
        else if (/Win/i.test(ua)) os = 'Windows';
        else if (/Mac/i.test(ua)) os = 'MacOS';
        else if (/Linux/i.test(ua)) os = 'Linux';

        // 2. Batareya (Asinxron)
        if (nav.getBattery) {
            nav.getBattery().then((batt: any) => {
                const updateBattery = () => {
                    setInfo(prev => ({
                        ...prev,
                        battery: {
                            level: `${Math.round(batt.level * 100)}%`,
                            charging: batt.charging ? 'Quvvatlanmoqda ⚡' : 'Quvvatlanmayapti'
                        }
                    }));
                };
                updateBattery();
                // Batareya o'zgarganda yangilash
                batt.addEventListener('levelchange', updateBattery);
                batt.addEventListener('chargingchange', updateBattery);
            });
        }

        // 3. Network turi (4G, 3G, Wifi) - Faqat Chrome/Androidda ishlaydi
        const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
        const netType = conn ? (conn.effectiveType || 'Wifi/Ethernet') : 'Unknown';

        setInfo(prev => ({
            ...prev,
            os,
            browser: nav.appName,
            cpuCores: nav.hardwareConcurrency || 'Noma\'lum',
            memory: nav.deviceMemory || 'Noma\'lum', // Faqat HTTPS da ishlaydi
            screen: `${window.screen.width}x${window.screen.height}`,
            network: netType.toUpperCase(),
            isOnline: nav.onLine
        }));

    }, []);

    return info;
};

// 2. KOMPONENT (UI)

export const DeviceInfoTable = () => {
    const info = useDeviceInfo();

    const styles = {
        container: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', fontFamily: 'sans-serif', maxWidth: '400px' },
        row: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '8px 0' },
        label: { fontWeight: 'bold', color: '#555' },
        val: { color: '#000' }
    };

    return (
        <div style={styles.container}>
            <h3 style={{ margin: '0 0 10px 0' }}>📱 Qurilma Holati</h3>

            <div style={styles.row}><span style={styles.label}>Tizim (OS):</span> <span style={styles.val}>{info.os}</span></div>
            <div style={styles.row}><span style={styles.label}>Ekran:</span> <span style={styles.val}>{info.screen} px</span></div>
            <div style={styles.row}><span style={styles.label}>Protsessor (Core):</span> <span style={styles.val}>{info.cpuCores} yadroli</span></div>
            <div style={styles.row}><span style={styles.label}>RAM (Xotira):</span> <span style={styles.val}>~{info.memory} GB</span></div>
            <div style={styles.row}><span style={styles.label}>Internet:</span> <span style={styles.val}>{info.isOnline ? `Online (${info.network})` : 'Offline 🔴'}</span></div>
            <div style={styles.row}><span style={styles.label}>Batareya:</span> <span style={styles.val}>{info.battery.level}</span></div>
            <div style={{ ...styles.row, borderBottom: 'none' }}><span style={styles.label}>Status:</span> <span style={styles.val}>{info.battery.charging}</span></div>
        </div>
    );
};