import {Dispatch, SetStateAction} from "react";
import {Platform} from "react-native";
import {useSessionStorage} from "@/hooks/useSessionStorage";
import {useSyncStorage} from "@/hooks/useSyncStorage";

// Technically only useSyncStorage is required as it has web support, 
// but will report "Error: Sync operation timeout" on web. Use already existing useSessionStorage as workaround
// Likely issue: https://github.com/expo/expo/issues/36392
export function useStorage<T>(key: string, initialValue?: T): [T, Dispatch<SetStateAction<T>>] {
	if (Platform.OS === "web") {
		return useSessionStorage(key, initialValue);
	} else {
		return useSyncStorage(key, initialValue);
	}
}