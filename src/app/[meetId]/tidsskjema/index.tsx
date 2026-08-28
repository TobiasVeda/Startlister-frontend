import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import { apiSchedule } from "@/constants/backendEndpoints";

// export interface Schedule{
//     disciplines:Discipline[];
// }
export interface Discipline {
    name:string,
    date:string,
    time:string
    heats:Heat[]
}
export interface Heat {
    number:number,
    time:string
}

export default function Index() {
    const [schedule, setSchedule] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();
    
    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${apiSchedule}/${param}`);
        const data:Discipline[] = await response.json();
        setSchedule(data);
        setIsLoading(false);
    }, [])
    
    return (
        <>
        <Stack.Screen options={{
            title: "Tidsskjema",
            headerRight: () =>
                isLoading ? <Text>Loading...</Text> : null }}
        />
        <ScrollView>
            {schedule.map((s:Discipline, i:number)=>(
                <>
                <ListItem key={i} title={s.name} subtitle={s.date} value={s.time} href={"/"}/>
                <Text>
                    {s.heats.map((h:Heat, j:number) => (
                        <Text key={i + "-" + j}>
                        Heat: {h.number}, Starttid:{h.time} | &nbsp;
                        </Text>
                        ))}
                </Text>
                </>
            ))}
        </ScrollView>
        </>
    );
}