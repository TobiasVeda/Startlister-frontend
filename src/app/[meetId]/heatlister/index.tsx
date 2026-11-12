import {useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text, View} from "react-native";
import {useAsync} from "@/hooks/useAsync";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import { apiHeatlists } from "@/constants/backendEndpoints";
import Fetch from "@/utils/Fetch";
import {ActivityIndicator} from "react-native-paper";
import {SectionHeader} from "@/components/SectionHeader";
import {StartListItem} from "@/components/StartListItem";

export interface Discipline {
    name:string,
    startTime:string,
    heats:Heat[]
}
export interface Heat {
    heatNumber:number,
    startTime:string,
    starts:Start[]
}
export interface Start {
    lane:number,
    name:string,
    swimmerId:number,
    club:string,
    clubId:number,
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
    const { meetId } = useLocalSearchParams<{meetId:string}>();

    useAsync(async () => {
        try {
            const response = await Fetch.get<Discipline[]>(`${apiHeatlists}/${meetId}`);
            const data:Discipline[] = response.data;
            setHeatlists(data);
            setIsLoading(false);
        } catch (e) {
            // TODO
        }
    }, [])

    return (
        <>
            <Stack.Screen options={{
                title: "Heatlister",
                headerRight: () =>
                    isLoading ? <View style={{ paddingRight: 16 }}><ActivityIndicator size={25} /></View> : null }}
            />
            
            <ScrollView>
                
                {heatlists.map((x:Discipline, i:number)=>(
                    <>
                        
                        <SectionHeader key={i} title={`Øvelse: ${x.name} Starttid: ${x.startTime}`} />
                        {x.heats.map((y:Heat, j:number) => (
                            <>
                                
                                <SectionHeader key={i+""+j} title={`Heat: ${y.heatNumber} StartTid: ${y.startTime}`} />
                                {y.starts.map((z:Start, k:number) => (
                                    <>
                                        
                                        <StartListItem 
                                            key={i+""+j+""+k} 
                                            number={z.lane} 
                                            name={z.name} 
                                            club={z.club} 
                                            class={z.class} 
                                            time={z.regTime} 
                                            text={z.text} 
                                            HC={z.HC !== "" ? `${z.HC} ${parseInt(z.percent)}%` : ""}
                                            squareTop={k !== 0}
                                            squareBottom={k !== y.starts.length-1}
                                        />
                                        
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