import React, {useState} from "react";
import {router, Stack, useLocalSearchParams, usePathname} from "expo-router";
import {Text, View, ScrollView} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ListItem} from "@/components/ListItem";
import {apiClubs} from "@/constants/backendEndpoints";
import {ActivityIndicator, Appbar} from "react-native-paper";
import Fetch from "@/utils/Fetch";
import {useLazyFetch} from "@/hooks/useLazyFetch";
import {keyClubs} from "@/constants/storageKeys";

export interface Club {
    name:string;
    clubId:number;
}

export default function Index() {
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    const path = usePathname();
    
    const [isLoading, setIsLoading] = useState(true);
    const [clubs, setClubs] = useLazyFetch<Club[]>(
        `${keyClubs}/${meetId}`,
        `${apiClubs}/${meetId}`,
        [],
        setIsLoading
    );
    

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