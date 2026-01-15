// @ts-nocheck
// Jadvalni Excel (CSV) qilib yuklab olish

import React from 'react';

// MANTIQ
export const downloadExcel = (data: any[], fileName: string) => {
    if (!data?.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
};

// KOMPONENT (Tugma): <ExportExcelButton data={users} fileName="Users" />
interface Props {
    data: any[];
    fileName?: string;
    className?: string;
    label?: string;
}

export const ExportExcelButton: React.FC<Props> = ({ data, fileName = 'export', className, label = 'Excelga yuklash' }) => {
    return (
        <button onClick={() => downloadExcel(data, fileName)} className={className}>
            📥 {label}
        </button>
    );
};