import { Text, View, StyleSheet, TextInput } from "react-native";
import {Button, ScrollView} from "@expo/ui";
import {useEffect, useState} from "react";
import * as date from "@/utils/date"
import {Link, Stack} from "expo-router";
import {useAsync} from "@/hooks/useAsync";
import { apiMeetList } from "@/constants/backendEndpoints";
import {MeetListItem} from "@/components/MeetListItem";
import {List, Provider, Searchbar, useTheme} from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import {Dropdown} from "react-native-paper-dropdown";

export interface Data {
    meets: Meet[];
    validYears:number[];
}
export interface Meet {
    meetId:number;
    meetName:string;
    dateFrom:string;
    dateTo?:string;
    location:string;
}

export default function Index() {
    const currYear:string = new Date().getFullYear().toString();
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>(currYear);
    const [dropdownOptions, setDropdownOptions] = useState<{label:string; value:string;}[]>([{label: currYear, value:currYear}]);
    const [meet, setMeet] = useState<Data>({meets:[], validYears:[]});
    const [filteredMeets, setFilteredMeets] = useState<Meet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();

    useAsync(async () => {
        setIsLoading(true);
        const response = await fetch(`${apiMeetList}/${selectedYear}`);
        if (!response.ok) {
            return;
        }
        const data:Data = await response.json();
        setMeet(data);
        setFilteredMeets(data.meets);
        setIsLoading(false);
    }, [selectedYear]);

    useEffect(() => {
        setFilteredMeets(meet.meets.filter((m:Meet)=>(m.meetName.toLowerCase().includes(search.toLowerCase()))));
    }, [search, meet.meets]);


    useEffect(() => {
        const OPTIONS = meet.validYears.map((year) => ({
            label: String(year),
            value: String(year),
        }));
        setDropdownOptions(OPTIONS);
    }, [meet.validYears]);

    const OPTIONS = meet.validYears.map((year) => ({
        label: String(year),
        value: String(year),
    }));

    return (
        <>
            <Stack.Screen options={{
                title: "Stevneoversikt",
                headerRight: () =>
                    isLoading ? <View style={{ paddingRight: 16 }}><ActivityIndicator size={25} /></View> : null }}
            />
            <ScrollView>


                <View style={[styles.filters, {backgroundColor: theme.colors.surfaceVariant}]}>
                    <View style={styles.search}>
                        <Searchbar
                            placeholder="Søk i stevner"
                            value={search}
                            onChangeText={setSearch}
                            mode="view"
                            style={{ height: 56, backgroundColor: theme.colors.surfaceVariant}}
                            inputStyle={{ minHeight: 0 }}
                        />
                    </View>

                    <View style={styles.year}>
                        <Dropdown
                            label="År"
                            placeholder="Velg år"
                            options={dropdownOptions}
                            value={selectedYear}
                            onSelect={(val) => {
                                if (val) {
                                    setSelectedYear(val);
                                }
                            }}
                        />
                    </View>

                    <View style={styles.bottomBorder} pointerEvents="none" />
                </View>

                {filteredMeets?.map((m:Meet, i:number)=>(
                    <MeetListItem key={"meet"+i} data={m} />
                ))}

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    filters: {
        flexDirection: "row",
        alignItems: "center",
    },
    bottomBorder: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: StyleSheet.hairlineWidth + 0.5,
        backgroundColor: "black",
    },
    search: {
        flex: 7,

    },
    year: {
        flex: 3,

    },
});
