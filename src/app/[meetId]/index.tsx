import {useEffect, useState} from "react";
import {ScrollView} from "@expo/ui";
import {ListItem} from "@/components/ListItem";
import {Stack, useLocalSearchParams, usePathname} from "expo-router";
import {ActivityIndicator} from "react-native-paper";
import * as date from "@/utils/date"
import {useAsync} from "@/hooks/useAsync";
import { apiMeetDetails } from "@/constants/backendEndpoints";
import {MeetDetails} from "@/components/MeetDetails";
import {DocumentListItem} from "@/components/DocumentListItem";
import {SectionHeader} from "@/components/SectionHeader";
import { router } from "expo-router";
import { Icon } from 'react-native-paper';
import {View} from "react-native";

export interface MeetDetails {
	data:Data;
	lists:Lists;
	documents:Document[];
}
export interface Data {
	location:string;
	hostClub:string;
	meetName:string;
	from:string;
	to:string;
	numberOfLanes:string;
	poolLength:string;
	poolName:string;
	meetType:string;
	registerDeadline:string;
}
export interface Lists {
	hasStartlist:boolean;
	hasHeatlist:boolean;
	hasResults:boolean;
	hasFinals:boolean;
	hasSchedule:boolean;
	hasClubsSwimmers:boolean;
	hasLivetiming:boolean;
}
export interface Document {
	name:string;
	url:string;
}

export default function Index() {
	const [details, setDetails] = useState<MeetDetails>();
	const [isLoading, setIsLoading] = useState(true);
	const { meetId } = useLocalSearchParams<{meetId:string}>();
	const path = usePathname();

	useAsync(async () => {
		const response = await fetch(`${apiMeetDetails}/${meetId}`);
		const data:MeetDetails = await response.json();
		setDetails(data);
		setIsLoading(false);
	}, [])

	return (

		<>
			<Stack.Screen options={{
				title: "Stevneoversikt",
				headerRight: () =>
					isLoading ? <View style={{ paddingRight: 16 }}><ActivityIndicator size={25} /></View> : null }}
			/>
			<ScrollView>

				<MeetDetails data={details?.data}/>

				<SectionHeader title={"Søkbare Lister"}/>
				{details?.lists?.hasStartlist && <ListItem title={"Startlister"} href={`${path}/startlister`}/>}
				{details?.lists?.hasHeatlist && <ListItem title={"Heatlister"} href={`${path}/heatlister`}/>}
				{details?.lists?.hasResults && <ListItem title={"Resultater"} href={`${path}/resultater`}/>}
				{details?.lists?.hasFinals && <ListItem title={"Finalelister"} href={`${path}/finalelister`}/>}
				{details?.lists?.hasSchedule && <ListItem title={"Tidsskjema"} href={`${path}/tidsskjema`}/>}
				{details?.lists?.hasClubsSwimmers && <ListItem subtitle={"(TODO:Personer)"} title={"Klubber & Personer"} href={`${path}/klubber`}/>}
				{details?.lists?.hasLivetiming && <ListItem subtitle={"(TODO)"} title={"Livetiming"} href={"/"}/>}

				<SectionHeader title={"Eksterne Dokumenter og Koblinger"}/>
				{details?.documents?.map((x, i:number)=>(
					<DocumentListItem key={"doc"+i} title={x.name} href={x.url}/>
				))}
			</ScrollView>
		</>
		
	);
}