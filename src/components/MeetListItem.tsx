import {Card, Icon, Avatar, Text} from "react-native-paper";
import {View, StyleSheet} from "react-native";
import {Meet} from "@/app";

export interface Prop {
	data:Meet;
}

export function MeetListItem(prop:Prop) {
	const { meetName, location, dateTo, dateFrom } = prop.data
	const dateLabel = dateTo ? dateFrom + " - " + dateTo : dateFrom;
	
	return (
		<Card mode={"elevated"}>
			<Card.Content style={styles.content}>
				<View style={styles.left}>

					{/*main icon*/}
					<View style={styles.mainIcon}>
						<Avatar.Icon size={30} icon="swim"/>
					</View>

					{/*data*/}
					<View style={styles.data}>
						<View>
							<Text variant="titleMedium">{meetName}</Text>
						</View>
						<View style={styles.row}>
							<Avatar.Icon size={24} icon="calendar-month-outline" style={styles.rowIcon}/>
							<Text variant="labelMedium">{dateLabel}</Text>
						</View>
						<View style={styles.row}>
							<Avatar.Icon size={24} icon="map-marker-outline" style={styles.rowIcon}/>
							<Text variant="labelMedium">{location}</Text>
						</View>
					</View>

				</View>

				{/*chevron*/}
				<View style={styles.rightItems}>
					<Avatar.Icon size={24} icon="chevron-right"/>
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
		margin: -3
	},
	rowIcon: {
		marginLeft: -5
	},
	rightItems: {
		marginLeft: 8,
	},
});
