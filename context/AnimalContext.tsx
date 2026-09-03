import React, { createContext, useContext, useEffect, useState } from "react";
import {Alert, Linking, Platform, useColorScheme} from "react-native";
import * as SecureStore from "expo-secure-store";
import {createStyles, getColors, ThemeColors, themeColors} from '@/constants/Colors';
import {AnimalTypeInfo, OpenFoodFactsProductResponse} from "@/types/types";
import Toast from "react-native-toast-message";

type AnimalContextValue = {
    setSelectedAnimal: React.Dispatch<React.SetStateAction<string>>;
    selectedAnimal: string;
    selectableAnimals: AnimalTypeInfo[];
    setSelectableAnimals: (selectableAnimals: AnimalTypeInfo[]) => void;
    getAnimalObject: () => AnimalTypeInfo|undefined;
};

const AnimalContext = createContext<AnimalContextValue | null>(null);

export function AnimalProvider({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const [selectableAnimals, setSelectableAnimals] = useState<AnimalTypeInfo[]>([{label:"Dog", value:"dog",type:"dog",lactoseOkay:false},{label:"Cat",type:"cat", value:"cat",lactoseOkay:false},{label:"Guinea Pig",type:"guinea-pig", value:"guinea-pig",lactoseOkay:false}]);
    const [selectedAnimal, setSelectedAnimal] = useState<string>("");

    useEffect(() => {
        async function getLastSelectedAnimal(){
            setSelectedAnimal(await SecureStore.getItemAsync('selectedItem') || "");
        }
        getLastSelectedAnimal();
    }, []);

    useEffect(() => {
        console.log(selectedAnimal);
        SecureStore.setItemAsync('selectedItem', selectedAnimal);
    }, [selectedAnimal]);

    const getAnimalObject = () => {
        return Object.values(selectableAnimals).find((item) => item["value"] === selectedAnimal);
    }

    return (
        <AnimalContext.Provider
            value={{
                setSelectedAnimal,
                selectedAnimal,
                selectableAnimals,
                setSelectableAnimals,
                getAnimalObject
            }}
        >
            {children}
        </AnimalContext.Provider>
    );
}

export function useAnimal() {
    const context = useContext(AnimalContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}