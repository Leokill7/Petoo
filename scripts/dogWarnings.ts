import {isAlcoholic, hasLactose} from "@/scripts/commonFunctions";
import {AnimalTypeInfo, OpenFoodFactsProductResponse, Warnings} from "@/types/types";

export const dogWarnings:Warnings = {
    key: "dog",
    dangers: [
        {
            ingredient: "chocolate",
            name: "Chocolate",
            note: "Chocolate contains cocoa which contains theobromin which causes cardiac arrhythmias, shortness of breath and diarrhea"
        },
        {
            ingredient: "cocoa",
            name: "Cocoa",
            note: "Cocoa contains theobromin which causes cardiac arrhythmias, shortness of breath and diarrhea"
        },
        {
            ingredient: "theobromin",
            name: "Theobromin",
            note: "Theobromin causes cardiac arrhythmias, shortness of breath and diarrhea"
        },
        {
            ingredient: "tomato",
            name: "Tomatoes",
            note: "Tomatoes contain solanin which is indigestible for dogs."
        },
        {
            ingredient: "eggplant",
            name: "Eggplants",
            note: "Eggplants contain solanin which is indigestible for dogs."
        },
        {
            ingredient: "onion",
            name: "Onions",
            note: "Onions contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
        },
        {
            ingredient: "garlic",
            name: "Garlic",
            note: "Garlic contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
        },
        {
            ingredient: "chive",
            name: "Chives",
            note: "Chives contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
        },
        {
            ingredient: "leek",
            name: "Leek",
            note: "Leek contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
        },
        {
            ingredient: "shallot",
            name: "Shallots",
            note: "Shallots contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
        },
        {
            ingredient: "grape",
            name: "Grapes",
            note: "Grapes cause kidney-failiure for dogs."
        },
        {
            ingredient: "raisin",
            name: "Raisins",
            note: "Raisins cause kidney-failiure for dogs."
        },
        {
            ingredient: "sultan",
            name: "Sultanas",
            note: "Sultanas cause kidney-failiure for dogs."
        },
        {
            ingredient: "coffee",
            name: "Coffee",
            note: "Coffee contains caffeine which causes cardiac arrhythmias, vomiting and diarrhea. Untreated a large amount of caffeine can lead to death."
        },
        {
            ingredient: "caffeine",
            name: "Caffeine",
            note: "Caffeine causes cardiac arrhythmias, vomiting and diarrhea. Untreated a large amount of caffeine can lead to death."
        },
        {
            ingredient: "macadamia",
            name: "Macadamia nuts",
            note: "Macadamia nuts are deadly for dogs"
        },
        {
            ingredient: "sweeten",
            name: "Sweetener",
            note: "Even small amounts of certain Sweeteners can cause a drastic drop in blood sugar levels."
        },
        {
            ingredient: "salmon",
            name: "Salmon",
            note: "Raw salmon can be infected with salmon poisoning disease, which can cause high fever, diarrhea and vomiting."
        },
        {
            ingredient: "trout",
            name: "Trout",
            note: "Raw trout can be infected with salmon poisoning disease, which can cause high fever, diarrhea and vomiting."
        },
        {
            ingredient: "pork",
            name: "Pork",
            note: "Raw Pork can be infected with the aujeszky virus disease, which is deadly for dogs."
        },
        {
            ingredient: "yeast",
            name: "Yeast",
            note: "Raw yeast can expand in the dogs stomach and cause breathing issues, as well as alcohol poisoning"
        }
    ],
    cautions: [
        {
            ingredient: "egg",
            name: "Raw Eggs",
            note: "Raw Eggs can cause salmonella poisoning especially if not cooled properly."
        },
        {
            ingredient: "avocado",
            name: "Avocado",
            note: "Avocado contains persin which can cause breathing problems and heart muscle weakness for dogs."
        },
        {
            ingredient: "paprika",
            name: "Paprika",
            note: "Especially feeding green paprika in high volumes can cause breathing disorders, diarrhea and vomiting. The danger is reduced by cooking paprika."
        },
        {
            ingredient: "potato",
            name: "Potato",
            note: "Raw potatos can cause breathing disorders, diarrhea and vomiting."
        },
        {
            ingredient: "nut",
            name: "Nuts",
            note: "Eating nuts has a risk of causing pancreatitis. MACADEMIA NUTS CAN CAUSE DEATH!"
        },
        {
            ingredient: "lemon",
            name: "Lemons",
            note: "Lemons can lead to diarrhea and vomiting."
        },
        {
            ingredient: "lime",
            name: "Limes",
            note: "Limes can lead to diarrhea and vomiting."
        },
        {
            ingredient: "orange",
            name: "Oranges",
            note: "Oranges can lead to diarrhea and vomiting."
        },
        {
            ingredient: "grapefruit",
            name: "Grapefruit",
            note: "Grapefruit can lead to diarrhea and vomiting."
        },
        {
            ingredient: "citrus",
            name: "Citrus",
            note: "Citrusfruits can lead to diarrhea and vomiting."
        },
        {
            ingredient: "mandarin",
            name: "Mandarin",
            note: "Mandarins can lead to diarrhea and vomiting."
        }
    ],
    additionalDangers: [],
    additionalCautions: [],
    notes: []
};

export function getDogWarnings(productInfo: OpenFoodFactsProductResponse, animal: AnimalTypeInfo) {
    const warnings = { ...dogWarnings };
    warnings.additionalCautions = [];
    warnings.additionalDangers = [];
    warnings.notes = [];

    if (productInfo.nutriments.fat_100g > 25) {
        warnings.additionalCautions.push({
            name: "Fat",
            note: "The product contains much fat. This can lead to obesity, diarrhea and vomiting."
        });
    }

    if (isAlcoholic(productInfo)) {
        warnings.additionalDangers.push({
            name: "Alcohol",
            note: "Alcohol can cause vomiting, shortness of breath and coordination problems."
        });
    }

    if (hasLactose(productInfo) && !animal.lactoseOkay) {
        warnings.additionalCautions.push({
            name: "Lactose",
            note: "Many dogs are lactose intolerant."
        });
    }

    return warnings;
}
