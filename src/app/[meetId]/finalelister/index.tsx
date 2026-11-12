import {useEffect, useMemo, useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text, View, StyleSheet} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {Checkbox, ScrollView} from "@expo/ui";
import {apiFinals} from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {ActivityIndicator, Switch, useTheme, Button} from "react-native-paper";
import {SectionHeader} from "@/components/SectionHeader";
import {StartListItem} from "@/components/StartListItem";
import Slider from "@react-native-community/slider";
import {Heat, Start} from "@/app/[meetId]/heatlister";

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
    const [finals, setFinals] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams<{meetId:string}>();
    const [showDeletions, setShowDeletions] = useState<boolean>(false);
    const [showReserves, setShowReserves] = useState<boolean>(false);
    const [reserveCount, setReserveCount] = useState<number>(-1);
    const theme = useTheme();
    
    const filteredFinals:Discipline[] = useMemo(() => {
        return finals.map((x:Discipline) => {
            let currReserveCount = 0;
            return {
                ...x,
                entries: x.entries.filter((y: Entry) => {
                    
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

    useAsync(async () => {
        try {
            const response = await Fetch.get<Discipline[]>(`${apiFinals}/${meetId}`);
            const data:Discipline[] = response.data;
            setFinals(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])
    
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

    return (
        <>
            <Stack.Screen options={{
                title: "Finalelister",
                headerRight: () =>
                    isLoading ? <View style={{ paddingRight: 16 }}><ActivityIndicator size={25} /></View> : null }}
            />

            <ScrollView>

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
                


                {filteredFinals.map((x:Discipline, i:number)=>(
                    <>

                        <SectionHeader key={i} title={`Øvelse: ${x.name}`} />
                        {x.entries.map((y:Entry, j:number) => (
                            <>

                                <StartListItem
                                    key={i+""+j}
                                    number={isNaN(parseInt(y.rank)) ? 0 : parseInt(y.rank)}
                                    name={y.name}
                                    club={y.club}
                                    class={y.class}
                                    time={y.endTime}
                                    text={y.comment}
                                    HC={""}
                                    squareTop={j !== 0}
                                    squareBottom={j !== x.entries.length-1}
                                    p={isNaN(parseInt(y.rank)) || y.comment === "Strøket" || y.comment === "Reserve"}
                                />

                            </>
                        ))}

                    </>
                ))}

            </ScrollView>
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