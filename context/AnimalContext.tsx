import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {AnimalTypeInfo} from "@/types/types";

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
        const loadSelectableAnimals = async () => {
            try {
                const storedMode = await SecureStore.getItemAsync('selectableAnimals');
                if (storedMode !== null) {
                    const parsed = JSON.parse(storedMode);
                    if(parsed != ""){
                        setSelectableAnimals(parsed);
                    }
                }
            } catch (e) {}
        };
        loadSelectableAnimals();
        getLastSelectedAnimal();
    }, []);

    useEffect(() => {
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