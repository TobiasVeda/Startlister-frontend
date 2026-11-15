import {StyleSheet, Text, View} from "react-native";
import {Card, Portal, Switch, useTheme} from "react-native-paper";
import React from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export interface Props {
	text:string;
	value: boolean;
	onValueChange: (value: boolean) => void;
}

export default function FloatingToggle(props:Props) {
	const { text, value, onValueChange } = props;
	const insets = useSafeAreaInsets();
	const theme = useTheme();
	
	return (
		<Portal>
			<Card
				mode="elevated"
				style={[styles.card, { top: insets.top + 72 }]}
			>
				<View style={styles.row}>
					<Text style={{color: theme.colors.onBackground}}>{text}</Text>
					<Switch value={value} onValueChange={onValueChange} />
				</View>
			</Card>
		</Portal>
	);
}

const styles = StyleSheet.create({
	card: {
		position: "absolute",
		right: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginVertical: 4,
		paddingLeft: 16,
		paddingRight: 12,
	},
});