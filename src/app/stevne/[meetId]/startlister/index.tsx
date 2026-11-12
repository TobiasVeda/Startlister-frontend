import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, SectionList, View} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {apiStartlists} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {ActivityIndicator, Appbar, Switch} from "react-native-paper";
import {StartListItem} from "@/components/StartListItem";

export interface Discipline {
    name:string;
    starts:Start[];
}
export interface Start {
    rank:number;
    name:string;
    born:string;
    club:string;
    class:string;
    regTime:string;
    HC:string;
    percent:string;
    heat:number;
    lane:number;
}

export interface DisciplineClass {
    name:string;
    class:Class[];
}
export interface Class {
    name:string;
    starts:Start[];
}

export default function Index() {
    const [startlists, setStartlists] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    const [groupByClass, setGroupByClass] = useState<boolean>(false);
    
    const DATA_NO_CLASS = useMemo(() => {

        return startlists.map((x:Discipline) => {
            return {
                name: x.name,
                data: x.starts
            }
        });

    }, [startlists]);

    const DATA_CLASS = useMemo(() => {

        return startlists.map((x:Discipline) => {
            const starts = new Map<string, Start[]>();
            
            for (let i = 0; i < x.starts.length; i++) {
                starts.set(x.starts[i].class, [
                    ...starts.get(x.starts[i].class) ?? [],
                    x.starts[i]
                ])
            }

            let a:Class[] = [];
            for (const [key, value] of starts) {
                a.push({
                    name: key,
                    starts: value
                })
            }
            
            return {
                name: x.name,
                data: a
            }
        });

    }, [startlists]);

    useAsync(async () => {
        try {
            const response = await Fetch.get<Discipline[]>(`${apiStartlists}/${meetId}`);
            const data:Discipline[] = response.data;
            setStartlists(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])
    
    const renderNoClass = (item:Start) => {
        return(
            <StartListItem
                number={item.rank}
                name={item.name}
                club={item.club}
                class={item.class}
                time={item.regTime}
                text={"Heat: " + item.heat + ", Bane: " + item.lane}
                HC={item.HC !== "" ? `${item.HC} ${parseInt(item.percent)}%` : ""}
            />
        );
    }
    const renderClass = (item:Class) => {
        let i = 0;
        return(
            <>
                <SectionHeader title={`Klasse: ${item.name}`} />
                {item.starts.map((x:Start) => (
                    <StartListItem
                        number={++i}
                        name={x.name}
                        club={x.club}
                        class={""}
                        time={x.regTime}
                        text={"Heat: " + x.heat + ", Bane: " + x.lane}
                        HC={x.HC !== "" ? `${x.HC} ${parseInt(x.percent)}%` : ""}
                    />
                ))}
            </>
        );
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}`)} />
                <Appbar.Content title="Startlister" />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>

            <View>
                <Text>Vis startlisten klassevis</Text>
                <Switch value={groupByClass} onValueChange={setGroupByClass} />
            </View>
            
            {!groupByClass && (
                <SectionList
                    sections={DATA_NO_CLASS}
                    renderItem={({item}) => renderNoClass(item)}
                    renderSectionHeader={({section: {name}}) => (
                        <SectionHeader title={`Øvelse: ${name}`} />
                    )}
                />
            )}
            {groupByClass && (
                <SectionList
                    sections={DATA_CLASS}
                    renderItem={({item}) => renderClass(item)}
                    renderSectionHeader={({section: {name}}) => (
                        <SectionHeader title={`Øvelse: ${name}`} />
                    )}
                />
            )}

            
        </>
    );
}