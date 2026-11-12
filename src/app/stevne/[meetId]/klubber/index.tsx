import React, {useState} from "react";
import {router, Stack, useLocalSearchParams, usePathname} from "expo-router";
import {Text, View, ScrollView} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ListItem} from "@/components/ListItem";
import {apiClubs} from "@/constants/backendEndpoints";
import {ActivityIndicator, Appbar} from "react-native-paper";
import Fetch from "@/utils/Fetch";

export interface Club {
    name:string;
    clubId:number;
}

export default function Index() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    const path = usePathname();

    useAsync(async () => {
        try {
            const response = await Fetch.get<Club[]>(`${apiClubs}/${meetId}`);
            const data:Club[] = response.data;
            setClubs(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}`)} />
                <Appbar.Content title="Klubber" />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>

            <ScrollView>
                {clubs.map((x:Club, i:number)=>(
                    <ListItem key={i} icon={"account-group-outline"} title={x.name} href={`${path}/${x.clubId}`}/>
                ))}
            </ScrollView>
        </>
    );
}