// @ts-nocheck

/**
 * Hozirgi internet holatini tekshiradi.
 */
export const isOnline = (): boolean => {
    return typeof navigator !== 'undefined' && navigator.onLine;
};

/*
export const useNetworkStatus = () => {
   Bu yerda addEventListener 'online' va 'offline' ishlatiladi
}
*/