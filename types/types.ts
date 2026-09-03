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
}