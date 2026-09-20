import {AnimalTypeInfo, OpenFoodFactsProductResponse} from "@/types/types";

import {  getDogWarnings } from './dogWarnings';
import { getCatWarnings } from './catWarnings';
import { getGuineaPigWarnings } from './guineaPigWarnings';


export function getWarningsVariable(productInfo: OpenFoodFactsProductResponse, selectedAnimalObject: AnimalTypeInfo) {
    switch (selectedAnimalObject.type) {
        case "dog":
            return getDogWarnings(productInfo, selectedAnimalObject);
        case "cat":
            return getCatWarnings(productInfo, selectedAnimalObject);
        case "guinea-pig":
            return getGuineaPigWarnings(productInfo, selectedAnimalObject);
        default:
            return null;
    }
}

