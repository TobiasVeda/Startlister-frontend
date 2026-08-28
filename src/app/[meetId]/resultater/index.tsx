import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import { apiResults } from "@/constants/backendEndpoints";

export interface Discipline {
    name:string,
    classes:Class[]
}
export interface Class {
    name: string,
    entries: Entry[]
}
export interface Entry {
    place:number,
    prize:string,
    name:string,
    born:number,
    club:string,
    endTime:string,
    points:number,
    HC:string,
    percent:string,
    reaction:string
}


export default function Index() {
    const [results, setResults] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();

    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${apiResults}/${param}`);
        const data:Discipline[] = await response.json();
        setResults(data);
        setIsLoading(false);
    }, [])

    return (
        <>
            <Stack.Screen options={{
            title: "Resultater",
            headerRight: () =>
            isLoading ? <Text>Loading...</Text> : null }}
        />
        <ScrollView>
            {results.map((x:Discipline, i:number)=>(
                <>
                    <ListItem key={i} title={x.name} href={"/"}/>
                    {x.classes.map((y:Class, j:number) => (
                        <>
                            <Text style={{fontWeight: "bold"}}>{y.name}</Text>
                            {y.entries.map((z:Entry, k:number) => (
                                <Text>Plass: {z.place} | Premie: {z.prize} | Navn: {z.name} | Født: {z.born} | Klubb: {z.club} | Sluttid: {z.endTime} | Poeng: {z.points} | HC: {z.HC} | Prosent: {z.percent} | Reaksjon: {z.reaction}</Text>
                            ))}
                        </>
                    ))}

                </>
            ))}
        </ScrollView>
        </>
    );
}