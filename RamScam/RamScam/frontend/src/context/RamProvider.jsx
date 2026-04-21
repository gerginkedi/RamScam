import { useState } from 'react';
import { RamContext } from './RamContext';

const RAM_KEY = 'ramscam_ram_balance';
const ALLOC_KEY = 'ramscam_allocated_ram';
const MB_TO_CHIP = 100 / 1024;

function getStored(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
}

function setStored(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch {
        // localStorage erişilemez, sessizce devam et
    }
}

export function RamProvider({ children }) {
    const [allocatedRam, setAllocatedRam] = useState(() => getStored(ALLOC_KEY, null));
    const [ramBalance, setRamBalance] = useState(() => getStored(RAM_KEY, 0));

    const allocateRam = (mb) => {
        const chips = Math.floor(mb * MB_TO_CHIP);
        setAllocatedRam(mb);
        setRamBalance(chips);
        setStored(ALLOC_KEY, mb);
        setStored(RAM_KEY, chips);
    };

    const syncAndSet = (val) => {
        const clamped = Math.max(0, val);
        setRamBalance(clamped);
        setStored(RAM_KEY, clamped);
    };

    const addRam = (amount) => syncAndSet(ramBalance + amount);
    const removeRam = (amount) => syncAndSet(ramBalance - amount);

    // Ters orantı: chip azaldıkça usedRam artar
    const maxChip = allocatedRam ? Math.floor(allocatedRam * MB_TO_CHIP) : 0;
    const usedRam = allocatedRam && maxChip > 0
        ? Math.floor(allocatedRam * (1 - ramBalance / maxChip))
        : 0;

    return (
        <RamContext.Provider value={{ ramBalance, allocatedRam, usedRam, allocateRam, addRam, removeRam }}>
            {children}
        </RamContext.Provider>
    );
}