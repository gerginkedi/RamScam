import { useState, useRef, useEffect, useCallback } from 'react';
import { RamContext } from './RamContext';

const RAM_KEY = 'ramscam_ram_balance';
const ALLOC_KEY = 'ramscam_allocated_ram';
const MB_TO_CHIP = 100 / 1024;
const CHUNK_MB = 50;

function getStored(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
}

function setStored(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (_e) {
        // localStorage erişilemez, sessizce devam et
    }
}

export function RamProvider({ children }) {
    const [allocatedRam, setAllocatedRam] = useState(() => getStored(ALLOC_KEY, null));
    const [ramBalance, setRamBalance] = useState(() => getStored(RAM_KEY, 0));

    const arenaRef = useRef(new Map());
    const keyCounter = useRef(0);
    const seedRef = useRef(null);

    const lcg = useCallback(() => {
        if (seedRef.current === null) seedRef.current = performance.now() * 1000 | 0;
        seedRef.current = Math.imul(1664525, seedRef.current) + 1013904223 | 0;
        return seedRef.current;
    }, []);

    const physicalAllocate = useCallback((targetMb) => {
        arenaRef.current.clear();
        keyCounter.current = 0;

        if (targetMb <= 0) return;

        const allocChunk = (mb) => {
            try {
                const buf = new ArrayBuffer(mb * 1024 * 1024);
                const view = new Uint8Array(buf);
                // Her 4KB page'i dirty yap — OS fiziksel RAM commit eder
                // LCG ile unique değerler — compression/deduplication engellenir
                for (let i = 0; i < view.length; i += 4096) {
                    view[i] = lcg() & 0xFF;
                }
                arenaRef.current.set(keyCounter.current++, buf);
            } catch (_e) {
                console.warn(`Chunk allocate edilemedi: ${mb}MB`);
            }
        };

        const chunks = Math.floor(targetMb / CHUNK_MB);
        const remainderMb = targetMb % CHUNK_MB;

        for (let i = 0; i < chunks; i++) allocChunk(CHUNK_MB);
        if (remainderMb > 0) allocChunk(remainderMb);
    }, [lcg]);

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
        ? Math.max(0, Math.floor(allocatedRam * (1 - Math.min(ramBalance, maxChip) / maxChip)))
        : 0;

    // usedRam değişince fiziksel RAM'i güncelle
    useEffect(() => {
        if (allocatedRam) {
            physicalAllocate(usedRam);
        }
        return () => {
            const arena = arenaRef.current;
            arena.clear();
        };
    }, [usedRam, allocatedRam, physicalAllocate]);

    return (
        <RamContext.Provider value={{ ramBalance, allocatedRam, usedRam, allocateRam, addRam, removeRam }}>
            {children}
        </RamContext.Provider>
    );
}