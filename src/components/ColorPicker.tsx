import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ReanimatedColorPicker, { HueCircular, Panel1 } from "reanimated-color-picker";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {Button, Card, IconButton, useTheme} from "react-native-paper";

export interface Props {
	initialColor?: string;
	onConfirm?: (arg1: string) => void;
	onDismiss?: () => void;
}

export default function ColorPicker(props: Props) {
	const { initialColor, onConfirm, onDismiss } = props;
	const [color, setColor] = useState<string>(initialColor ?? "#FFFFFF");
	const theme = useTheme();

	const getContrastText = (hex: string): string => {
		const h = hex.replace("#", "").slice(0, 6); // ignore alpha if present
		const [r, g, b] = [0, 2, 4].map((i) => {
			const c = parseInt(h.slice(i, i + 2), 16) / 255;
			return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
		});
		const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

		const contrastWithWhite = 1.05 / (luminance + 0.05);
		const contrastWithBlack = (luminance + 0.05) / 0.05;

		return contrastWithBlack > contrastWithWhite ? "#000000" : "#FFFFFF";
	};

	return (
		<Animated.View
			style={styles.overlay}
			entering={FadeIn.duration(200)}
			exiting={FadeOut.duration(200)}
		>
			<Pressable
				style={[styles.backdrop, { backgroundColor: theme.colors.background }]}
				onPress={onDismiss}
			/>

			<Card mode="elevated" style={styles.card}>

				<IconButton
					style={styles.topRight}
					size={30}
					icon={"close"}
					onPress={onDismiss}
				/>
				
				<Card.Content style={styles.content}>
					<ReanimatedColorPicker
						style={styles.picker}
						value={initialColor ?? "#FFFFFF"}
						sliderThickness={25}
						thumbShape="circle"
						thumbSize={25}
						onChangeJS={(value) => setColor(value.hex)}
					>
						<HueCircular containerStyle={styles.hueContainer} thumbColor={initialColor}>
							<Panel1 style={styles.panel} thumbColor={initialColor} boundedThumb />
						</HueCircular>
					</ReanimatedColorPicker>

					<View style={styles.buttonRow}>
						<Button
							mode="contained"
							buttonColor={color}
							textColor={getContrastText(color)}
							onPress={() => onConfirm?.(color)}
						>
							Bekreft
						</Button>
					</View>
				</Card.Content>
			</Card>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
	},
	backdrop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.95,
	},
	topRight: {
		position: "absolute",
		top: 0,
		right: 0,
		zIndex: 1,
	},
	hueContainer: {
		justifyContent: "center",
	},
	panel: {
		width: "65%",
		aspectRatio: 1,
		alignSelf: "center",
		borderRadius: 8,
	},
	card: {
		width: "100%",
		maxWidth: 360,
	},
	content: {
		gap: 16,
		paddingVertical: 16,
	},
	picker: {
		width: "100%",
		gap: 16,
	},
	buttonRow: {
		width: "100%",
	},
});