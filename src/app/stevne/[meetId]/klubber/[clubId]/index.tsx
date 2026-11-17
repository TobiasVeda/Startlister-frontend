import React, {useState} from "react";
import {router, Stack, useGlobalSearchParams, useLocalSearchParams, usePathname} from "expo-router";
import {Text, View, ScrollView} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ListItem} from "@/components/ListItem";
import {apiSwimmers} from "@/constants/backendEndpoints";
import {ActivityIndicator, Appbar} from "react-native-paper";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {constructSearchParams} from "@/utils/requestUtils";
import {ExpandableListItem} from "@/components/ExpandableListItem";
import SmallListItem from "@/components/SmallListItem";
import {useLazyFetch} from "@/hooks/useLazyFetch";
import {keySwimmers} from "@/constants/storageKeys";


export interface Club {
	clubName:string;
	hasStartlists:boolean;
	hasHeatlists:boolean;
	hasResults:boolean;
	hasFinals:boolean;
	swimmers:Swimmer[];
}
export interface Swimmer {
	name:string;
	clubId:number;
	hasStartlists:boolean;
	hasHeatlists:boolean;
	hasResults:boolean;
	hasFinals:boolean;
}

export default function Index() {
	const [isLoading, setIsLoading] = useState(true);
	const { meetId } = useGlobalSearchParams<{meetId:string}>();
	const { clubId } = useLocalSearchParams<{clubId:string}>();
	const [swimmers, setSwimmers] = useLazyFetch<Club>(
		`${keySwimmers}/${meetId}/${clubId}`,
		`${apiSwimmers}/${meetId}/${clubId}`,
		{
			clubName: "-",
			hasStartlists: false,
			hasHeatlists: false,
			hasResults: false,
			hasFinals: false,
			swimmers: []
		},
		setIsLoading
	);
	

	return (
		<>

			<Appbar.Header>
				<Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}/klubber`)} />
				<Appbar.Content title="Personer" />
				{isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
			</Appbar.Header>

			<ScrollView>

				<SectionHeader title={swimmers.clubName}/>
				{swimmers.hasStartlists && <ListItem title={`Startlister for ${swimmers.clubName}`} href={`/stevne/${meetId}/startlister/${constructSearchParams([{key: "clubId", value: clubId}])}`}/>}
				{swimmers.hasHeatlists && <ListItem title={`Heatlister for ${swimmers.clubName}`} href={`/stevne/${meetId}/heatlister/${constructSearchParams([{key: "clubId", value: clubId}])}`}/>}
				{swimmers.hasResults && <ListItem title={`Resultater for ${swimmers.clubName}`} href={`/stevne/${meetId}/resultater/${constructSearchParams([{key: "clubId", value: clubId}])}`}/>}
				{swimmers.hasFinals && <ListItem title={`Finalelister for ${swimmers.clubName}`} href={`/stevne/${meetId}/finalelister/${constructSearchParams([{key: "clubId", value: clubId}])}`}/>}

				<SectionHeader title={"Utøvere"}/>
				{swimmers.swimmers.map((x:Swimmer, i) => (
					<ExpandableListItem title={x.name}>
							<View style={{justifyContent: "space-between", flexDirection: "column"}}>
								{x.hasStartlists && <SmallListItem squareBottom title={`Startlister for ${x.name}`} href={`/stevne/${meetId}/startlister/${constructSearchParams([{key: "swimmerId", value: "1389"}])}`}/>}
								{x.hasHeatlists && <SmallListItem squareTop squareBottom title={`Heatlister for ${x.name}`} href={`/stevne/${meetId}/heatlister/${constructSearchParams([{key: "swimmerId", value: "1389"}])}`}/>}
								{x.hasResults && <SmallListItem squareTop squareBottom title={`Resultater for ${x.name}`} href={`/stevne/${meetId}/resultater/${constructSearchParams([{key: "swimmerId", value: "1389"}])}`}/>}
								{x.hasFinals && <SmallListItem squareTop title={`Finalelister for ${x.name}`} href={`/stevne/${meetId}/finalelister/${constructSearchParams([{key: "swimmerId", value: "1389"}])}`}/>}
							</View>
					</ExpandableListItem>
				))}
			
			</ScrollView>
		</>
	);
}