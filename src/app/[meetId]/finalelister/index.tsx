import {useEffect, useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {Button, Checkbox, ScrollView, Slider} from "@expo/ui";
import ListItem from "@/components/ListItem";
import { apiFinals } from "@/constants/backendEndpoints";

export interface Discipline {
    name:string,
    entries:Entry[]
}
export interface Entry {
    rank:string,
    name:string,
    born:string,
    club:string,
    class:string,
    endTime:string,
    comment:string
}

export default function Index() {
    const [finals, setFinals] = useState<Discipline[]>([]);
    const [showDeletions, setShowDeletions] = useState<boolean>(true);
    const [reserveCount, setReserveCount] = useState<number>(2);
    const [sliderText, setSliderText] = useState<string>("Vis 2 reserver");
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();
    const [sliderIndex, setSliderIndex] = useState<number>(1);
    const sliderValues:number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 26];

    useAsync(async () => {
        setIsLoading(true);
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${apiFinals}/${param}`)
        const data: Discipline[] = await response.json();
        setFinals(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setReserveCount(sliderValues[sliderIndex]);
        if (sliderIndex === 0) {
            setSliderText("Ikke vis reserver");
            return;
        }
        if (sliderIndex === sliderValues.length -1) {
            setSliderText("Vis alle reserver");
            return;
        }
        let str:string = "Vis " + sliderValues[sliderIndex] + " reserve";
        if (sliderIndex > 1) {
            str += "r";
        }
        setSliderText(str);
    }, [sliderIndex]);
    
    const reload = async () => {
        setIsLoading(true);
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${finals}/${param}`)
        const data: Discipline[] = await response.json();
        setFinals(data);
        setIsLoading(false);
    }
    const decrement = () => {
        if (sliderIndex !== 0) {
            setSliderIndex(sliderIndex - 1);
        }
    }
    const increment = () => {
        if (sliderIndex !== sliderValues.length -1) {
            setSliderIndex(sliderIndex + 1);
        }
    }
    
    return (
        <>
            <Stack.Screen options={{
                title: "Finalelister",
                headerRight: () =>
                    isLoading ? <Text>Loading...</Text> : null }}
            />
            <ScrollView>
                <Text>{sliderText}</Text>
                <Button onPress={decrement}><Text>&lt;</Text></Button>
                <Slider
                    value={sliderIndex}
                    onValueChange={setSliderIndex}
                    min={0}
                    max={sliderValues.length -1}
                    step={1}
                />
                <Button onPress={increment}><Text>&gt;</Text></Button>
                <Text>{showDeletions ? "Vis strykninger" : "Ikke vis strykninger"}</Text>
                <Checkbox value={showDeletions} onValueChange={setShowDeletions} />
                <Button onPress={reload}><Text>Søk</Text></Button>

                {finals.map((x:Discipline, i:number)=>(
                    <>
                        <ListItem key={i} title={x.name} href={"/"}/>
                        {x.entries.map((y:Entry, j:number) => (
                            <Text key={i + "-" + j}>
                                Rank: {y.rank} | Navn: {y.name} | Født: {y.born} | Klubb: {y.club} | Klasse: {y.class} | Sluttid: {y.endTime} | Kommentar: {y.comment}
                            </Text>
                        ))}
                    </>
                ))}
            </ScrollView>
        </>
    );
}