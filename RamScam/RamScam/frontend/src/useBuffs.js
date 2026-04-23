import { useContext } from 'react';
import { BuffContext } from './context/BuffContext';
import { BUFFS } from './context/BuffProvider';

export function useBuffs() {
    return useContext(BuffContext);
}

export { BUFFS };