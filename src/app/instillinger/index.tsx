import {Appbar, Button, IconButton, Portal, useTheme} from "react-native-paper";
import React, {useState} from "react";
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme, View, Text } from 'react-native';
import {useThemeProvider} from "@/contexts/ThemeProvider";
import ColorPicker from "@/components/ColorPicker";

export default function Index() {
	const { isDarkTheme, isSystemDarkTheme, currentColor, useAutoColor, hasMD3Support, useSystemDarkTheme, useDarkTheme, useLightTheme, useSystemColor, useManualColor } = useThemeProvider();
	const [viewPicker, setViewPicker] = useState<boolean>(false);
	const theme = useTheme();
	
	const setFromColorPicker = (color:string) => {
		"worklet";
		useManualColor(color);
		setViewPicker(false);
	}
	
	const closeColorPicker = () => {
		setViewPicker(false);
	};
	
	return (
		<>
			<Appbar.Header>
				<Appbar.Content title="Instillinger" />
			</Appbar.Header>

			{viewPicker && (
				<Portal>
					<ColorPicker initialColor={currentColor} onConfirm={setFromColorPicker} onDismiss={closeColorPicker} />
				</Portal>
			)}
			
			<View>
				<Text>Mørkt tema </Text>
				<Button 
					mode={isSystemDarkTheme ? "contained" : "elevated"} 
					onPress={() => useSystemDarkTheme()}
				>
					Bryk systeminstillinger
				</Button>
				<Button
					mode={isDarkTheme ? "contained" : "elevated"}
					onPress={() => useDarkTheme()}
				>
					Bruk mørk modus
				</Button>
				<Button
					mode={!isDarkTheme && !isSystemDarkTheme ? "contained" : "elevated"}
					onPress={() => useLightTheme()}
				>
					Bruk lys modus
				</Button>
			</View>

			{(!hasMD3Support || !useAutoColor) && <View>

                <IconButton
					icon={"circle-half-full"}
                    // mode={"default"}
					iconColor={"#696969"}
					size={49}
                    style={{backgroundColor: "transparent", margin: -6, transform: [{rotate: "-135deg"}] }}
                    onPress={() => useSystemColor()}
                />
                <IconButton
                    icon={() => null}
                    mode={"contained"}
                    style={{backgroundColor: "#00336a"}}
                    onPress={() => useManualColor("#00336a")}
                />
                <IconButton
                    icon={() => null}
                    mode={"contained"}
                    style={{backgroundColor: "#00FF00"}}
                    onPress={() => useManualColor("#00FF00")}
                />
                <IconButton
					icon={() => null}
                    mode={"contained"}
                    style={{backgroundColor: "#FF0000"}}
                    onPress={() => useManualColor("#FF0000")}
                />
                <IconButton
                    icon={() => null}
                    mode={"contained"}
                    style={{backgroundColor: "#6750A4"}}
                    onPress={() => useManualColor("#6750A4")}
                />
                <IconButton
					icon={() => null}
                    mode={"contained"}
                    style={{backgroundColor: "#ff3399"}}
                    onPress={() => useManualColor("#ff3399")}
                />
                <IconButton
                    icon={() => null}
                    mode={"contained"}
                    style={{backgroundColor: "#FFFFFF"}}
                    onPress={() => useManualColor("#FFFFFF")}
                />
                <IconButton
					icon={"palette"}
                    mode={"contained"}
                    style={{backgroundColor: "#FFFFFF"}}
                    onPress={() => setViewPicker(true)}
                />
				

			</View>}
			
		</>
	);
}