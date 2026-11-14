import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Storage from 'expo-sqlite/kv-store';

// useState wrapper with persistence in SQLite DB
export function useSyncStorage<T>(key: string, initialValue?: T): [T, Dispatch<SetStateAction<T>>] {
	
	const [state, setState] = useState<T>(() => {

		try {
			const item = Storage.getItemSync(key);
			if (!item) {
				return initialValue;
			}
			return JSON.parse(item);
		} catch (e) {
			console.error(e);
			return initialValue;
		}

	});
	useEffect(() => {
		try {
			Storage.setItemSync(key, JSON.stringify(state));
		} catch (e) {
			console.error(e);
		}
	}, [state])

	return [state, setState];
}