import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";
import Animated, {
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming,
	interpolate
} from "react-native-reanimated";
import { RADIUS } from "@/components/StartListItem";

export interface ExpandableListItemProps {
	title: string;
	rightText?: string;
	defaultExpanded?: boolean;
	children?: React.ReactNode;
}

export function ExpandableListItem({
									   title,
									   rightText,
									   defaultExpanded = false,
									   children,
								   }: ExpandableListItemProps) {
	const theme = useTheme();
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

	// 0 = collapsed, 1 = expanded
	const progress = useDerivedValue(
		() => withTiming(expanded ? 1 : 0, { duration: 150 }),
		[expanded]
	);
	const contentHeight = useSharedValue(0);

	const chevronStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${progress.value * 90}deg` }],
	}));

	const clipStyle = useAnimatedStyle(() => {
		const extra = Math.max(contentHeight.value - RADIUS, 0);
		return {
			// top edge is fixed behind the card; only the bottom edge moves down
			height: RADIUS + extra * progress.value,
			// hides the strip behind the card's rounded corners while collapsed
			opacity: interpolate(progress.value, [0, 0.05], [0, 1], "clamp"),
		};
	});

	return (
		<View style={styles.wrapper}>
			<Card
				mode="elevated"
				style={styles.card}
				onPress={() => setExpanded((e) => !e)}
				accessibilityRole="button"
				accessibilityState={{ expanded }}
				accessibilityLabel={`${title}${rightText ? `, ${rightText}` : ""}`}
			>
				<View style={styles.row}>
					<View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
						<Animated.View style={chevronStyle}>
							<Icon source="chevron-right" size={22} color={theme.colors.onPrimary} />
						</Animated.View>
					</View>

					<Text variant="titleMedium" style={styles.title} numberOfLines={2}>
						{title}
					</Text>

					{rightText ? (
						<Text variant="titleMedium" style={styles.time}>
							{rightText}
						</Text>
					) : null}
				</View>
			</Card>

			<Animated.View
				style={[styles.clip, { backgroundColor: theme.colors.primary }, clipStyle]}
				pointerEvents={expanded ? "auto" : "none"}
				accessibilityElementsHidden={!expanded}
				importantForAccessibility={expanded ? "auto" : "no-hide-descendants"}
			>
				{/* absolute, so it keeps its natural height while the clip is shorter */}
				<View
					style={styles.dropdown}
					onLayout={(e) => {
						contentHeight.value = e.nativeEvent.layout.height;
					}}
				>
					{children}
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		marginHorizontal: 2,
		marginVertical: 2,
	},
	card: {
		borderRadius: RADIUS,
		zIndex: 1,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	badge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		flex: 1,
	},
	time: {
		flexShrink: 0,
		fontVariant: ["tabular-nums"],
	},
	clip: {
		marginTop: -RADIUS, // constant now, not animated
		overflow: "hidden",
		borderBottomLeftRadius: RADIUS,
		borderBottomRightRadius: RADIUS,
	},
	dropdown: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		paddingTop: RADIUS + 8,
		paddingBottom: 10,
		paddingHorizontal: 14,
		gap: 4,
	},
});