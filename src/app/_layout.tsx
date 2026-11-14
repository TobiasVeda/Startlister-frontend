import {Stack} from "expo-router";
import React from "react";
import {ThemeProvider} from "@/contexts/ThemeProvider";
import NavFAB from "@/components/NavFAB";


export default function RootLayout() {
    
    return (
        // includes PaperProvider
        <ThemeProvider>
            <Stack screenOptions={{headerShown: false}}/>
            <NavFAB />
        </ThemeProvider>
    );
}

