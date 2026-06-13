import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {Discipline, Heat, scrapeSchedule} from "@/scraper/livetiming/schedule";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";


export default function Index() {
    const [schedule, setSchedule] = useState<Discipline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();
    
    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        setSchedule(await scrapeSchedule(param));
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