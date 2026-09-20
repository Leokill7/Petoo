export function isAlcoholic(productInfo: any) {
    let categoriesString = "";
    for (let i = 0; i < productInfo.categories_tags.length; i++) {
        categoriesString = categoriesString + productInfo.categories_tags[i];
    }

    return (
        categoriesString.includes("alcoholic-beverages") ||
        categoriesString.includes("alcoholic") ||
        categoriesString.includes("wines")
    ) && !categoriesString.includes("non-alcoholic-beverages");
}

export function hasLactose(productInfo: any) {
    let categoriesString = "";
    for (let i = 0; i < productInfo.categories_tags.length; i++) {
        categoriesString = categoriesString + productInfo.categories_tags[i];
    }

    return (
        categoriesString.includes("dairy") ||
        categoriesString.includes("dairies")
    ) && !categoriesString.includes("dairy-substitutes");
}

export function isVegetarian(productInfo: any) {
    let categoriesString = "";

    if (!productInfo.ingredients_analysis_tags) {
        return null;
    }

    for (let i = 0; i < productInfo.ingredients_analysis_tags.length; i++) {
        categoriesString = categoriesString + productInfo.ingredients_analysis_tags[i];
    }

    if (categoriesString.includes("non-vegetarian")) {
        return false;
    } else if (categoriesString.includes("vegetarian-status-unknown")) {
        return null;
    } else if (categoriesString.includes("vegetarian")) {
        return true;
    }
    return null;
}