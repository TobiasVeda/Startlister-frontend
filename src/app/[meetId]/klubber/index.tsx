import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text, View} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import {ListItem} from "@/components/ListItem";
import { apiClubs } from "@/constants/backendEndpoints";
import {ActivityIndicator} from "react-native-paper";


export default function Index() {
    const [clubs, setClubs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();

    useAsync(async () => {
        const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
        const response = await fetch(`${apiClubs}/${param}`);
        const data:string[] = await response.json();
        setClubs(data);
        setIsLoading(false);
    }, [])

    return (
        <>
            <Stack.Screen options={{
                title: "Klubber",
                headerRight: () =>
                    isLoading ? <View style={{ paddingRight: 16 }}><ActivityIndicator size={25} /></View> : null }}
            />
            <ScrollView>
                {clubs.map((x:string, i:number)=>(
                    <ListItem key={i} title={x} href={"/"}/>
                ))}
            </ScrollView>
        </>
    );
}