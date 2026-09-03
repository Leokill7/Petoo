import React, { createContext, useContext, useState } from "react";
import {Alert, Linking, Platform} from "react-native";
import {OpenFoodFactsProductResponse} from "@/types/types";
import {useAnimal} from "@/context/AnimalContext";

type ProductInfoContextValue = {
    searchForBarcode: (barcode: string) => void;
    isLoadingProductData: boolean;
    selectedProductInfo: OpenFoodFactsProductResponse | undefined;
    setSelectedProductInfo: (productInfo: OpenFoodFactsProductResponse|undefined) => void;
};

const ProductInfoContext = createContext<ProductInfoContextValue | null>(null);

export function ProductInfoProvider({
                                  children,
                              }: {
    children: React.ReactNode;
}) {
    const {selectedAnimal} = useAnimal();

    function searchForBarcode(barcode:string){
        if(selectedAnimal !== ""){
            getJSON(barcode);
        }else{
            alert("Please select an animal");
        }
    }

    const [selectedProductInfo, setSelectedProductInfo] = useState<OpenFoodFactsProductResponse>();
    const [isLoadingProductData, setIsLoadingProductData] = useState<boolean>(false);

    const getJSON = async (barcode:string) => {
        setIsLoadingProductData(true)
        if(barcode){

            const response = await fetch(`https://world.openfoodfacts.org/api/v3/product/${barcode}.json`);

            const json = await response.json();

            if (json.status === "success") {
                try{
                    setSelectedProductInfo(json.product)
                }catch(err){
                    console.log(err)
                    Alert.alert("Something went wrong","This Product may not be supported.")
                }

            } else {
                Alert.alert(
                    "Product not found",
                    "No Product found.\nDo you want to add the product to the Database?",
                    [
                        {
                            text: "Cancle",
                            style: "cancel" // makes the button look like a cancel action
                        },
                        {
                            text: "Yes",
                            onPress: () => {
                                const appStoreUrl = "https://apps.apple.com/us/app/open-food-facts-product-scan/id588797948";
                                const playStoreUrl = "https://play.google.com/store/apps/details?id=org.openfoodfacts.scanner";

                                const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

                                Linking.openURL(url).catch((err) =>
                                    console.error("Couldn't load page", err)
                                );}
                        }
                    ],
                    { cancelable: true }
                );
            }
        }
        setIsLoadingProductData(false)
    }

    return (
        <ProductInfoContext.Provider
            value={{
                searchForBarcode,
                isLoadingProductData,
                selectedProductInfo,
                setSelectedProductInfo
            }}
        >
            {children}
        </ProductInfoContext.Provider>
    );
}

export function useProductInfo() {
    const context = useContext(ProductInfoContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}