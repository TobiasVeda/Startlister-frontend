import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, SectionList, View, StyleSheet, FlatList} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {apiResults} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {ActivityIndicator, Appbar, Card, Portal, Switch, useTheme} from "react-native-paper";
import {StartListItem} from "@/components/StartListItem";
import FloatingToggle from "@/components/FloatingToggle";
import {Collapsible} from "@/components/Collapsible";
import CollapsibleSecondary from "@/components/CollapsibleSecondary";
import {constructSearchParams} from "@/utils/requestUtils";
import {useLazyFetch} from "@/hooks/useLazyFetch";
import {keyResults} from "@/constants/storageKeys";


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

export interface DisciplineClass {
    name:string;
    class:Class[];
}
export interface Class {
    name:string;
    results:Result[];
}

export default function Index() {
    const { meetId, clubId, swimmerId } = useLocalSearchParams<{meetId:string, clubId?:string, swimmerId?:string}>();
    const [isLoading, setIsLoading] = useState(true);
    const searchQuery = constructSearchParams([{key: "clubId", value: clubId}, {key: "swimmerId", value: swimmerId}]);
    const [startlists, setStartlists] = useLazyFetch<Discipline[]>(
        `${keyResults}/${meetId}/${searchQuery}`,
        `${apiResults}/${meetId}/${searchQuery}`,
        [],
        setIsLoading
    );
    
    const [groupByClass, setGroupByClass] = useState<boolean>(true);
    let pageHeader:string = "Resultater";
    if (clubId) {
        pageHeader += " for klubb"
    } else if (swimmerId) {
        pageHeader += " for person"
    }
    
    const DATA_NO_CLASS = useMemo(() => {
        return startlists;
    }, [startlists]);

    const DATA_CLASS:DisciplineClass[] = useMemo(() => {

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
                class: a
            }
        });

    }, [startlists]);

    
    
    const renderNoClass = (item:Discipline) => {
        return(
                <Collapsible title={item.name} defaultExpanded={!!swimmerId || !!clubId}>
                    {item.results.map((x:Result, i:number) => (
                        <StartListItem
                            number={x.place}
                            name={x.name}
                            club={x.club}
                            class={x.class}
                            time={x.endTime}
                            text={""}
                            HC={x.HC !== "" ? `${x.HC} ${parseInt(x.percent)}%` : ""}
                        />
                    ))}
                </Collapsible>
        );
    }
    const renderClass = (item:DisciplineClass) => {
        
        return(
            <Collapsible title={item.name}>
                {item.class.map((x:Class, j:number) => (
                    <CollapsibleSecondary title={x.name}>
                        {x.results.map((y:Result, k:number) => (
                            <StartListItem
                                number={k+1}
                                name={y.name}
                                club={y.club}
                                class={""}
                                time={y.endTime}
                                text={""}
                                HC={y.HC !== "" ? `${y.HC} ${parseInt(y.percent)}%` : ""}
                                p={y.price === "p"}
                            />
                        ))}
                    </CollapsibleSecondary>
                ))}
            </Collapsible>
        );
    };

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

            <FloatingToggle text={"Vis resultater klassevis"} value={groupByClass} onValueChange={setGroupByClass} />

            {!groupByClass && (
                <FlatList 
                    data={DATA_NO_CLASS}
                    renderItem={({item}) => renderNoClass(item)}
                />
            )}
            {groupByClass && (
                <FlatList
                    data={DATA_CLASS}
                    renderItem={({item}) => renderClass(item)}
                />
            )}


        </>
    );
}
