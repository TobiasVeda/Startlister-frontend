import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useColorScheme} from "react-native";
import { isDynamicThemeSupported, useMaterial3Theme } from "@pchmn/expo-material3-theme";
import {MD3DarkTheme, MD3LightTheme, PaperProvider,} from "react-native-paper";
import {useStorage} from "@/hooks/useStorage";
import {keyManualColor, keyManualDarkTheme, keyUseAutoColor, keyUseAutoDarkTheme} from "@/constants/storageKeys"

const ThemeContext = createContext<any>(null);
export const useThemeProvider = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }:any) => {
	const defaultColor = "#00336a";
	
	// Light/dark toggle
	const [isDarkTheme, setIsDarkTheme] = useStorage<boolean>(keyManualDarkTheme,false);
	const [isSystemDarkTheme, setIsSystemDarkTheme] = useStorage<boolean>(keyUseAutoDarkTheme, true);
	const colorScheme = useColorScheme();
		
	// Color of the theme + toggle
	const [currentColor, setCurrentColor] = useStorage<string>(keyManualColor, defaultColor);
	const [useAutoColor, setUseAutoColor] = useStorage<boolean>(keyUseAutoColor, true);
	const { theme, updateTheme, resetTheme } = useMaterial3Theme({fallbackSourceColor: currentColor});
	const hasMD3Support:boolean = isDynamicThemeSupported; // Used to hide "Enable MD3" toggle

	
	// useEffect(() => {
	// 	if (useAutoColor) {
	// 		resetTheme();
	// 		if (!hasMD3Support) {
	// 			updateTheme(defaultColor);
	// 		}
	// 	} else {
	// 		updateTheme(currentColor);
	// 	}
	// }, [currentColor, useAutoColor]);

	const paperTheme = useMemo(() => {
		const isDark = colorScheme === "dark" && isSystemDarkTheme || isDarkTheme && !isSystemDarkTheme;

		return isDark ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }
	}, [theme, isDarkTheme, isSystemDarkTheme]);
	
	
	const useSystemDarkTheme = () => {
		setIsSystemDarkTheme(true);
		setIsDarkTheme(colorScheme === "dark");
	};
	const useDarkTheme = () => {
		setIsSystemDarkTheme(false);
		setIsDarkTheme(true);
	};
	const useLightTheme = () => {
		setIsSystemDarkTheme(false);
		setIsDarkTheme(false);
	};
	const useSystemColor = () => {
		if (hasMD3Support) {
			resetTheme();
		} else {
			updateTheme(defaultColor);
			setCurrentColor(defaultColor);
		}
	};
	const useManualColor = (color:string) => {
		setCurrentColor(color);
		updateTheme(color);
	};
	
	
	return (
		<ThemeContext.Provider
			value={{ isDarkTheme, isSystemDarkTheme, currentColor, useAutoColor, hasMD3Support, useSystemDarkTheme, useDarkTheme, useLightTheme, useSystemColor, useManualColor }}
		>
			<PaperProvider theme={paperTheme}> 
				{children}
			</PaperProvider>
		</ThemeContext.Provider>
	);
};