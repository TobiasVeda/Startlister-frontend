import React, {useMemo, useState} from "react";
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
	clubId:number;
	hasStartlists:boolean;
	hasHeatlists:boolean;
	hasResults:boolean;
	hasFinals:boolean;
	swimmers:Swimmer[];
}
export interface Swimmer {
	name:string;
	swimmerId:number;
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
			clubId: 0,
			hasStartlists: false,
			hasHeatlists: false,
			hasResults: false,
			hasFinals: false,
			swimmers: []
		},
		setIsLoading
	);
	
	const isSquared = useMemo(() => {
		return [
			{
				top: false, 
				bottom: swimmers.hasHeatlists || swimmers.hasResults || swimmers.hasFinals
			},
			{
				top: swimmers.hasStartlists,
				bottom: swimmers.hasResults || swimmers.hasFinals
			},
			{
				top: swimmers.hasStartlists || swimmers.hasHeatlists,
				bottom: swimmers.hasFinals
			},
			{
				top: swimmers.hasStartlists || swimmers.hasHeatlists || swimmers.hasResults,
				bottom: false
			},
		];
	}, [swimmers]);

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
								{x.hasStartlists && <SmallListItem squareTop={isSquared[0].top} squareBottom={isSquared[0].bottom} title={`Startlister for ${x.name}`} href={`/stevne/${meetId}/startlister/${constructSearchParams([{key: "swimmerId", value: `${x.swimmerId}`}])}`}/>}
								{x.hasHeatlists && <SmallListItem squareTop={isSquared[1].top} squareBottom={isSquared[1].bottom} title={`Heatlister for ${x.name}`} href={`/stevne/${meetId}/heatlister/${constructSearchParams([{key: "swimmerId", value: `${x.swimmerId}`}])}`}/>}
								{x.hasResults && <SmallListItem squareTop={isSquared[2].top} squareBottom={isSquared[2].bottom} title={`Resultater for ${x.name}`} href={`/stevne/${meetId}/resultater/${constructSearchParams([{key: "swimmerId", value: `${x.swimmerId}`}])}`}/>}
								{x.hasFinals && <SmallListItem squareTop={isSquared[3].top} squareBottom={isSquared[3].bottom} title={`Finalelister for ${x.name}`} href={`/stevne/${meetId}/finalelister/${constructSearchParams([{key: "swimmerId", value: `${x.swimmerId}`}])}`}/>}
							</View>
					</ExpandableListItem>
				))}
			
			</ScrollView>
		</>
	);
}