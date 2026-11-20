import React, {useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, SectionList, View, StyleSheet, FlatList, ScrollView} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {apiStartlists} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {SectionHeader} from "@/components/SectionHeader";
import {ActivityIndicator, Appbar, Card, Portal, Switch, useTheme} from "react-native-paper";
import {StartListItem} from "@/components/StartListItem";
import {Collapsible} from "@/components/Collapsible";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CollapsibleSecondary from "@/components/CollapsibleSecondary";
import FloatingToggle from "@/components/FloatingToggle";
import {constructSearchParams} from "@/utils/requestUtils";
import {useLazyFetch} from "@/hooks/useLazyFetch";
import {keyStartlists} from "@/constants/storageKeys";

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
    const [isLoading, setIsLoading] = useState(true);
    const { meetId, clubId, swimmerId } = useLocalSearchParams<{meetId:string, clubId?:string, swimmerId?:string}>();
    const searchQuery = constructSearchParams([{key: "clubId", value: clubId}, {key: "swimmerId", value: swimmerId}]);
    const [startlists, setStartlists] = useLazyFetch<Discipline[]>(
        `${keyStartlists}/${meetId}/${searchQuery}`,
        `${apiStartlists}/${meetId}/${searchQuery}`,
        [],
        setIsLoading
    );
    const [groupByClass, setGroupByClass] = useState<boolean>(false);
    let pageHeader:string = "Startlister";
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
                class: a
            }
        });

    }, [startlists]);
    
    
    
    const renderNoClass = (item:Discipline) => {
        return(
            <Collapsible title={item.name} defaultExpanded={!!swimmerId || !!clubId}>
                {item.starts.map((x:Start, i:number) => (
                    <StartListItem
                        number={x.rank}
                        name={x.name}
                        club={x.club}
                        class={x.class}
                        time={x.regTime}
                        text={"Heat: " + x.heat + ", Bane: " + x.lane}
                        HC={x.HC !== "" ? `${x.HC} ${parseInt(x.percent)}%` : ""}
                    />
                ))}
            </Collapsible>
            
        );
    }
    const renderClass = (item:DisciplineClass, i:number) => {
        
        return(
            <Collapsible title={item.name}>
                {item.class.map((x:Class, j:number) => (
                    <CollapsibleSecondary title={x.name}>
                        {x.starts.map((y:Start, k:number) => (
                            <StartListItem
                                number={k}
                                name={y.name}
                                club={y.club}
                                class={""}
                                time={y.regTime}
                                text={"Heat: " + y.heat + ", Bane: " + y.lane}
                                HC={y.HC !== "" ? `${y.HC} ${parseInt(y.percent)}%` : ""}
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
            
            <FloatingToggle text={"Vis startlisten klassevis"} value={groupByClass} onValueChange={setGroupByClass} />
            
            {!groupByClass && (
                <FlatList 
                    data={DATA_NO_CLASS}
                    renderItem={({item}) => renderNoClass(item)}
                />
            )}
            {groupByClass && (
                <FlatList
                    data={DATA_CLASS}
                    renderItem={({item, index}) => renderClass(item, index)}
                />
            )}

            
        </>
    );
}