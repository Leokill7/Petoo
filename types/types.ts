export type AnimalTypeInfo =  {
    label: string,
    value: string,
    type: string,
    lactoseOkay: boolean,
}

export type OpenFoodFactsProductResponse = {
    states_tags: string[];
    allergens_hierarchy: string[];
    ingredients_tags: string[];
    ingredients_text_en: string;
    product_name: string;
    product_name_en: string;
    categories_hierarchy: string[];
    nutriments:{
        fat_100g:number,

    }
}

export type Warnings = {
    key: string,
    dangers: {ingredient: string, name: string, note: string}[],
    cautions: {ingredient: string, name: string, note: string}[],
    additionalCautions: {name: string, note: string}[],
    additionalDangers: {name: string, note: string}[],
    notes: {note: string}[],
}