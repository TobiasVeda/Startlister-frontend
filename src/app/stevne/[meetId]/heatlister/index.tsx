import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, View, SectionList} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import { apiHeatlists } from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {ActivityIndicator, Appbar} from "react-native-paper";
import {SectionHeader} from "@/components/SectionHeader";
import {StartListItem} from "@/components/StartListItem";

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
    const { meetId } = useLocalSearchParams<{meetId:string}>();

    const DATA = useMemo(() => {

        return heatlists.map((x:Discipline) => {
            return {
                title: x.name,
                startTime: x.startTime,
                data: x.heats
            }
        });
        
    }, [heatlists]);
    
    useAsync(async () => {
        try {
            const response = await Fetch.get<Discipline[]>(`${apiHeatlists}/${meetId}`);
            const data:Discipline[] = response.data;
            setHeatlists(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])
    
    const renderHeat = (heat:Heat) => {
        return (
            <>
                <SectionHeader title={`Heat: ${heat.heatNumber} StartTid: ${heat.startTime}`} />
                {heat.starts.map((x:Start, k:number) => (
                    <StartListItem
                        number={x.lane}
                        name={x.name}
                        club={x.club}
                        class={x.class}
                        time={x.regTime}
                        text={x.text}
                        HC={x.HC !== "" ? `${x.HC} ${parseInt(x.percent)}%` : ""}
                        squareTop={k !== 0}
                        squareBottom={k !== heat.starts.length-1}
                    />
                ))}
            </>
        );
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}`)} />
                <Appbar.Content title="Heatlister" />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>
            
            <SectionList
                sections={DATA}
                renderItem={({item}) => renderHeat(item)}
                renderSectionHeader={({section: {title, startTime}}) => (
                    <SectionHeader title={`Øvelse: ${title} Starttid: ${startTime}`} />
                )}
            />
            
        </>
    );
}