export function getWarningsVariable(json,selectedAnimalObject){

    switch (selectedAnimalObject.type) {
      case "dog":
        return getDogWarnings(json,selectedAnimalObject);
      case "cat":          
          return getCatWarnings(json,selectedAnimalObject)
      case "guinea-pig":          
          return getGuineaPigWarnings(json,selectedAnimalObject)
      default:
        break;
    }
}



function getDogWarnings(json,animal){
    var warnings = dogWarnings
    warnings.additionalCautions = []
    warnings.additionalDangers = []
    warnings.notes = []
    if(json.product.nutriments.fat_100g > 25){
        warnings.additionalCautions.push({name:"Fat", note:"The product contains much fat. This can lead to obesity, diarrhea and vomiting."})
    }
    if(isAlcoholic(json)){
        warnings.additionalDangers.push({name:"Alcohol",note:"Alcohol can cause vomiting, shortness of breath and coordination problems."})    
    }

    if(hasLactose(json) && animal.lactoseIntolerant){
        warnings.additionalCautions.push({name:"Lactose",note:"Many dogs are lactose intolerant."})    
    }
    return warnings
}

function getCatWarnings(json,animal){

    var warnings = catWarnings
    warnings.additionalCautions = []
    warnings.additionalDangers = []
    warnings.notes = []
    if(isAlcoholic(json)){
        warnings.additionalDangers.push({name:"Alcohol",note:"Alcohol can cause vomiting, shortness of breath and coordination problems."})    
    }
    if(hasLactose(json) && animal.lactoseIntolerant){
        warnings.additionalCautions.push({name:"Lactose",note:"Many cats are lactose intolerant."})    
    }

    var vegeterian = isVegeterian(json)
    warnings.notes.push({note:vegeterian})
    var catergoriesString = ""
    for(var i = 0; i < json.product.categories_hierarchy.length;i++){
        catergoriesString = catergoriesString + json.product.categories_hierarchy[i];
    }

    if(catergoriesString.includes("beverages") == false){
        if(vegeterian === true){
            warnings.additionalCautions.push({name:"Vegetarian",note:"Cats are carnivores and should not be fed vegetarian food."})    
        }else if(vegeterian === null){
            warnings.notes.push({note:"Vegetarian status not found!"})
        }
    }
    
    return warnings
}

function getGuineaPigWarnings(json,animal){

    var warnings = guineaPigsWarnings
    warnings.additionalCautions = []
    warnings.additionalDangers = []
    warnings.notes = []
    if(isAlcoholic(json)){
        warnings.additionalDangers.push({name:"Alcohol",note:"Alcohol can cause vomiting, shortness of breath and coordination problems."})    
    }

    if(hasLactose(json) && animal.lactoseIntolerant){
        warnings.additionalCautions.push({name:"Lactose",note:"Guinea pigs are lactose intolerant."})    
    }

    var catergoriesString = ""
    for(var i = 0; i < json.product.categories_hierarchy.length;i++){
        catergoriesString = catergoriesString + json.product.categories_hierarchy[i];
    }

    if(!catergoriesString.includes("beverage")){
        var vegeterian = isVegeterian(json)
        if(vegeterian === false){
            warnings.additionalDangers.push({name:"Meat",note:"Guinea pigs are hebrivores and should not eat meat."})    
        }else if(vegeterian === null){
            warnings.notes.push({note:"Vegetarian status not found"})
        }
    }

    return warnings
}

function isAlcoholic(json){
    categoriesString = ""
    for(var  i = 0; i < json.product.categories_tags.length;i++){
        categoriesString = categoriesString + json.product.categories_tags[i]
    }

    if((categoriesString.includes("alcoholic-beverages")||categoriesString.includes("alcoholic")||categoriesString.includes("wines"))&& categoriesString.includes("!non-alcoholic-beverages")){
        return true;
    }
    return false;
}

function isVegeterian(json){
    categoriesString = ""

    if(!json.product.ingredients_analysis_tags){
        return null
    }

    for(var  i = 0; i < json.product.ingredients_analysis_tags.length;i++){
        categoriesString = categoriesString + json.product.ingredients_analysis_tags[i]
    }

    if(categoriesString.includes("non-vegetarian")){
        return false
    }else if(categoriesString.includes("vegetarian-status-unknown")){
        return null
    }
    else if(categoriesString.includes("vegetarian")){
        return true
    }
    return null;
}

