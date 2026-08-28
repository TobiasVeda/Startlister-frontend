import {useEffect, useState} from "react";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import {Stack, useLocalSearchParams, usePathname} from "expo-router";
import {Text} from "react-native";
import * as date from "@/utils/date"
import {useAsync} from "@/hooks/useAsync";
import { apiMeetDetails } from "@/constants/backendEndpoints";

export interface MeetDetails {
    data:Data,
    lists:Lists,
    documents:Document[]
}
export interface Data {
    location:string,
    hostClub:string,
    meetName:string,
    from:string,
    to:string,
    numberOfLanes:string,
    poolLength:string,
    poolName:string,
    meetType:string,
    registerDeadline:string
}
export interface Lists {
    hasStartlist:boolean,
    hasHeatlist:boolean,
    hasResults:boolean,
    hasFinals:boolean,
    hasSchedule:boolean
}
export interface Document {
    name:string,
    url:string
}

export default function Index() {
    const [details, setDetails] = useState<MeetDetails>();
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();
    const path = usePathname();

    useAsync(async () => {
            const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
            const response = await fetch(`${apiMeetDetails}/${param}`);
            const data:MeetDetails = await response.json();
            setDetails(data);
            setIsLoading(false);
    }, [])
    
    return (
        <>
        <Stack.Screen options={{
            title: "Stevnedetaljer",
            headerRight: () =>
                isLoading ? <Text>Loading...</Text> : null }}
        />
        <ScrollView>
            <Text>Stevnedetaljer</Text>
            
            <Text>
                <Text style={{fontWeight: "bold"}}>Sted: </Text>
                <Text>{details?.data?.location}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Arrangør: </Text>
                <Text>{details?.data?.hostClub}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Fra Dato: </Text>
                <Text>{details?.data ? date.fromISOString(details?.data?.from) : ""}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Til Dato: </Text>
                <Text>{details?.data ? date.fromISOString(details.data.to) : ""}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Antall Baner: </Text>
                <Text>{details?.data?.numberOfLanes}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Bassenglengde: </Text>
                <Text>{details?.data?.poolLength}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Stevnenavn: </Text>
                <Text>{details?.data?.meetName}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Svømmehall: </Text>
                <Text>{details?.data?.poolName}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Påmeldingsfrist: </Text>
                <Text>{details?.data ? date.fromISOString(details.data.registerDeadline) : ""}</Text>
            </Text>
            
            <Text>Søkbare Lister</Text>
            {details?.lists?.hasStartlist && <ListItem title={"Startlister"} href={path + "/startlister"}/>}
            {details?.lists?.hasHeatlist && <ListItem title={"Heatlister"} href={path + "/heatlister"}/>}
            {details?.lists?.hasResults && <ListItem title={"Resultater"} href={path + "/resultater"}/>}
            {details?.lists?.hasFinals && <ListItem title={"Finalelister"} href={path + "/finalelister"}/>}
            {details?.lists?.hasSchedule && <ListItem title={"Tidsskjema"} href={path + "/tidsskjema"}/>}
            {details?.lists && <ListItem subtitle={"(TODO:Personer)"} title={"Klubber & Personer"} href={path + "/klubber"}/>}
            {details?.lists && <ListItem subtitle={"(TODO)"} title={"Livetiming"} href={"/"}/>}
            <Text>Eksterne Dokumenter og Koblinger</Text>
            {details?.documents?.map((x, i:number)=>(
                <ListItem key={"doc"+i} title={x.name} subtitle={x.url} href={x.url}/>

            ))}
        </ScrollView>
        </>  
    );
}