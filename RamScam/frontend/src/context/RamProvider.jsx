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

    const [selectedArtifact, setSelectedArtifact] = useState(() => getStored('ramscam_artifact', null));
    const [lossCount, setLossCount] = useState(0);
    const [hasRevived, setHasRevived] = useState(false);

    const CHIP_VALUE_MB = 1024 / 100; // 1 Chip = 10.24 MB

    const allocateRam = (mb) => {
        const chips = Math.round(mb / CHIP_VALUE_MB);
        setAllocatedRam(mb);
        setRamBalance(chips);
        setStored(ALLOC_KEY, mb);
        setStored(RAM_KEY, chips);
        setLossCount(0);
        setHasRevived(false);
    };

    const selectArtifact = (artifact) => {
        setSelectedArtifact(artifact);
        setStored('ramscam_artifact', artifact);
    };

    const syncAndSet = (val) => {
        let clamped = Math.max(0, val);

        if (clamped === 0 && selectedArtifact?.effectType === 'Revive' && !hasRevived) {
            const initialChips = Math.round(allocatedRam / CHIP_VALUE_MB);
            clamped = Math.floor(initialChips * 0.25);
            setHasRevived(true);
            alert("Hata Düzeltme Belleği (ECC Memory) Devreye Girdi! Sistem %25 RAM ile yeniden yüklendi.");
        }

        setRamBalance(clamped);
        setStored(RAM_KEY, clamped);
    };

    const addRam = (amount) => {
        let finalAmount = Math.floor(amount);
        if (selectedArtifact?.effectType === 'WinMultiplier') {
            finalAmount = Math.floor(amount * selectedArtifact.effectValue);
        }
        syncAndSet(ramBalance + finalAmount);
    };

    const removeRam = (amount) => {
        let finalAmount = Math.floor(amount);
        if (selectedArtifact?.effectType === 'RamMultiplierOnLossMultiplier' && lossCount < 2) {
            finalAmount = Math.floor(amount * selectedArtifact.effectValue);
            setLossCount(prev => prev + 1);
        } else if (selectedArtifact?.effectType === 'Safety') {
            finalAmount = Math.floor(amount * selectedArtifact.effectValue);
        }
        syncAndSet(ramBalance - finalAmount);
    };

    // Mevcut (Kullanılabilir) MB hesabı: Chip sayısına göre tam değer
    const availableRamMb = Math.min(allocatedRam, ramBalance * CHIP_VALUE_MB);
    const usedRam = allocatedRam ? Math.max(0, allocatedRam - availableRamMb) : 0;

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

    const availableRam = availableRamMb;

    return (
        <RamContext.Provider value={{
            ramBalance,
            allocatedRam,
            usedRam,
            availableRam,
            selectedArtifact,
            allocateRam,
            addRam,
            removeRam,
            selectArtifact
        }}>
            {children}
        </RamContext.Provider>
    );
}