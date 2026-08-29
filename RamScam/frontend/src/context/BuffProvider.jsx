import { useState, useCallback } from 'react';
import { BuffContext } from './BuffContext';

const BUFF_KEY = 'ramscam_active_buffs';

const BUFFS = {
    CHIP_BOOST: {
        id: 'CHIP_BOOST',
        name: '1.5x Chip Kazancı',
        icon: '⚡',
        cost: 50,
        maxUses: 10,
    },
    RAM_SHIELD: {
        id: 'RAM_SHIELD',
        name: '0.5x RAM Koruma',
        icon: '🛡️',
        cost: 120,
        maxUses: 3,
    },
    JOKER: {
        id: 'JOKER',
        name: 'Kurtarıcı Joker',
        icon: '🃏',
        cost: 60,
        maxUses: 1,
    },
    SHARD_BOOST: {
        id: 'SHARD_BOOST',
        name: '1.2x Shard Kazancı',
        icon: '💎',
        cost: 20,
        maxUses: 5,
    },
};

function getStored(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
}

function setStored(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (_e) {}
}

export function BuffProvider({ children }) {
    const [activeBuffs, setActiveBuffs] = useState(() => getStored(BUFF_KEY, {}));

    const syncAndSet = (val) => {
        setActiveBuffs(val);
        setStored(BUFF_KEY, val);
    };

    // Buff satın al ve aktif et
    const activateBuff = useCallback((buffId) => {
        const buff = BUFFS[buffId];
        if (!buff) return;

        syncAndSet({
            ...activeBuffs,
            [buffId]: {
                ...buff,
                remainingUses: buff.maxUses,
            }
        });
    }, [activeBuffs]);

    // Buff kullanıldı, kalan kullanım sayısını azalt
    const consumeBuff = useCallback((buffId) => {
        const current = activeBuffs[buffId];
        if (!current) return;

        const remaining = current.remainingUses - 1;

        if (remaining <= 0) {
            // Buff bitti, sil
            const updated = { ...activeBuffs };
            delete updated[buffId];
            syncAndSet(updated);
        } else {
            syncAndSet({
                ...activeBuffs,
                [buffId]: { ...current, remainingUses: remaining }
            });
        }
    }, [activeBuffs]);

    const hasBuff = useCallback((buffId) => {
        return !!activeBuffs[buffId] && activeBuffs[buffId].remainingUses > 0;
    }, [activeBuffs]);

    const getBuffUses = useCallback((buffId) => {
        return activeBuffs[buffId]?.remainingUses ?? 0;
    }, [activeBuffs]);

    return (
        <BuffContext.Provider value={{
            activeBuffs,
            activateBuff,
            consumeBuff,
            hasBuff,
            getBuffUses,
            BUFFS,
        }}>
            {children}
        </BuffContext.Provider>
    );
}

export { BUFFS };