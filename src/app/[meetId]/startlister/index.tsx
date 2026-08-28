import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import { apiStartlists } from "@/constants/backendEndpoints";

export interface Discipline {
    name:string,
    starts:Start[]
}
export interface Start {
    rank:number,
    name:string,
    born:number,
    club:string,
    class:string,
    regTime:string,
    HC:string,
    percent:string,
    heat:number,
    lane:number
}

export default function Index() {
    const [startlists, setStartlists] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();

    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${apiStartlists}/${param}`);
        console.log(response);
        const data:Discipline[] = await response.json();
        setStartlists(data);
        setIsLoading(false);
    }, [])

    return (
        <>
            <Stack.Screen options={{
                title: "Startlister",
                headerRight: () =>
                    isLoading ? <Text>Loading...</Text> : null }}
            />
            <ScrollView>
                {startlists.map((x:Discipline, i:number)=>(
                    <>
                        <ListItem key={i} title={x.name} href={"/"}/>
                        {x.starts.map((y:Start, j:number) => (
                            <Text key={i + "-" + j}>
                                Rank: {y.rank} | Navn: {y.name} | Født: {y.born} | Klubb: {y.club} | Klasse: {y.class} | Påmeldt Tid: {y.regTime} | HC: {y.HC} | Prosent: {y.percent} | Heat: {y.heat} | Bane: {y.lane}
                            </Text>
                        ))}
                    </>
                ))}
            </ScrollView>
        </>
    );
}