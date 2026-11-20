import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, SectionList, View, FlatList} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ListItem} from "@/components/ListItem";
import {apiSchedule} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {ActivityIndicator, Appbar, useTheme} from "react-native-paper";
import {ExpandableListItem} from "@/components/ExpandableListItem";
import {Collapsible} from "@/components/Collapsible";
import {useLazyFetch} from "@/hooks/useLazyFetch";
import {keySchedule} from "@/constants/storageKeys";

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
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [schedule, setSchedule] = useLazyFetch<Session[]>(
        `${keySchedule}/${meetId}`,
        `${apiSchedule}/${meetId}`,
        [],
        setIsLoading
    );
    
    const DATA = useMemo(() => {
        return schedule;
    }, [schedule])
    
    
    const renderSession = (item:Session, i:number) => {
        return (
            <Collapsible
                title={item.name}
                rightText={`Start: ${item.start} Slutt: ${item.end}`}
            >
                
                {item.disciplines.map((x:Discipline, j:number) => (
                    <ExpandableListItem
                        title={x.name}
                        rightText={x.start}
                    >
                        {x.heats.map((y:Heat, k:number)=> (
                            <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                                <Text style={{color: theme.colors.onPrimary}}>Heat {y.number}</Text>
                                <Text style={{color: theme.colors.onPrimary}}>{y.start}</Text>
                            </View>
                        ))}
                    </ExpandableListItem>
                ))}
                
            </Collapsible>
        );
    };
    
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}`)} />
                <Appbar.Content title="Tidsskjema" />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>

            <FlatList
                data={DATA} 
                renderItem={({item, index}) => renderSession(item, index)}
            />

        </>
    );
}