import {Card, Avatar, Text, useTheme} from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Meet } from "@/app";

export interface Prop {
	data: Meet;
}

export function MeetListItem(prop: Prop) {
	const { meetName, location, dateTo, dateFrom, meetId } = prop.data;
	const dateLabel = dateTo ? dateFrom + " - " + dateTo : dateFrom;
	const router = useRouter();
	const theme = useTheme();

	return (
		<Card
			mode={"elevated"}
			onPress={() => router.push("/"+meetId)}
			style={{marginTop: 3, marginHorizontal: 3}}
		>
			<Card.Content style={styles.content}>
				<View style={styles.left}>

					{/*main icon*/}
					<View style={styles.mainIcon}>
						<Avatar.Icon size={40} icon="swim" style={{margin: -5}}/>
					</View>

					{/*data*/}
					<View style={styles.data}>
						<View>
							<Text variant="titleMedium" numberOfLines={1}>{meetName}</Text>
						</View>
						<View style={styles.row}>
							<Avatar.Icon size={24} icon="calendar-month-outline" color={theme.colors.primary} style={[styles.rowIcon, { backgroundColor: "transparent" }]}/>
							<Text variant="labelMedium" numberOfLines={1}>{dateLabel}</Text>
						</View>
						<View style={styles.row}>
							<Avatar.Icon size={24} icon="map-marker-outline" color={theme.colors.primary} style={[styles.rowIcon, { backgroundColor: "transparent" }]}/>
							<Text variant="labelMedium" numberOfLines={1}>{location}</Text>
						</View>
					</View>

				</View>

				{/*chevron*/}
				<View style={styles.rightItems}>
					<Avatar.Icon size={90} color={theme.colors.primary} style={{margin: -30, backgroundColor: "transparent"}} icon="chevron-right"/>
				</View>
			</Card.Content>
		</Card>
	);
}
const styles = StyleSheet.create({
	content: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 8,     // Paper default is 16
		paddingBottom: 8,  // Paper default is 16
	},
	left: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		// marginTop: -15,
		// marginBottom: -15
	},
	mainIcon: {
		marginRight: 12
	},
	data: {
		flex: 1,
		gap: 4, // RN 0.71+; otherwise add marginTop to the row Views
		marginLeft: 5
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 0,
		marginVertical: -5
	},
	rowIcon: {
		marginLeft: -5
	},
	rightItems: {
		marginLeft: 8,
	},
});