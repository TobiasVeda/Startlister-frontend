import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Icon, Text, useTheme } from 'react-native-paper';
import { useRouter, type Href } from 'expo-router';

type ListItemProps = {
    title: string;
    subtitle?: string;
    /** In-app route, e.g. "/meets/123/startlister" */
    href: Href;
    /** Any Material Community icon name */
    icon?: string;
};

export function ListItem({ title, subtitle, href, icon = 'format-list-bulleted' }: ListItemProps) {
    const router = useRouter();
    const theme = useTheme();

    return (
        <Card
            mode="elevated"
            onPress={() => router.push(href)}
            style={[styles.card]}
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
                    <Text variant="titleMedium">{title}</Text>
                    {subtitle ? (
                        <Text variant="bodySmall">
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
        // marginHorizontal: 8,
        // marginVertical: 3,
        margin: 2
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    content: {
        flex: 1,
        gap: 2,
    },
});