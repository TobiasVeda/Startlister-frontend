import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, SectionList, View} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ListItem} from "@/components/ListItem";
import {apiSchedule} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {ActivityIndicator, Appbar} from "react-native-paper";

export interface Session {
    name:string;
    start:string;
    end:string;
    disciplines:Discipline[];
}
export interface Discipline {
    name:string;
    start:string;
    heats:Heat[];
}
export interface Heat {
    number:number;
    start:string;
}

export default function Index() {
    const [schedule, setSchedule] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    
    const DATA = useMemo(() => {

        return schedule.map((x:Session) => {
            return {
                name: x.name,
                start: x.start,
                end: x.end,
                data: x.disciplines
            }
        });
        
    }, [schedule]);
    
    useAsync(async () => {
        try {
            const response = await Fetch.get<Session[]>(`${apiSchedule}/${meetId}`);
            const data:Session[] = response.data;
            setSchedule(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])
    
    const renderDiscipline = (item:Discipline) => {
        return (
            <>
                <ListItem title={item.name} subtitle={item.start} href={"/"}/>
                {item.heats.map((x:Heat, i:number)=>(
                    <>
                        <Text>
                            Heat: {x.number}, Starttid: {x.start}
                        </Text>
                    </>
                ))}
        
            </>
        );
    };
    
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}`)} />
                <Appbar.Content title="Tidsskjema" />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>

            <SectionList
                sections={DATA}
                renderItem={({item}) => renderDiscipline(item)}
                renderSectionHeader={({section: {name, start, end}}) => (
                    <SectionHeader title={`${name} Start: ${start} Slutt: ${end}`} />
                )}
            />

        </>
    );
}