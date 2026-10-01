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
                {startlists.map((x:Discipline, i:number)=>(
                    <>
                        <Text>{x.name}</Text>
                        {x.classes.map((y:Class, j:number) => (
                            <>
                                <Text>{y.name}</Text>
                                {y.starts.map((z:Swimmer, k:number) => (
                                    <>
                                        <StartListItem key={i+""+j+""+k} number={z.rank} name={z.name} club={z.club} time={z.regTime} text={""} HC={z.HC} notFirst notLast/>
                                        
                                    </>

                                ))}
                            </>
                        ))}

                    </>
                ))}
            </ScrollView>
        </>
    );
}