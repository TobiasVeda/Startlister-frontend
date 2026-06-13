import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import {scrapeClubs} from "@/scraper/livetiming/clubs";


export default function Index() {
    const [clubs, setClubs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();

    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        setClubs(await scrapeClubs(param));
        setIsLoading(false);
    }, [])

    return (
        <>
            <Stack.Screen options={{
                title: "Klubber",
                headerRight: () =>
                    isLoading ? <Text>Loading...</Text> : null }}
            />
            <ScrollView>
                {clubs.map((x:string, i:number)=>(
                    <ListItem key={i} title={x} href={"/"}/>
                ))}
            </ScrollView>
        </>
    );
}