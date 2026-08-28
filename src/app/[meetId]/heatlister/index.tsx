import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import { apiHeatlists } from "@/constants/backendEndpoints";

export interface Discipline {
    name:string,
    heats:Heat[]
}
export interface Heat {
    heat:number,
    lane:number,
    name:string,
    club:string,
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
    const { meetId } = useLocalSearchParams();

    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${apiHeatlists}/${meetId}`);
        const data:Discipline[] = await response.json();
        setHeatlists(data);
        setIsLoading(false);
    }, [])

    return (
        <>
            <Stack.Screen options={{
                title: "Heatlister",
                headerRight: () =>
                    isLoading ? <Text>Loading...</Text> : null }}
            />
            <ScrollView>
                {heatlists.map((x:Discipline, i:number)=>(
                    <>
                        <ListItem key={i} title={x.name} href={"/"}/>
                        {x.heats.map((y:Heat, j:number) => (
                            <Text key={i + "-" + j}>
                                Heat: {y.heat} | Bane: {y.lane} | Navn: {y.name} | Klubb: {y.club} | Født: {y.born} | Klasse: {y.class} | Påmeldt Tid: {y.regTime} | Prosent: {y.percent} | Heattekst: {y.text}
                            </Text>
                        ))}
                    </>
                ))}
            </ScrollView>
        </>
    );
}