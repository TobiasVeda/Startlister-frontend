import { Text, View, StyleSheet, TextInput } from "react-native";
import {Button, ScrollView} from "@expo/ui";
import ListItem from "@/components/ListItem";
import {Meet, scrapeMeetList} from "@/scraper/ltmobil/meetList";
import {useEffect, useState} from "react";
import * as date from "@/utils/date"
import { Stack } from "expo-router";
import {scrapeMeetDetails} from "@/scraper/livetiming/meetDetails";
import {useAsync} from "@/hooks/useAsync";

export default function Index() {
    const [search, setSearch] = useState("");
    const [meets, setMeets] = useState<Meet[]>([]);
    const [filteredMeets, setFilteredMeets] = useState<Meet[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useAsync(async () => {
        const tmp = await scrapeMeetList(2026);
        setMeets(tmp);
        setFilteredMeets(tmp);
        setIsLoading(false);
        await scrapeMeetDetails(5613);
    }, [])

    useEffect(() => { 
        setFilteredMeets(meets.filter((m:Meet)=>(m.meetName.toLowerCase().includes(search.toLowerCase())))); 
    }, [search]);
    
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
            {filteredMeets.map((m:Meet, i:number)=>(
                <ListItem key={"meet"+i} title={m.meetName} subtitle={subtitle(m.dateFrom, m.dateTo, m.location)} href={"/"}/>

            ))}

        </ScrollView>
        </>
    );
}
