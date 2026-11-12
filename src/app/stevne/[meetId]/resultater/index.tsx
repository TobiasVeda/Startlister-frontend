import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, SectionList, View} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {apiResults} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {ActivityIndicator, Appbar, Switch} from "react-native-paper";
import {StartListItem} from "@/components/StartListItem";

export interface Discipline {
    name:string;
    results:Result[];
}
export interface Result {
    place:number;
    price:string;
    name:string;
    born:string;
    class:string;
    club:string;
    endTime:string;
    points:number;
    HC:string;
    percent:string;
    reaction:string;
}

export interface Class {
    name:string;
    results:Result[];
}

export default function Index() {
    const [startlists, setStartlists] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    const [groupByClass, setGroupByClass] = useState<boolean>(true);

    const DATA_NO_CLASS = useMemo(() => {

        return startlists.map((x:Discipline) => {
            return {
                name: x.name,
                data: x.results
            }
        });

    }, [startlists]);

    const DATA_CLASS = useMemo(() => {

        return startlists.map((x:Discipline) => {
            const startsMap = new Map<string, Result[]>();

            for (let i = 0; i < x.results.length; i++) {
                startsMap.set(x.results[i].class, [
                    ...startsMap.get(x.results[i].class) ?? [],
                    x.results[i]
                ])
            }

            let a:Class[] = [];
            for (const [key, value] of startsMap) {
                a.push({
                    name: key,
                    results: value
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
            const response = await Fetch.get<Discipline[]>(`${apiResults}/${meetId}`);
            const data:Discipline[] = response.data;
            setStartlists(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])

    const renderNoClass = (item:Result) => {
        return(
            <StartListItem
                number={item.place}
                name={item.name}
                club={item.club}
                class={item.class}
                time={item.endTime}
                text={""}
                HC={item.HC !== "" ? `${item.HC} ${parseInt(item.percent)}%` : ""}
            />
        );
    }
    const renderClass = (item:Class) => {
        let i = 0;
        return(
            <>
                <SectionHeader title={`Klasse: ${item.name}`} />
                {item.results.map((x:Result) => (
                    <StartListItem
                        number={++i}
                        name={x.name}
                        club={x.club}
                        class={""}
                        time={x.endTime}
                        text={""}
                        HC={x.HC !== "" ? `${x.HC} ${parseInt(x.percent)}%` : ""}
                        p={x.price === "p"}
                    />
                ))}
            </>
        );
    };

    return (
        <>

            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.dismissTo(`/stevne/${meetId}`)} />
                <Appbar.Content title="Resultater" />
                {isLoading && <View style={{paddingRight: 16}}><ActivityIndicator size={25}/></View>}
            </Appbar.Header>

            <View>
                <Text>Vis resultater klassevis</Text>
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