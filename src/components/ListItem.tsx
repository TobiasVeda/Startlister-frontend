import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";
import { useRouter, type Href } from "expo-router";
import { RADIUS } from "@/components/StartListItem";

type ListItemProps = {
    title: string;
    subtitle?: string;
    /** In-app route, e.g. "/meets/123/startlister" */
    href: Href;
    /** Any Material Community icon name */
    icon?: string;
    /** Square the top corners and remove the top margin, to join with the item above */
    squareTop?: boolean;
    /** Square the bottom corners and remove the bottom margin, to join with the item below */
    squareBottom?: boolean;
};

export function ListItem({
                             title,
                             subtitle,
                             href,
                             icon = "format-list-bulleted",
                             squareTop = false,
                             squareBottom = false,
                         }: ListItemProps) {
    const router = useRouter();
    const theme = useTheme();

    return (
        <Card
            mode="elevated"
            onPress={() => router.push(href)}
            style={[
                styles.card,
                {
                    borderTopLeftRadius: squareTop ? 0 : RADIUS,
                    borderTopRightRadius: squareTop ? 0 : RADIUS,
                    borderBottomLeftRadius: squareBottom ? 0 : RADIUS,
                    borderBottomRightRadius: squareBottom ? 0 : RADIUS,
                    marginTop: squareTop ? 0 : 3,
                    marginBottom: squareBottom ? 0 : undefined,
                },
            ]}
            accessibilityRole="link"
            accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
        >
            <View style={styles.row}>
                <Avatar.Icon
                    size={36}
                    icon={icon}
                    style={{ backgroundColor: theme.colors.primary }}
                />

                <View style={styles.content}>
                    <Text variant="titleMedium" numberOfLines={1}>{title}</Text>
                    {subtitle ? (
                        <Text variant="bodySmall" style={{marginVertical: -3.5}} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>

                <Avatar.Icon size={70} icon="chevron-right" color={theme.colors.primary} style={{backgroundColor: "transparent", margin: -20}}/>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 9,
        paddingHorizontal: 10,
    },
    content: {
        flex: 1,
        gap: 2,
    },
});