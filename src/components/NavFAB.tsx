import {Avatar, FAB, Portal} from "react-native-paper";
import React, {useMemo, useState} from "react";
import {useRouter, useSegments} from "expo-router";


export default function NavFAB() {
	const [open, setOpen] = useState<boolean>(false);
	const router = useRouter();
	const segments = useSegments();


	const routes = useMemo(() => {

		let routes = [];

		if (segments.includes("instillinger")) {
			routes.push({
				icon: 'format-list-bulleted',
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
				icon: 'abacus',
				label: 'Stevnedetaljer',
				onPress: () => router.dismissTo("/"),
			});
		}

		if (segments.includes("[meetId]")) {
			routes.push({
				icon: 'format-list-bulleted',
				label: 'Stevneliste',
				onPress: () => router.dismissTo("/"),
			})
		}

		return routes;

	}, [segments]);
	
	
	return (
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
	);
}