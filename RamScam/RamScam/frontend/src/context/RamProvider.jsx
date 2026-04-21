import { useState } from 'react';
import { RamContext } from './RamContext';

const RAM_KEY = 'ramscam_ram_balance';

function getStoredRam() {
    try {
        const stored = localStorage.getItem(RAM_KEY);
        return stored ? parseInt(stored) : 1000;
    } catch {
        return 1000;
    }
}

function setStoredRam(val) {
    try {
        localStorage.setItem(RAM_KEY, val.toString());
    } catch {
        // localStorage erişilemez, sessizce devam et
    }
}

export function RamProvider({ children }) {
    const [ramBalance, setRamBalance] = useState(getStoredRam);

    const syncAndSet = (val) => {
        setRamBalance(val);
        setStoredRam(val);
    };

    const addRam = (amount) => syncAndSet(ramBalance + amount);
    const removeRam = (amount) => syncAndSet(ramBalance - amount);

    return (
        <RamContext.Provider value={{ ramBalance, addRam, removeRam }}>
            {children}
        </RamContext.Provider>
    );
}