import {hasLactose, isAlcoholic, isVegetarian} from "@/scripts/commonFunctions";
import {AnimalTypeInfo, OpenFoodFactsProductResponse, Warnings} from "@/types/types";

export const guineaPigWarnings:Warnings = {
    key: "guineaPig",
    dangers: [
        {
            ingredient: "potatoe",
            name: "Potatoe",
            note: "Potatoes as well as potatoe leaves and peels contain solanine which is toxic for guinea pigs."
        },
        {
            ingredient: "onion",
            name: "Onions",
            note: "Onions cause blood disorders and gastrointestinal upset for guinea pigs."
        },
        {
            ingredient: "garlic",
            name: "Garlic",
            note: "Garlic cause blood disorders and gastrointestinal upset for guinea pigs."
        },
        {
            ingredient: "chive",
            name: "Chives",
            note: "Chives cause blood disorders and gastrointestinal upset for guinea pigs."
        },
        {
            ingredient: "leek",
            name: "Leek",
            note: "Leek cause blood disorders and gastrointestinal upset for guinea pigs."
        },
        {
            ingredient: "tomato",
            name: "Tomato",
            note: "Tomato leaves and stems contain solanine which is toxic for guinea pigs. The fruit itself is okay."
        },
        {
            ingredient: "avocado",
            name: "Avocado",
            note: "Avocado contains persin which is toxic for guinea pigs."
        },
        {
            ingredient: "rhubarb",
            name: "Rhubarb",
            note: "Rhubarb leaves and stems are highly toxic which can lead to a kidney failure for guinea pigs."
        },
        {
            ingredient: "mushroom",
            name: "Mushroom",
            note: "Mushrooms can lead to toxicity pr digestive problems."
        },
        {
            ingredient: "sugar",
            name: "Sugar",
            note: "Sugar is a completly inapropriate diet and toxic for guinea pigs."
        },
        {
            ingredient: "coffee",
            name: "Coffee",
            note: "Coffee contains caffeine which causes cardiac arrhythmias and diarrhea. Untreated a small amount of caffeine can lead to death."
        },
        {
            ingredient: "caffeine",
            name: "Caffeine",
            note: "Caffeine causes cardiac arrhythmias and diarrhea. Untreated a small amount of caffeine can lead to death."
        },
    ],
    cautions: [
        {
            ingredient: "iceberg",
            name: "Iceberg lettuce",
            note: "Iceberg lettuce is low in nutrients and can cause diarrhea for guinea pigs."
        },
    ],
    additionalDangers: [],
    additionalCautions: [],
    notes: []
};

export function getGuineaPigWarnings(productInfo: OpenFoodFactsProductResponse, animal: AnimalTypeInfo) {
    const warnings = { ...guineaPigWarnings };
    warnings.additionalCautions = [];
    warnings.additionalDangers = [];
    warnings.notes = [];

    if (isAlcoholic(productInfo)) {
        warnings.additionalDangers.push({
            name: "Alcohol",
            note: "Alcohol can cause vomiting, shortness of breath and coordination problems."
        });
    }

    if (hasLactose(productInfo) && !animal.lactoseOkay) {
        warnings.additionalCautions.push({
            name: "Lactose",
            note: "Guinea pigs are lactose intolerant."
        });
    }

    let categoriesString = "";
    for (let i = 0; i < productInfo.categories_hierarchy.length; i++) {
        categoriesString = categoriesString + productInfo.categories_hierarchy[i];
    }

    if (!categoriesString.includes("beverage")) {
        let vegetarian = isVegetarian(productInfo);
        if (vegetarian === false) {
            warnings.additionalDangers.push({
                name: "Meat",
                note: "Guinea pigs are hebrivores and should not eat meat."
            });
        } else if (vegetarian === null) {
            warnings.notes.push({ note: "Vegetarian status not found" });
        }
    }

    return warnings;
}