function hasLactose(json){
    categoriesString = ""
    for(var  i = 0; i < json.product.categories_tags.length;i++){
        categoriesString = categoriesString + json.product.categories_tags[i]
    }

    if((categoriesString.includes("dairy")||categoriesString.includes("dairies")) && !categoriesString.includes("dairy-substitutes")){
        return true;
    }
    return false;
}


const dogWarnings= 
  
    {
        key:"dog",
        dangers:[
            {
                ingredient:"chocolate",
                name:"Chocolate",
                note:"Chocolate contains cocoa which contains theobromin which causes cardiac arrhythmias, shortness of breath and diarrhea"
            },{
                ingredient:"cocoa",
                name:"Cocoa",
                note:"Cocoa contains theobromin which causes cardiac arrhythmias, shortness of breath and diarrhea"
            },{
                ingredient:"theobromin",
                name:"Theobromin",
                note:"Theobromin causes cardiac arrhythmias, shortness of breath and diarrhea"
            },{
                ingredient:"tomato",
                name:"Tomatos",
                note:"Tomatos contain solanin which is indigestible for dogs."
            },{
                ingredient:"eggplant",
                name:"Eggplants",
                note:"Eggplants contain solanin which is indigestible for dogs."
            },{
                ingredient:"onion",
                name:"Onions",
                note:"Onions contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
            },{
                ingredient:"garlic",
                name:"Garlic",
                note:"Garlic contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
            },{
                ingredient:"chive",
                name:"Chives",
                note:"Chives contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
            },{
                ingredient:"leek",
                name:"Leek",
                note:"Leek contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
            },{
                ingredient:"shallot",
                name:"Shallots",
                note:"Shallots contain amino acids which destroy the red blood cells of dogs which causes anemia and can cause death."
            },{
                ingredient:"grape",
                name:"Grapes",
                note:"Grapes cause kidney-failiure for dogs."
            },{
                ingredient:"raisin",
                name:"Raisins",
                note:"Raisins cause kidney-failiure for dogs."
            },{
                ingredient:"sultan",
                name:"Sultanas",
                note:"Sultanas cause kidney-failiure for dogs."
            },{
                ingredient:"coffee",
                name:"Coffee",
                note:"Coffee contains caffeine which causes cardiac arrhythmias, vomiting and diarrhea. Untreated a large amount of caffeine can lead to death."
            },{
                ingredient:"caffeine",
                name:"Coffee",
                note:"Caffeine causes cardiac arrhythmias, vomiting and diarrhea. Untreated a large amount of caffeine can lead to death."
            },{
                ingredient:"macadamia",
                name:"Macadamia nuts",
                note:"Macadamia nuts are deadly for dogs"
            },{
                ingredient:"sweeten",
                name:"Sweetener",
                note:"Even small amounts of certain Sweeteners can cause a drastic drop in blood sugar levels."
            },{
                ingredient:"salmon",
                name:"Salmon",
                note:"Raw salmon can be infected with salmon poisoning disease, which can cause high fever, diarrhea and vomiting."
            },{
                ingredient:"trout",
                name:"Trout",
                note:"Raw trout can be infected with salmon poisoning disease, which can cause high fever, diarrhea and vomiting."
            },{
                ingredient:"pork",
                name:"Pork",
                note:"Raw Pork can be infected with the aujeszky virus disease, which is deadly for dogs."
            },{
                ingredient:"yeast",
                name:"Yeast",
                note:"Raw yeast can expand in the cats stomach and cause breathing issues, as well as alcohol poisoning"
            }
        ],
        cautions:[
            {
                ingredient:"egg",
                name:"Raw Eggs",
                note:"Raw Eggs can cause salmonella poisoning especially if not cooled properly."
            },{
                ingredient:"avocado",
                name:"Avocado",
                note:"Avocado contains persin which causes breathing problems and heart muscle weakness for dogs."
            },{
                ingredient:"paprika",
                name:"Paprika",
                note:"Especially feeding green paprika in high volumes can cause breathing disorders, diarrhea and vomiting. The danger is reduced by cooking paprika."
            },{
                ingredient:"potato",
                name:"Potato",
                note:"Raw potatos can cause breathing disorders, diarrhea and vomiting."
            },{
                ingredient:"nut",
                name:"Nuts",
                note:"Eating nuts has a risk of causing pancreatitis. MACADEMIA NUTS CAN CAUSE DEATH!"
            },{
                ingredient:"lemon",
                name:"Lemons",
                note:"Lemons can lead to diarrhea and vomiting."
            },{
                ingredient:"lime",
                name:"Limes",
                note:"Limes can lead to diarrhea and vomiting."
            },{
                ingredient:"orange",
                name:"Oranges",
                note:"Oranges can lead to diarrhea and vomiting."
            },{
                ingredient:"grapefruit",
                name:"Grapefruit",
                note:"Grapefruit can lead to diarrhea and vomiting."
            },{
                ingredient:"citrus",
                name:"Citrus",
                note:"Citrusfruits can lead to diarrhea and vomiting."
            },{
                ingredient:"mandarin",
                name:"Mandarin",
                note:"Mandarins can lead to diarrhea and vomiting."
            }
        ],
        additionalDangers:[],
        additionalCautions: [],
        notes:[]
    }
