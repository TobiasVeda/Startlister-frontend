import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";
import { useRouter, type Href } from "expo-router";
import { RADIUS } from "@/components/StartListItem";

type ListItemProps = {
	title: string;
	/** In-app route, e.g. "/meets/123/startlister" */
	href: Href;
	/** Any Material Community icon name */
	icon?: string;
	/** Square the top corners and remove the top margin, to join with the item above */
	squareTop?: boolean;
	/** Square the bottom corners and remove the bottom margin, to join with the item below */
	squareBottom?: boolean;
};

export default function SmallListItem({
							 title,
							 href,
							 squareTop = false,
							 squareBottom = false,
						 }: ListItemProps) {
	const router = useRouter();
	const theme = useTheme();

	return (
		<Card
			mode="elevated"
			onPress={() => router.push(href)}
			style={[
				styles.card,
				{
					backgroundColor: theme.colors.surfaceVariant,
					borderTopLeftRadius: squareTop ? 0 : RADIUS,
					borderTopRightRadius: squareTop ? 0 : RADIUS,
					borderBottomLeftRadius: squareBottom ? 0 : RADIUS,
					borderBottomRightRadius: squareBottom ? 0 : RADIUS,
					marginTop: squareTop ? 0 : 3,
					marginBottom: squareBottom ? 0 : undefined,
				},
			]}
			accessibilityRole="link"
		>
			<View style={styles.row}>

				<View style={styles.content}>
					<Text variant="titleSmall" numberOfLines={1}>{title}</Text>
				</View>

				<Avatar.Icon size={70} icon="chevron-right" color={theme.colors.primary} style={{backgroundColor: "transparent", margin: -20}}/>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 3,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	content: {
		flex: 1,
		gap: 2,
	},
});