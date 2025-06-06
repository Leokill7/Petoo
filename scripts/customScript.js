export function getWarningsVariable(json,selectedAnimal){

    switch (selectedAnimal) {
      case "dog":
        return getDogWarnings(json);
      case "cat":          
          return getCatWarnings(json)
      case "guinea-pig":          
          break;
      default:
        break;
    }
  }



function getDogWarnings(json){

    var warnings = dogWarnings
    warnings.additionalCautions = []
    warnings.additionalDangers = []
    if(json.product.nutriments.fat_100g > 25){
        warnings.additionalCautions.push({name:"Fat", note:"The product contains much fat. This can lead to obesity, diarrhea and vomiting."})
    }

    return warnings
}

function getCatWarnings(json){

    var warnings = catWarnings
    warnings.additionalCautions = []
    warnings.additionalDangers = []

    return warnings
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
                ingredient:"alcohol",
                name:"Alcohol",
                note:"Alcohol can cause dogs to vomit, shortness of breath and coordination problems."
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
                ingredient:"milk",
                name:"Milk",
                note:"Milk can cause diarrhea and vomiting"
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
            },{
                ingredient:"mandarin",
                name:"Mandarin",
                note:"Mandarins can lead to diarrhea and vomiting."
            },{
                ingredient:"mandarin",
                name:"Mandarin",
                note:"Mandarins can lead to diarrhea and vomiting."
            }
        ],
        additionalDangers:[],
        additionalCautions: []
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
                ingredient:"alcohol",
                name:"Alcohol",
                note:"Alcohol can cause cats to vomit, shortness of breath and coordination problems."
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
                ingredient:"milk",
                name:"Milk",
                note:"Milk can cause diarrhea and vomiting"
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
            }
        ],
        additionalDangers:[],
        additionalCautions: []
    }
