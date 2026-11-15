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

export interface CollapsibleProps {
	title: string;
	rightText?: string;
	defaultExpanded?: boolean;
	children?: React.ReactNode;
}

export function Collapsible({ title, rightText, defaultExpanded = false, children }: CollapsibleProps) {
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
				style={[styles.header, { backgroundColor: theme.colors.secondary }]}
			>
				<View style={styles.row}>
					<Animated.View style={chevronStyle}>
						<Icon source="chevron-right" size={22} color={theme.colors.onSecondary} />
					</Animated.View>

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
			</TouchableRipple>

			{expanded && (
				<Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
					{children}
				</Animated.View>
			)}
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