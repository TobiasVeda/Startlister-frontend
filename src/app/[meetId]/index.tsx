import * as livetiming from "@/scraper/livetiming/meetDetails"
import * as medley from "@/scraper/medley/meetDetails"
import {useEffect, useState} from "react";
import {ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import {Stack, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import * as date from "@/utils/date"
import {useAsync} from "@/hooks/useAsync";

export default function Index() {
    const [details, setDetails] = useState<livetiming.MeetDetails>(); // TODO: get name from ltmobil instead of medley
    const [additionalDetails, setAdditionalDetails] = useState<medley.MeetDetails>();
    const [isLoading, setIsLoading] = useState(true);
    const { meetId } = useLocalSearchParams();
        
    useAsync(async () => {
            const param = parseInt(Array.isArray(meetId) ? meetId[0] : meetId);
            setDetails(await livetiming.scrapeMeetDetails(param));
            setAdditionalDetails(await medley.scrapeMeetDetails(param));
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
                <Text>{additionalDetails?.data?.meetName}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Svømmehall: </Text>
                <Text>{additionalDetails?.data?.poolName}</Text>
            </Text>
            <Text>
                <Text style={{fontWeight: "bold"}}>Påmeldingsfrist: </Text>
                <Text>{additionalDetails?.data ? date.fromISOString(additionalDetails.data.registerDeadline) : ""}</Text>
            </Text>
            
            <Text>Søkbare Lister</Text>
            {details?.lists?.hasStartlist && <ListItem subtitle={"(TODO)"} title={"Startlister"} href={"/meet"}/>}
            {details?.lists?.hasHeatlist && <ListItem subtitle={"(TODO)"} title={"Heatlister"} href={"/disciplines"}/>}
            {details?.lists?.hasResults && <ListItem subtitle={"(TODO)"} title={"Resultater"} href={"/disciplines"}/>}
            {details?.lists?.hasFinals && <ListItem subtitle={"(TODO)"} title={"Finalelister"} href={"/meet"}/>}
            {details?.lists?.hasSchedule && <ListItem title={"Tidsskjema"} href={"/schedule"}/>}
            {details?.lists && <ListItem subtitle={"(TODO:Personer)"} title={"Klubber & Personer"} href={"/clubs"}/>}
            {details?.lists && <ListItem subtitle={"(TODO)"} title={"Livetiming"} href={"/meet"}/>}
            <Text>Eksterne Dokumenter og Koblinger</Text>
            {details?.documents?.map((x, i:number)=>(
                <ListItem key={"doc"+i} title={x.name} subtitle={x.url} href={"/"}/>

            ))}
            {additionalDetails?.documents?.map((x, i:number)=>(
                <ListItem key={"doc"+i} title={x.name} subtitle={x.url} href={"/"}/>

            ))}
        </ScrollView>
        </>  
    );
}