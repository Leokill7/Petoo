import React from "react";
import {router, Stack} from "expo-router";
import {useTheme} from "@/context/ThemeContext";
import {Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {createStyles} from "@/constants/Colors";

export default function AppNavigator() {
    const {colors} = useTheme();
    const styles = createStyles(colors);
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Petoo",
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Settings"
                options={{
                    presentation: "modal",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: colors.backgroundColor,
                    },
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        ...styles.productTitleText,
                    },
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.back()}
                        >
                            <Ionicons name="close" size={28} color={colors.green2} />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen
                name="donation"
                options={{
                    title: "",
                    presentation: "modal",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: colors.backgroundColor,
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.back()}
                        >
                            <Ionicons name="close" size={28} color={colors.green2} />
                        </Pressable>
                    ),
                }}
            />
        </Stack>
    );
}