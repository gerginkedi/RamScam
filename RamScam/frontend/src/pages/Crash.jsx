import { useEffect, useState } from 'react';
import '../styles/Crash.css';

const LOG_LINES = [
    '[0.000] RamScam kernel initializing...',
    '[0.012] Loading memory allocator... OK',
    '[0.034] Mounting virtual RAM partition... OK',
    '[0.051] Starting chip economy engine... OK',
    '[0.089] Attaching session to RAM block... OK',
    '[0.120] WARNING: RAM pressure threshold exceeded',
    '[0.143] CRITICAL: Chip balance reached zero',
    '[0.144] Memory pages becoming unstable...',
    '[0.145] ERROR: Cannot reclaim allocated RAM blocks',
    '[0.146] ERROR: Heap corruption detected at 0x7FFD3A21',
    '[0.147] ERROR: Stack overflow in chip_engine.dll',
    '[0.148] PANIC: Unrecoverable state in ram_allocator',
    '[0.149] FATAL: System integrity compromised',
    '[0.150] Attempting emergency dump...',
    '[0.151] DUMP FAILED: No memory available',
    '[0.152] *** SYSTEM CRASH ***',
    '[0.153] Process: RamScam.exe terminated',
    '[0.154] Exit code: 0xDEADC0DE',
];

function Crash() {
    const [visibleLines, setVisibleLines] = useState([]);
    const [showGlitch, setShowGlitch] = useState(false);
    const [showBtn, setShowBtn] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < LOG_LINES.length) {
                setVisibleLines(prev => [...prev, LOG_LINES[i]]);
                i++;

                // Son 6 satırdan itibaren glitch başlar
                if (i >= LOG_LINES.length - 6) {
                    setShowGlitch(true);
                }
            } else {
                clearInterval(interval);
                setDone(true);
                setTimeout(() => setShowBtn(true), 800);
            }
        }, 120);

        return () => clearInterval(interval);
    }, []);

    const handleRestart = () => {
        // localStorage ve sessionStorage temizle
        try {
            localStorage.removeItem('ramscam_ram_balance');
            localStorage.removeItem('ramscam_allocated_ram');
        } catch {
            // bos.
        }
        sessionStorage.clear();
        window.location.href = '/home';
    };

    return (
        <div className={`crash-root ${showGlitch ? 'glitch-bg' : ''}`}>
            <div className='crash-terminal'>
                <div className='crash-terminal-bar'>
                    <span>ramscam_system @ crash — bash</span>
                </div>
                <div className='crash-terminal-body'>
                    {visibleLines.map((line, idx) => {
                        if (!line) return null;
                        return (
                            <div
                                key={idx}
                                className={`crash-log-line ${
                                    line.includes('FATAL') || line.includes('PANIC') || line.includes('*** SYSTEM')
                                        ? 'log-fatal'
                                        : line.includes('ERROR') || line.includes('CRITICAL')
                                        ? 'log-error'
                                        : line.includes('WARNING')
                                        ? 'log-warn'
                                        : line.includes('DUMP FAILED') || line.includes('Exit code') || line.includes('SHUTDOWN FAILED')
                                        ? 'log-fatal'
                                        : 'log-normal'
                                }`}
                            >
                                {line}
                            </div>
                        );
                    })}
                    {done && (
                        <div className='crash-cursor'>█</div>
                    )}
                </div>
            </div>

            {showBtn && (
                <button className='crash-restart-btn' onClick={handleRestart}>
                    [ RESTART SESSION ]
                </button>
            )}
        </div>
    );
}

export default Crash;