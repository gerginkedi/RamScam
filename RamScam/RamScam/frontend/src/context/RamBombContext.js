import { useRef } from 'react';

export function useRamBomb() {
    const arena = useRef(new Map());
    const rafId = useRef(null);
    let keyCounter = 0;

    const getRamLimitMb = () => {
        if(performance.memory) {
            const totalMb = performance.memory.totalJSHeapSize / (1024 * 1024);
            return Math.floor(totalMb * 0.8); // Use 80% of total JS heap as limit
        }
        return 4096; // Default to 4GB if memory info is unavailable
    }

    const start = (chunkMb = 16) => {
        const limitMb = getRamLimitMb();

        const bomb = () => {
            try {
                const totalAllocated = arena.current.size * chunkMb;
                if(totalAllocated >= limitMb) {
                    console.log(`Reached RAM limit of ${limitMb} MB. Stopping allocation.`);
                    return;
                }

                const buf = new ArrayBuffer(chunkMb * 1024 * 1024);
                arena.current.set(keyCounter++, buf);
                rafId.current = requestAnimationFrame(bomb);
            } catch(e) {
                if (chunkMb > 1) {
                    start(Math.floor(chunkMb / 2)); // Reduce chunk size and try again
                }
            };

            
        };
        rafId.current = requestAnimationFrame(bomb);
    };
    const stop = () => {
        cancelAnimationFrame(rafId.current);
        arena.current.clear();
    }

    return {start, stop};
}