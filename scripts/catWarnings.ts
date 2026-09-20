import {isAlcoholic, hasLactose, isVegetarian} from "@/scripts/commonFunctions";
import {AnimalTypeInfo, OpenFoodFactsProductResponse, Warnings} from "@/types/types";

export const catWarnings:Warnings = {
    key: "cat",
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
            ingredient: "onion",
            name: "Onions",
            note: "Onions contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
        },
        {
            ingredient: "garlic",
            name: "Garlic",
            note: "Garlic contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
        },
        {
            ingredient: "chive",
            name: "Chives",
            note: "Chives contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
        },
        {
            ingredient: "leek",
            name: "Leek",
            note: "Leek contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
        },
        {
            ingredient: "shallot",
            name: "Shallots",
            note: "Shallots contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
        },
        {
            ingredient: "grape",
            name: "Grapes",
            note: "Grapes cause kidney-failiure for cats."
        },
        {
            ingredient: "raisin",
            name: "Raisins",
            note: "Raisins cause kidney-failiure for cats."
        },
        {
            ingredient: "sultan",
            name: "Sultanas",
            note: "Sultanas cause kidney-failiure for cats."
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
            note: "Macadamia nuts are deadly for cats"
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
            note: "Raw Pork can be infected with the aujeszky virus disease, which is deadly for cats."
        },
        {
            ingredient: "yeast",
            name: "Yeast",
            note: "Raw yeast can expand in the cats stomach and cause breathing issues, as well as alcohol poisoning"
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
            note: "Avocado contains persin which can cause breathing problems and heart muscle weakness for cats."
        },
        {
            ingredient: "paprika",
            name: "Paprika",
            note: "Especially feeding green paprika in high volumes can cause breathing disorders, diarrhea and vomiting. The danger is reduced by cooking paprika."
        },
        {
            ingredient: "tomato",
            name: "Tomatoes",
            note: "Tomatoes contain solanin which is indigestible for cats."
        },
        {
            ingredient: "potato",
            name: "Potato",
            note: "Raw potatoes can cause breathing disorders, diarrhea and vomiting."
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
            ingredient: "salt",
            name: "Salt",
            note: "Too much salt can cause sodium poisoning for cats."
        }
    ],
    additionalDangers: [],
    additionalCautions: [],
    notes: []
};

export function getCatWarnings(productInfo: OpenFoodFactsProductResponse, animal: AnimalTypeInfo) {
    const warnings = { ...catWarnings };
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
            note: "Many cats are lactose intolerant."
        });
    }

    let vegetarian = isVegetarian(productInfo);
    let categoriesString = "";
    for (let i = 0; i < productInfo.categories_hierarchy.length; i++) {
        categoriesString = categoriesString + productInfo.categories_hierarchy[i];
    }

    if (!categoriesString.includes("beverages")) {
        if (vegetarian === true) {
            warnings.additionalCautions.push({
                name: "Vegetarian",
                note: "Cats are carnivores and should not be fed vegetarian food."
            });
        } else if (vegetarian === null) {
            warnings.notes.push({ note: "Unclear if product is vegetarian." });
        }
    }

    return warnings;
}
