import React, {useEffect, useMemo, useState} from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {Text, View, StyleSheet, SectionList, FlatList} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {apiFinals} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {ActivityIndicator, Switch, useTheme, Button, Appbar} from "react-native-paper";
import {StartListItem} from "@/components/StartListItem";
import Slider from "@react-native-community/slider";
import {Collapsible} from "@/components/Collapsible";
import {constructSearchParams} from "@/utils/requestUtils";
import {useLazyFetch} from "@/hooks/useLazyFetch";
import {keyFinals} from "@/constants/storageKeys";

export interface Discipline {
    name:string;
    entries:Entry[];
}
export interface Entry {
    rank:string;
    name:string;
    born:string;
    club:string;
    class:string;
    endTime:string;
    comment:string;
}

export default function Index() {
    const { meetId, clubId, swimmerId } = useLocalSearchParams<{meetId:string, clubId?:string, swimmerId?:string}>();
    const theme = useTheme();
    
    const [isLoading, setIsLoading] = useState(true);
    const searchQuery = constructSearchParams([{key: "clubId", value: clubId}, {key: "swimmerId", value: swimmerId}]);
    const [finals, setFinals] = useLazyFetch<Discipline[]>(
        `${keyFinals}/${meetId}/${searchQuery}`,
        `${apiFinals}/${meetId}/${searchQuery}`, 
        [], 
        setIsLoading
    );
    
    const [showDeletions, setShowDeletions] = useState<boolean>(false);
    const [showReserves, setShowReserves] = useState<boolean>(true);
    const [reserveCount, setReserveCount] = useState<number>(2);
    
    let pageHeader:string = "Finalelister";
    if (clubId) { // If both, club will take priority (API behaviour)
        pageHeader += " for klubb"
    } else if (swimmerId) {
        pageHeader += " for person"
    }
    
    const DATA = useMemo(() => {
        
        return finals.map((x:Discipline) => {
            let currReserveCount = 0;
            return {
                name: x.name,
                entries: x.entries.filter((y:Entry) => {
                    
                    if (y.comment === "Strøket" && !showDeletions) {
                        return false;
                    } else if (y.comment === "Reserve") {
                        if (!showReserves) {
                            return false;
                        } else if (currReserveCount >= reserveCount && reserveCount !== -1) {
                            return false;
                        } else {
                            ++currReserveCount;
                            return true;
                        }
                    }
                    return true;
                })
            }
        });
        
    }, [finals, showDeletions, showReserves, reserveCount]);
    
    const reserveCountSubtitle = () => {
        if (reserveCount === 0) {
            return "Viser ingen reserver";
        } else if (reserveCount === -1) {
            return "Viser alle reserver";
        } else {
            return `Viser ${reserveCount} reserve${reserveCount > 1 ? "r" : ""}`;
        }
    };
    
    const increment = () => {
        if (reserveCount === 25) {
            return;
        }
        setReserveCount(reserveCount + 1);
    };
    const decrement = () => {
        if (reserveCount === -1) {
            return;
        }
        setReserveCount(reserveCount - 1);
    };
    
    const renderDiscipline = (item:Discipline) => {
        
        return (
            <Collapsible title={item.name} >
                {item.entries.map((x:Entry, i:number) => (
                    <StartListItem
                        number={isNaN(parseInt(x.rank)) ? 0 : parseInt(x.rank)}
                        name={x.name}
                        club={x.club}
                        class={x.class}
                        time={x.endTime}
                        text={x.comment}
                        HC={""}
                        p={isNaN(parseInt(x.rank)) || x.comment === "Strøket" || x.comment === "Reserve"}
                    />
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

            <View style={styles.controls}>
                <View style={styles.toggle}>
                    <Text>Vis strykinger</Text>
                    <Switch value={showDeletions} onValueChange={() => setShowDeletions(!showDeletions)} />
                </View>

                <View style={styles.toggle}>
                    <Text>Vis reserver</Text>
                    <Switch value={showReserves} onValueChange={() => setShowReserves(!showReserves)} />
                </View>

                {showReserves && (
                    <View style={styles.reserveControls}>
                        <Text style={styles.reserveLabel}>{reserveCountSubtitle()}</Text>
                        <Button icon="minus" mode="elevated" onPress={decrement} compact>{""}</Button>
                        <Slider
                            style={styles.slider}
                            step={1}
                            value={reserveCount}
                            onValueChange={setReserveCount}
                            minimumValue={-1}
                            maximumValue={25}
                            thumbTintColor={theme.colors.primary}
                            minimumTrackTintColor={theme.colors.primary}
                            maximumTrackTintColor={theme.colors.surfaceVariant}
                        />
                        <Button icon="plus" mode="elevated" onPress={increment} compact>{""}</Button>
                    </View>
                )}
            </View>
            
            <FlatList
                data={DATA}
                renderItem={({item}) => renderDiscipline(item)}
            />
             
        </>
    );
}

const styles = StyleSheet.create({
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
        paddingHorizontal: 8,
    },
    toggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    reserveControls: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    reserveLabel: {
        minWidth: 36,
        textAlign: "center",
    },
});