const catWarnings= 
  
    {
        key:"cat",
        dangers:[
            {
                ingredient:"chocolate",
                name:"Chocolate",
                note:"Chocolate contains cocoa which contains theobromin which causes cardiac arrhythmias, shortness of breath and diarrhea"
            },{
                ingredient:"cocoa",
                name:"Cocoa",
                note:"Cocoa contains theobromin which causes cardiac arrhythmias, shortness of breath and diarrhea"
            },{
                ingredient:"theobromin",
                name:"Theobromin",
                note:"Theobromin causes cardiac arrhythmias, shortness of breath and diarrhea"
            },{
                ingredient:"onion",
                name:"Onions",
                note:"Onions contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
            },{
                ingredient:"garlic",
                name:"Garlic",
                note:"Garlic contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
            },{
                ingredient:"chive",
                name:"Chives",
                note:"Chives contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
            },{
                ingredient:"leek",
                name:"Leek",
                note:"Leek contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
            },{
                ingredient:"shallot",
                name:"Shallots",
                note:"Shallots contain amino acids which destroy the red blood cells of cats which causes anemia and can cause death."
            },{
                ingredient:"grape",
                name:"Grapes",
                note:"Grapes cause kidney-failiure for cats."
            },{
                ingredient:"raisin",
                name:"Raisins",
                note:"Raisins cause kidney-failiure for cats."
            },{
                ingredient:"sultan",
                name:"Sultanas",
                note:"Sultanas cause kidney-failiure for cats."
            },{
                ingredient:"coffee",
                name:"Coffee",
                note:"Coffee contains caffeine which causes cardiac arrhythmias, vomiting and diarrhea. Untreated a large amount of caffeine can lead to death."
            },{
                ingredient:"caffeine",
                name:"Coffee",
                note:"Caffeine causes cardiac arrhythmias, vomiting and diarrhea. Untreated a large amount of caffeine can lead to death."
            },{
                ingredient:"macadamia",
                name:"Macadamia nuts",
                note:"Macadamia nuts are deadly for cats"
            },{
                ingredient:"sweeten",
                name:"Sweetener",
                note:"Even small amounts of certain Sweeteners can cause a drastic drop in blood sugar levels."
            },{
                ingredient:"salmon",
                name:"Salmon",
                note:"Raw salmon can be infected with salmon poisoning disease, which can cause high fever, diarrhea and vomiting."
            },{
                ingredient:"trout",
                name:"Trout",
                note:"Raw trout can be infected with salmon poisoning disease, which can cause high fever, diarrhea and vomiting."
            },{
                ingredient:"pork",
                name:"Pork",
                note:"Raw Pork can be infected with the aujeszky virus disease, which is deadly for cats."
            },{
                ingredient:"yeast",
                name:"Yeast",
                note:"Raw yeast can expand in the cats stomach and cause breathing issues, as well as alcohol poisoning"
            }
        ],
        cautions:[
            {
                ingredient:"egg",
                name:"Raw Eggs",
                note:"Raw Eggs can cause salmonella poisoning especially if not cooled properly."
            },{
                ingredient:"avocado",
                name:"Avocado",
                note:"Avocado contains persin which causes breathing problems and heart muscle weakness for cats."
            },{
                ingredient:"paprika",
                name:"Paprika",
                note:"Especially feeding green paprika in high volumes can cause breathing disorders, diarrhea and vomiting. The danger is reduced by cooking paprika."
            },{
                ingredient:"tomato",
                name:"Tomatos",
                note:"Tomatos contain solanin which is indigestible for dogs."
            },{
                ingredient:"potato",
                name:"Potato",
                note:"Raw potatos can cause breathing disorders, diarrhea and vomiting."
            },{
                ingredient:"nut",
                name:"Nuts",
                note:"Eating nuts has a risk of causing pancreatitis. MACADEMIA NUTS CAN CAUSE DEATH!"
            },{
                ingredient:"lemon",
                name:"Lemons",
                note:"Lemons can lead to diarrhea and vomiting."
            },{
                ingredient:"lime",
                name:"Limes",
                note:"Limes can lead to diarrhea and vomiting."
            },{
                ingredient:"orange",
                name:"Oranges",
                note:"Oranges can lead to diarrhea and vomiting."
            },{
                ingredient:"grapefruit",
                name:"Grapefruit",
                note:"Grapefruit can lead to diarrhea and vomiting."
            },{
                ingredient:"citrus",
                name:"Citrus",
                note:"Citrusfruits can lead to diarrhea and vomiting."
            },{
                ingredient:"salt",
                name:"Salt",
                note:"Too much salt can cause sodium poisoning for cats."
            }
        ],
        additionalDangers:[],
        additionalCautions: [],
        notes:[]
    }

