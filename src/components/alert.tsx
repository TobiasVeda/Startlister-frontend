
import React, { useEffect, useState } from "react";
import {
	Alert,
	Platform,
} from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useStorage } from "@/hooks/useStorage";

export interface AlertPopupProps {
	storageKey: string;
	title: string;
	message: string;
}

export function AlertPopup({
							   storageKey,
							   title,
							   message,
						   }: AlertPopupProps) {
	const [hidden, setHidden] = useStorage<boolean>(storageKey, false);
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		if (hidden) return;

		if (Platform.OS === "web") {
			setVisible(true);
		} else {
			console.log("aaa")
			Alert.alert(
				title,
				message,
				[
					{
						text: "Ikke vis igjen",
						onPress: () => setHidden(true),
					},
					{
						text: "OK",
						style: "default",
					},
				],
				{ cancelable: true }
			);
		}
	}, [hidden, title, message]);

	const close = () => setVisible(false);

	const closeForever = () => {
		setHidden(true);
		setVisible(false);
	};

	if (Platform.OS !== "web") {
		return null;
	}

	return (
		<Portal>
			<Dialog visible={visible} onDismiss={close}>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Content>
					<Text variant="bodyMedium">{message}</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={closeForever}>
						Ikke vis igjen
					</Button>
					<Button onPress={close}>
						OK
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}
