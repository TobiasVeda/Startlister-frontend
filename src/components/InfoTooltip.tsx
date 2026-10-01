import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
	IconButton,
	Portal,
	Surface,
	Text,
	useTheme,
} from "react-native-paper";

type InfoTooltipProps = {
	text: string;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
	const theme = useTheme();
	const anchorRef = useRef<View>(null);

	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({
		x: 0,
		y: 0,
	});

	const showTooltip = () => {
		anchorRef.current?.measureInWindow((x, y, width, height) => {
			setPosition({
				x,
				y: y + height,
			});

			setVisible(true);
		});
	};

	return (
		<>
			<View ref={anchorRef} collapsable={false}>
				<IconButton
					icon="information-outline"
					size={20}
					onPress={showTooltip}
					accessibilityLabel="More information"
				/>
			</View>

			{visible && (
				<Portal>
					<Pressable
						style={StyleSheet.absoluteFill}
						onPress={() => setVisible(false)}
					>
						<Surface
							elevation={3}
							style={[
								styles.tooltip,
								{
									top: position.y + 4,
									left: position.x,
									backgroundColor: theme.colors.elevation.level3,
								},
							]}
						>
							<Text>{text}</Text>
						</Surface>
					</Pressable>
				</Portal>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	tooltip: {
		position: "absolute",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 4,
		maxWidth: 300,
	},
});