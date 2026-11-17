import {Dispatch, SetStateAction, useState} from "react";
import {useAsync} from "@/hooks/useAsync";
import Storage from 'expo-sqlite/kv-store';

// useState wrapper which will lazily load copy of wanted data from AsyncStorage before retrieving from API
export function useLazyFetch<T>(storageKey: string, fetchTarget: string | URL | Request, initialValue:T, setIsLoadingState?: (value: (((prevState: boolean) => boolean) | boolean)) => void, errorValue?: T):[T, React.Dispatch<React.SetStateAction<T>>] {
	
	// Set initial state
	const [state, setState] = useState<T>(initialValue);

	// Set state from locally stored data
	useAsync(async () => {
		try {
			const item = await Storage.getItem(storageKey);
			if (item) {
				const data:T = JSON.parse(item);
				setState(data);
			}
		} catch (e) {
			console.error(e);
		}
	}, [])

	// Fetch from API and set state
	useAsync(async () => {
		if (setIsLoadingState) {
			setIsLoadingState(true);
		}
		
		const response = await fetch(fetchTarget);
		if (!response.ok) {
			console.error(response);
			setState(errorValue ?? initialValue);
		} else {
			const data:T = await response.json();
			setState(data);
		}

		if (setIsLoadingState) {
			setIsLoadingState(false);
		}
	}, []);
	
	// Update local copy when state changes
	useAsync(async () => {
		try {
			await Storage.setItem(storageKey, JSON.stringify(state));
		} catch (e) {
			console.error(e);
		}
	}, [state])

	return [state, setState];
}