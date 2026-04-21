import { useState } from 'react';
import { RamContext } from './RamContext';

export function RamProvider({ children }) {
    const [ramBalance, setRamBalance] = useState(1000);
    const addRam = (amount) => setRamBalance(prev => prev + amount);
    const removeRam = (amount) => setRamBalance(prev => prev - amount);

    return (
        <RamContext.Provider value={{ ramBalance, addRam, removeRam }}>
            {children}
        </RamContext.Provider>
    );
}