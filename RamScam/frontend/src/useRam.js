import { useContext } from 'react';
import { RamContext } from './context/RamContext';

export function useRam() {
    return useContext(RamContext);
}