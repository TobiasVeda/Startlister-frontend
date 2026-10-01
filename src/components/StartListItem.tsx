import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import {InfoTooltip} from "@/components/InfoTooltip";

type StartListItemProps = {
	number: number;
	name: string;
	club: string;
	class: string;
	time: string;
	HC?: string;
	text: string;
	first?: boolean;
	last?: boolean;
	p?: boolean;
};

type Medal = { colors: readonly [string, string]; text: string };

const RADIUS = 12; // MD3 card default (3 * roundness)

const GOLD: Medal = { colors: ['#FFE98A', '#D9A520'], text: '#3D2B00' };
const SILVER: Medal = { colors: ['#F2F2F2', '#A9AEB3'], text: '#2B2F33' };
const BRONZE: Medal = { colors: ['#E9AE77', '#A2622C'], text: '#FFFFFF' };
const GRAY: Medal = { colors: ['#B9BCBF', '#80858A'], text: '#FFFFFF' };

function getMedal(n: number): Medal {
	if (n === 1) return GOLD;
	if (n === 2) return SILVER;
	if (n === 3) return BRONZE;
	return GRAY;
}

export function StartListItem({
								  number,
								  name,
								  club,
								  class: swimClass, // "class" is a reserved word, so it's renamed when destructuring
								  time,
								  HC,
								  text,
								  first = true,
								  last = true,
								  p,
							  }: StartListItemProps) {
	const theme = useTheme();
	const medal = p ? getMedal(number) : undefined;

	const numberText = (
		<Text
			variant="titleSmall"
			style={{ color: medal ? medal.text : theme.colors.onPrimary, fontWeight: 'bold' }}
		>
			{number}
		</Text>
	);

	return (
		<Card
			mode="elevated"
			style={[
				styles.card,
				{
					borderTopLeftRadius: first ? RADIUS : 0,
					borderTopRightRadius: first ? RADIUS : 0,
					borderBottomLeftRadius: last ? RADIUS : 0,
					borderBottomRightRadius: last ? RADIUS : 0,
					marginTop: first ? 2 : 0,
					marginBottom: last ? 2 : 0,
				},
			]}
			accessibilityLabel={`${number}. ${name}, ${club}, ${swimClass}${HC ? ` ${HC}` : ''}, ${time}`}
		>
			<View style={styles.row}>
				{/* number / place badge */}
				{medal ? (
					<LinearGradient
						colors={medal.colors}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.badge}
					>
						{numberText}
					</LinearGradient>
				) : (
					<View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
						{numberText}
					</View>
				)}

				{/* main content */}
				<View style={styles.content}>
					<Text variant="titleMedium">{name}</Text>
					<Text variant="bodySmall">{club}</Text>

					<View style={styles.classRow}>
						<Text variant="bodySmall">{swimClass}</Text>
						{HC ? (
							<View style={[styles.hcOutline, { borderColor: theme.colors.primary }]}>
								<Text variant="bodySmall" style={{ color: theme.colors.primary }}>
									{HC}
								</Text>
							</View>
						) : null}
					</View>

					<InfoTooltip text={text}/>
				</View>

				{/* time */}
				<Text variant="titleMedium" style={styles.time}>
					{time}
				</Text>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 2,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	badge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		flex: 1,
		gap: 2,
	},
	classRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	hcOutline: {
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 4,
	},
	time: {
		flexShrink: 0,
		fontVariant: ['tabular-nums'], // digits line up between rows
	},
});