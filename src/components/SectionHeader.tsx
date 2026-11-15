import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const RADIUS = 12;

export interface SectionHeaderProps {
	title: string;
	rightText?: string;
}

export function SectionHeader({ title, rightText }: SectionHeaderProps) {
	const theme = useTheme();

	return (
		<View style={[styles.header, { backgroundColor: theme.colors.secondary }]}>
			<View style={styles.row}>
				<Text
					variant="titleSmall"
					style={[styles.title, { color: theme.colors.onSecondary }]}
					numberOfLines={1}
				>
					{title}
				</Text>

				{rightText ? (
					<Text variant="titleSmall" style={{ color: theme.colors.onSecondary }}>
						{rightText}
					</Text>
				) : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginHorizontal: 2, // same width as StartListItem's card
		marginVertical: 3,
		borderRadius: RADIUS,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	title: {
		flex: 1, // pushes rightText to the far right
	},
});