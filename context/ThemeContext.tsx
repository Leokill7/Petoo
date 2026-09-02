import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import {createStyles, getColors, ThemeColors, themeColors} from '@/constants/Colors';

type ThemeContextValue = {
    darkModeActive: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
                                  children,
                              }: {
    children: React.ReactNode;
}) {
    const systemScheme = useColorScheme();
    const [darkModeActive, setDarkModeActive] = useState(systemScheme === "dark");

    useEffect(() => {
        SecureStore.getItemAsync("darkMode").then((value) => {
            if (value !== null) {
                setDarkModeActive(JSON.parse(value));
            }
        });
    }, []);


    const toggleTheme = async () => {
        const nextValue = !darkModeActive;

        setDarkModeActive(nextValue);

        await SecureStore.setItemAsync(
            "darkMode",
            JSON.stringify(nextValue)
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                darkModeActive,
                colors: getColors(darkModeActive),
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}