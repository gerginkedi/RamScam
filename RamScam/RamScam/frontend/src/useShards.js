import { useContext } from 'react';
import { ShardContext } from './context/ShardContext';

export function useShards() {
    return useContext(ShardContext);
}