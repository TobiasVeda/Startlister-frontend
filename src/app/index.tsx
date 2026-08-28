import { Text, View, StyleSheet, TextInput } from "react-native";
import {Button, ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import {useEffect, useState} from "react";
import * as date from "@/utils/date"
import { Stack } from "expo-router";
import {useAsync} from "@/hooks/useAsync";
import { apiMeetList } from "@/constants/backendEndpoints";

export interface Data {
    meets: Meet[]
    validYears: {
        year:number,
        default:boolean
    }[]
}
export interface Meet {
    meetId:number,
    meetName:string,
    dateFrom:string,
    dateTo?:string,
    location:string
}

export default function Index() {
    const [search, setSearch] = useState("");
    const [meet, setMeet] = useState<Data>({meets:[], validYears:[]});
    const [filteredMeets, setFilteredMeets] = useState<Meet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    
    useAsync(async () => {
        const response = await fetch(apiMeetList);
        const data:Data = await response.json();
        setMeet(data);
        setFilteredMeets(data.meets);
        setIsLoading(false);
    }, [])

    useEffect(() => {
        setFilteredMeets(meet.meets.filter((m:Meet)=>(m.meetName.toLowerCase().includes(search.toLowerCase()))));
    }, [search, meet.meets]);
    
    const subtitle = (from:string, to:string, loc:string)=>{
        if (to === date.ndate){
            return date.fromISOString(from) + " " + loc;
        } else {
            return date.fromISOString(from) + " - " + date.fromISOString(to) + " " + loc;
        }
    }
    
    return (
        <>
        <Stack.Screen options={{ 
            title: "Stevneoversikt", 
            headerRight: () =>
            isLoading ? <Text>Loading...</Text> : null }} 
        />
        <ScrollView>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={"Søk i stevner"}
                placeholderTextColor={"gray"}
            />
            {filteredMeets?.map((m:Meet, i:number)=>(
                <ListItem key={"meet"+i} title={m.meetName} subtitle={subtitle(m.dateFrom, m.dateTo!, m.location)} href={"/" + m.meetId}/>

            ))}

        </ScrollView>
        </>
    );
}