const guineaPigsWarnings= 
  
    {
        key:"guineaPig",
        dangers:[
            {
                ingredient:"potatoe",
                name:"Potatoe",
                note:"Potatoes as well as potatoe leaves and peels contain solanine which is toxic for guinea pigs."
            },{
                ingredient:"onion",
                name:"Onions",
                note:"Onions cause blood disorders and gastrointestinal upset for guinea pigs."
            },{
                ingredient:"garlic",
                name:"Garlic",
                note:"Garlic cause blood disorders and gastrointestinal upset for guinea pigs."
            },{
                ingredient:"chive",
                name:"Chives",
                note:"Chives cause blood disorders and gastrointestinal upset for guinea pigs."
            },{
                ingredient:"leek",
                name:"Leek",
                note:"Leek cause blood disorders and gastrointestinal upset for guinea pigs."
            },{
                ingredient:"tomato",
                name:"Tomato",
                note:"Tomato leaves and stems contain solanine which is toxic for guinea pigs. The fruit itself is okay."
            },{
                ingredient:"avocado",
                name:"Avocado",
                note:"Avocado contains persin which is toxic for guinea pigs."
            },{
                ingredient:"rhubarb",
                name:"Rhubarb",
                note:"Rhubarb leaves and stems are highly toxic which can lead to a kidney failure for guinea pigs."
            },{
                ingredient:"mushroom",
                name:"Mushroom",
                note:"Mushrooms can lead to toxicity pr digestive problems."
            },{
                ingredient:"rhubarb",
                name:"Rhubarb",
                note:"Rhubarb leaves and stems are highly toxic which can lead to a kidney failure for guinea pigs."
            },{
                ingredient:"sugar",
                name:"Sugar",
                note:"Sugar is a completly inapropriate diet and toxic for guinea pigs."
            },{
                ingredient:"coffee",
                name:"Coffee",
                note:"Coffee contains caffeine which causes cardiac arrhythmias and diarrhea. Untreated a small amount of caffeine can lead to death."
            },{
                ingredient:"caffeine",
                name:"Coffee",
                note:"Caffeine causes cardiac arrhythmias and diarrhea. Untreated a small amount of caffeine can lead to death."
            },
        ],
        cautions:[
            {
                ingredient:"iceberg",
                name:"Iceberg lettuce",
                note:"Iceberg lettuce is low in nutrients and can cause diarrhea for guinea pigs."
            },
        ],
        additionalDangers:[],
        additionalCautions: [],
        notes:[]
    }
