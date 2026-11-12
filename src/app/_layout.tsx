import {router, Stack, useSegments, useRouter} from "expo-router";
import React, {useState, useMemo} from "react";
import {StyleSheet} from 'react-native';
import {PaperProvider, FAB, Portal, MD3LightTheme, MD3DarkTheme} from "react-native-paper";


const theme = {
    ...MD3LightTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
        ...MD3LightTheme.colors,
        // primary: "#00336a",
        // surfaceVariant: "#cce6ff",
        // // elevation: "#000000",
        // primaryContainer: "#cce6ff",
        // background: "#FFFFFF",
        // secondary: "#cce6ff",
        // onSecondary: "#00336a",
    },
};


export default function RootLayout() {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const segments = useSegments();
    
    
    const routes = useMemo(() => {
        
        let routes = [];

        if (segments.includes("instillinger")) {
            routes.push({
                icon: 'home',
                label: 'Stevneliste',
                onPress: () => router.dismissTo("/"),
            });
            return routes;
        }

        routes.push({
            icon: 'cog',
            label: 'Instillinger',
            onPress: () => router.dismissTo("/instillinger"),
        })
        
        if (segments.length > 2) {
            routes.push({
                icon: 'home-outline',
                label: 'Stevnedetaljer',
                onPress: () => router.dismissTo("/"),
            });
        }
        
        if (segments.includes("[meetId]")) {
            routes.push({
                icon: 'home',
                label: 'Stevneliste',
                onPress: () => router.dismissTo("/"),
            })
        }
              
        return routes;
        
    }, [segments]);
    
    return (
      <PaperProvider theme={theme}>
        <Stack screenOptions={{headerShown: false}}/>

          <Portal>
              <FAB.Group
                  // label={"Naviger"}
                  open={open}
                  visible
                  icon={open ? 'close-circle-outline' : 'circle-expand'}
                  actions={routes}
                  onStateChange={() => {setOpen(!open)}}
              />
          </Portal>
      </PaperProvider>
    );
}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})
