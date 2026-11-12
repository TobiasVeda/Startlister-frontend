import React, {useState} from "react";
import {router, Stack, useGlobalSearchParams, useLocalSearchParams, usePathname} from "expo-router";
import {Text, View, ScrollView} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ListItem} from "@/components/ListItem";
import {apiSwimmers} from "@/constants/backendEndpoints";
import {ActivityIndicator, Appbar} from "react-native-paper";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";


export interface Club {
	name:string;
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
	const [swimmers, setSwimmers] = useState<Club>({
		name: "-",
		hasStartlists: false,
		hasHeatlists: false,
		hasResults: false,
		hasFinals: false,
		swimmers: []
	});
	const [isLoading, setIsLoading] = useState(true);
	const { meetId } = useGlobalSearchParams<{meetId:string}>();
	const { clubId } = useLocalSearchParams<{clubId:string}>();

	useAsync(async () => {
		try {
			const response = await Fetch.get<Club>(`${apiSwimmers}/${meetId}/${clubId}`);
			const data:Club = response.data;
			setSwimmers(data);
			setIsLoading(false);
		} catch (e) {
			// TODO
		}
	}, [])

	return (
		<>

			<Appbar.Header>
				<Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}/klubber`)} />
				<Appbar.Content title="Personer" />
				{isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
			</Appbar.Header>

			<ScrollView>

				<SectionHeader title={swimmers.name}/>
				{swimmers.hasStartlists && <ListItem title={`Startlister for ${swimmers.name}`} href={"/"}/>}
				{swimmers.hasHeatlists && <ListItem title={`Heatlister for ${swimmers.name}`} href={"/"}/>}
				{swimmers.hasResults && <ListItem title={`Resultater for ${swimmers.name}`} href={"/"}/>}
				{swimmers.hasFinals && <ListItem title={`Finalelister for ${swimmers.name}`} href={"/"}/>}

				<SectionHeader title={"Utøvere"}/>
				{swimmers.swimmers.map((x:Swimmer, i) => (
					<>
						<ListItem icon={"account-outline"} title={x.name} href={"/"}/>
						{x.hasStartlists && "Startliste"}
						{x.hasHeatlists && "Heatliste"}
						{x.hasResults && "Resultater"}
						{x.hasFinals && "Finalelister"}
					</>
				))}
			
			</ScrollView>
		</>
	);
}