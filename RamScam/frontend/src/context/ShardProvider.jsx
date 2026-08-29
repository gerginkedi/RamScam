import { useState } from 'react';
import { ShardContext } from './ShardContext';

const SHARD_KEY = 'ramscam_shard_balance';
const SHARD_RATE = 0.1; // chip kazancının %10'u

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

export function ShardProvider({ children }) {
    const [shardBalance, setShardBalance] = useState(() => getStored(SHARD_KEY, 0));

    const syncAndSet = (val) => {
        const clamped = Math.max(0, val);
        setShardBalance(clamped);
        setStored(SHARD_KEY, clamped);
    };

    // Kazanılan chip miktarından shard üret
    const addShardFromWin = (chipAmount, shardMultiplier = 1) => {
        const earned = Math.floor(chipAmount * SHARD_RATE * shardMultiplier);
        if (earned > 0) syncAndSet(shardBalance + earned);
    };

    const addShard = (amount) => syncAndSet(shardBalance + amount);
    const removeShard = (amount) => syncAndSet(shardBalance - amount);
    const canAfford = (cost) => shardBalance >= cost;

    return (
        <ShardContext.Provider value={{ shardBalance, addShardFromWin, addShard, removeShard, canAfford }}>
            {children}
        </ShardContext.Provider>
    );
}