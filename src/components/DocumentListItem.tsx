import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Avatar, Card, Icon, Text, useTheme } from "react-native-paper";

type DocumentListItemProps = {
	title: string;
	subtitle?: string;
	/** External URL to open */
	href: string;
};

const XML_EXTENSIONS = [".lef", ".xml"];

function isXmlUrl(url: string): boolean {
	// Ignore query string and hash, e.g. "file.xml?token=abc"
	const path = url.split(/[?#]/)[0].toLowerCase();
	return XML_EXTENSIONS.some((ext) => path.endsWith(ext));
}

export function DocumentListItem({ title, subtitle, href }: DocumentListItemProps) {
	const theme = useTheme();
	const icon = isXmlUrl(href) ? "xml" : "file-document-outline";

	return (
		<Card
			mode="elevated"
			onPress={() => Linking.openURL(href)}
			style={styles.card}
			accessibilityRole="link"
			accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
		>
			<View style={styles.row}>
				<Avatar.Icon
					size={36}
					icon={icon}
					style={{ backgroundColor: theme.colors.primary }}
				/>

				<View style={styles.content}>
					<Text variant="titleMedium">{title}</Text>
					{subtitle ? <Text variant="bodySmall">{subtitle}</Text> : null}
				</View>

				<Icon source="open-in-new" size={24} color={theme.colors.primary} />
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		margin: 2,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	content: {
		flex: 1,
		gap: 2,
	},
});