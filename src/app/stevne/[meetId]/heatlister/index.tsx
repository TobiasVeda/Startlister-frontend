import React, {useEffect, useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, View, SectionList, FlatList} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import { apiHeatlists } from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {ActivityIndicator, Appbar} from "react-native-paper";
import HeatBlock from "@/components/HeatBlock";
import {Collapsible} from "@/components/Collapsible";
import {constructSearchParams} from "@/utils/requestUtils";

export interface Discipline {
    name:string,
    startTime:string,
    heats:Heat[]
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

export default function Index() {
    const [heatlists, setHeatlists] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId, clubId, swimmerId } = useLocalSearchParams<{meetId:string, clubId?:string, swimmerId?:string}>();
    let pageHeader:string = "Heatlister";
    if (clubId) {
        pageHeader += " for klubb"
    } else if (swimmerId) {
        pageHeader += " for person"
    }
    
    const DATA = useMemo(() => {
        return heatlists;
    }, [heatlists]);
    
    
    useAsync(async () => {
        const searchQuery = constructSearchParams([{key: "clubId", value: clubId}, {key: "swimmerId", value: swimmerId}]);
        try {
            const response = await Fetch.get<Discipline[]>(`${apiHeatlists}/${meetId}/${searchQuery}`);
            const data:Discipline[] = response.data;
            setHeatlists(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])
    

    const renderDiscipline = (discipline:Discipline) => {
        return (
                <Collapsible 
                    title={discipline.name} 
                    rightText={`Øvelse start: ${discipline.startTime}`}
                >
                    {discipline.heats.map((x:Heat, i) => (
                        <HeatBlock heat={x} />
                    ))}
                </Collapsible>
        )
    }
    
    const backAction = () => {
        if (router.canGoBack()) {
            router.back();
        } else if (swimmerId && clubId)  {
            router.dismissTo(`/stevne/${meetId}/klubber/${clubId}/${swimmerId}`);
        } else if (clubId) {
            router.dismissTo(`/stevne/${meetId}/klubber/${clubId}`);
        } else {
            router.dismissTo(`/stevne/${meetId}`)
        }
    }

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => backAction()} />
                <Appbar.Content title={pageHeader} />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>
            
            <FlatList
                data={DATA}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => renderDiscipline(item)}
            />
            
        </>
    );
}