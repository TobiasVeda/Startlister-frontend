import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple, useTheme } from "react-native-paper";
import Animated, {
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated";

const RADIUS = 12;

export interface CollapsibleSecondaryProps {
	title: string;
	rightText?: string;
	defaultExpanded?: boolean;
	children?: React.ReactNode;
}

export default function CollapsibleSecondary({
										 title,
										 rightText,
										 defaultExpanded = false,
										 children,
									 }: CollapsibleSecondaryProps) {
	const theme = useTheme();
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

	const rotation = useDerivedValue(
		() => withTiming(expanded ? 90 : 0, { duration: 200 }),
		[expanded]
	);
	const chevronStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	return (
		<View>
			<TouchableRipple
				onPress={() => setExpanded((e) => !e)}
				accessibilityRole="button"
				accessibilityState={{ expanded }}
				style={[styles.header, { backgroundColor: theme.colors.tertiary }]}
			>
				<View style={styles.row}>
					<Animated.View style={chevronStyle}>
						<Icon source="chevron-right" size={20} color={theme.colors.onTertiary} />
					</Animated.View>

					<Text
						variant="titleSmall"
						style={[styles.title, { color: theme.colors.onTertiary }]}
						numberOfLines={1}
					>
						{title}
					</Text>

					{rightText ? (
						<Text variant="titleSmall" style={{ color: theme.colors.onTertiary }}>
							{rightText}
						</Text>
					) : null}
				</View>
			</TouchableRipple>

			{expanded && (
				<Animated.View
					entering={FadeIn.duration(150)}
					exiting={FadeOut.duration(100)}
					style={[styles.content, { borderLeftColor: theme.colors.tertiary }]}
				>
					{children}
				</Animated.View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginLeft: 16, // indented, so it reads as nested inside a parent Collapsible
		marginRight: 2,
		marginVertical: 3,
		borderRadius: RADIUS,
		paddingVertical: 6,
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
	content: {
		marginLeft: 22, // sits under the chevron of the header
		borderLeftWidth: 3, // vertical guide line connecting the children to the header
		borderBottomLeftRadius: 2,
		paddingLeft: 2,
	},
});