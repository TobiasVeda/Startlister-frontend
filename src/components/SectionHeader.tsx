import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type SectionHeaderProps = {
	title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
	const theme = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}
			accessibilityRole="header"
		>
			<Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant }}>
				{title}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "stretch",
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
});