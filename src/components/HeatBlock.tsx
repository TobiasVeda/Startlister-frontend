import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { RADIUS, StartListItem } from "@/components/StartListItem";

export interface Props {
	heat:Heat;
}

export interface Heat {
	heatNumber:number,
	startTime:string,
	starts:Start[]
}
export interface Start {
	lane:number,
	name:string,
	swimmerId:number,
	club:string,
	clubId:number,
	born:number,
	class:string,
	regTime:string,
	HC:string,
	percent:string,
	text:string
}

export default function HeatBlock(props:Props) {
	const { heat } = props;
	const theme = useTheme();

	return (
		<>
			<View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
				<Text variant="titleSmall" style={{ color: theme.colors.onPrimary }}>
					{`Heat: ${heat.heatNumber}`}
				</Text>
				<Text variant="titleSmall" style={{color: theme.colors.onPrimary }}>
					{`Heat start: ${heat.startTime}`}
				</Text>
			</View>

			{heat.starts.map((x: Start, k: number) => (
				<StartListItem
					key={k}
					number={x.lane}
					name={x.name}
					club={x.club}
					class={x.class}
					time={x.regTime}
					text={x.text}
					HC={x.HC !== "" ? `${x.HC} ${parseInt(x.percent)}%` : ""}
					squareTop={k !== 0}
					squareBottom={k !== heat.starts.length - 1}
				/>
			))}
		</>
	);
}

const styles = StyleSheet.create({
	header: {
		marginHorizontal: 2, // same as StartListItem's card
		borderTopLeftRadius: RADIUS,
		borderTopRightRadius: RADIUS,
		paddingTop: 6,
		paddingHorizontal: 12,
		paddingBottom: RADIUS, // extra height that gets hidden behind the first item
		marginBottom: -(RADIUS), // pulls the first item up over it (+2 offsets the card's own marginTop)
		marginTop: 3,
		flexDirection: "row",
		justifyContent: "space-between",
	},
});