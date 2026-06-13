import {DependencyList, useEffect} from "react";

export function useAsync(effect: () => Promise<void>, deps: DependencyList): void {
    useEffect(() => {
        const run = async () => {
            await effect();
        }
        run();
        }, deps);
}