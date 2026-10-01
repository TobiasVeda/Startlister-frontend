import React from "react";
import { StyleSheet, View } from "react-native";
import {Avatar, Card, Text, useTheme} from "react-native-paper";
import { useRouter } from "expo-router";
import {Data} from "@/app/[meetId]";

export interface Props {
	data?:Data;
}

export function MeetDetails(props:Props) {
	const { location, hostClub, meetName, from, to, numberOfLanes, poolLength, poolName, meetType, registerDeadline } = props.data ?? {};
	const theme = useTheme();

	const blank:string = "-";

	return (
		<Card mode={"elevated"} style={{margin: 2}}>

			<Card.Title
				title={meetName}
				left={() => <Avatar.Icon size={40} icon="swim" style={{backgroundColor: theme.colors.primary, marginTop: -7}}/>}
			/>
			<View
				style={{
					borderTopColor: theme.colors.primary,
					borderTopWidth: StyleSheet.hairlineWidth,
					marginTop: -9,
					marginBottom: 9
				}}
			/>
			<Card.Content style={{marginBottom: -10}}>
				<View>

					{(from === to) &&
                        <View style={table.row}>
                            <Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Dato</Text>
                            <Text variant="labelMedium">{from ?? blank}</Text>
                        </View>}
					{(from !== to) && <>
                        <View style={table.row}>
                            <Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Til dato</Text>
                            <Text variant="labelMedium" style={table.value}>{to ?? blank}</Text>
                        </View>
                        <View style={table.row}>
                            <Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Fra dato</Text>
                            <Text variant="labelMedium" style={table.value}>{from ?? blank}</Text>
                        </View>
                    </>}
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Arrangør</Text>
						<Text variant="labelMedium" style={table.value}>{hostClub ?? blank}</Text>
					</View>
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Sted</Text>
						<Text variant="labelMedium" style={table.value}>{location ?? blank}</Text>
					</View>
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Bassengnavn</Text>
						<Text variant="labelMedium" style={table.value}>{poolName ?? blank}</Text>
					</View>
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Antall baner</Text>
						<Text variant="labelMedium" style={table.value}>{numberOfLanes ?? blank}</Text>
					</View>
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Bassenglengde</Text>
						<Text variant="labelMedium" style={table.value}>{poolLength ?? blank}</Text>
					</View>
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Stevnetype</Text>
						<Text variant="labelMedium" style={table.value}>{meetType ?? blank}</Text>
					</View>
					<View style={table.row}>
						<Text variant="labelMedium" style={[{color: theme.colors.primary, fontWeight: "bold"}, table.label]}>Påmeldingsfrist</Text>
						<Text variant="labelMedium" style={table.value}>{registerDeadline ?? blank}</Text>
					</View>

				</View>

			</Card.Content>
		</Card>
	);
}

const table = StyleSheet.create({
	row: {
		flexDirection: "row",
	},
	label: {
		width: 120, // "Påmeldingsfrist" at labelMedium bold is roughly 90px
	},
	value: {
		flex: 1, // value takes the remaining width and wraps inside it instead of overflowing
	},
});