import React, {createContext, useCallback, useContext, useRef, useState} from "react";
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

    const [selectedProductInfo, setSelectedProductInfo] = useState<OpenFoodFactsProductResponse>();
    const [isLoadingProductData, setIsLoadingProductData] = useState<boolean>(false);

    function searchForBarcode(barcode:string){
        if(selectedAnimal !== ""){
            getJSON(barcode);
        }else{
            alert("Please select an animal");
        }
    }

    const currentRequestAbortController = useRef<AbortController | null>(null);
    const lastFetchedBarcode = useRef<string>("");
    const lastFetchedPromise = useRef<Promise<any> | null>(null);

    const getJSON = useCallback(async (barcode: string) => {
        // Prevent multiple calls while loading
console.log(lastFetchedPromise.current);
        if (isLoadingProductData) return;

        // Return cached result if same barcode
        if (lastFetchedPromise.current) {
            return lastFetchedPromise.current;
        }

        // Abort any ongoing request
        if (currentRequestAbortController.current) {
            currentRequestAbortController.current.abort();
        }

        currentRequestAbortController.current = new AbortController();
        lastFetchedBarcode.current = barcode;

        const fetchPromise = (async () => {
            setIsLoadingProductData(true);
            if (!barcode) {
                setIsLoadingProductData(false);
                currentRequestAbortController.current = null;
                return;
            }
            try {
                const response = await fetch(
                    `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`,
                    { signal: currentRequestAbortController.current?.signal }
                );

                // 1. HTTP-Status prüfen
                if (!response.ok) {
                    const text = await response.text();
                    console.error('HTTP error:', response.status, text);
                    Alert.alert(
                        'Error',
                        `Server returned status ${response.status}. Please try again.`
                    );
                    return;
                }

                // 2. Content-Type prüfen
                const contentType = response.headers.get('content-type');
                if (!contentType?.includes('application/json')) {
                    const text = await response.text();
                    console.error('Expected JSON, got:', contentType);
                    console.error('Response snippet:', text.slice(0, 300));
                    Alert.alert(
                        'Error',
                        'Server did not return valid JSON. Please try again.'
                    );
                    return;
                }

                // 3. JSON parsen
                const json = await response.json();

                if (json.status === 'success') {
                    try {
                        setSelectedProductInfo(json.product);
                    } catch (err) {
                        console.log(err);
                        Alert.alert(
                            'Something went wrong',
                            'This Product may not be supported.'
                        );
                    }
                } else {
                    Alert.alert(
                        'Product not found',
                        'No Product found.\nDo you want to add the product to the Database?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Yes',
                                onPress: () => {
                                    const appStoreUrl =
                                        'https://apps.apple.com/us/app/open-food-facts-product-scan/id588797948';
                                    const playStoreUrl =
                                        'https://play.google.com/store/apps/details?id=org.openfoodfacts.scanner';

                                    const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

                                    Linking.openURL(url).catch((err) =>
                                        console.error("Couldn't load page", err)
                                    );
                                },
                            },
                        ],
                        { cancelable: true }
                    );
                }
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    // Request was aborted, ignore
                    return;
                }
                console.error('Fetch error:', err);
                Alert.alert('Error', 'Failed to fetch product data. Please try again.');
            } finally {
                setIsLoadingProductData(false);
                currentRequestAbortController.current = null;
                lastFetchedPromise.current = null;
            }
        })();

        lastFetchedPromise.current = fetchPromise;
        return fetchPromise;
    }, [isLoadingProductData]);

    return (
        <ProductInfoContext.Provider
            value={{
                searchForBarcode,
                isLoadingProductData,
                selectedProductInfo,
                setSelectedProductInfo,
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