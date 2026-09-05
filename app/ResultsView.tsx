import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTheme} from "@/context/ThemeContext";
import {createStyles} from "@/constants/Colors";
import {useProductInfo} from "@/context/ProductInfoContext";
import {useEffect, useState} from "react";
import {getWarningsVariable} from "@/scripts/customScript";
import {useAnimal} from "@/context/AnimalContext";

export default function ResultsView(){
    const {getAnimalObject} = useAnimal();
    const {colors} = useTheme();
    const styles = createStyles(colors);
    const {selectedProductInfo} = useProductInfo()
    const {selectedAnimal} = useAnimal();

    let [productNameView, setProductNameView] = useState("");
    let [dangersView, setDangersView] = useState<string[]>([]);
    let [cautionsView, setCautionsView] = useState<string[]>([]);
    let [notesView, setNotesView] = useState<string[]>([]);
    let [dangersDetails, setDangersDetails] = useState<string[]>([]);
    let [cautionsDetails, setCautionsDetails] = useState<string[]>([]);
    let [cautionsViewEmpty, setCautionsViewEmpty] = useState(true);
    let [dangersViewEmpty, setDangersViewEmpty] = useState(true);
    let [notesViewEmpty, setNotesViewEmpty] = useState(true);
    let [detailsVisible, setDetailsVisible] = useState(false)

    useEffect(() => {
        function getResultsForSelectedAnimal(){
            if(selectedProductInfo == null){
                return;
            }

            let states_tags = selectedProductInfo.states_tags;

            if(states_tags.includes("en:ingredients-completed")){
                let ingredientsTagsCollection = ""

                for(let i = 0; i < selectedProductInfo.allergens_hierarchy.length; i++){
                    ingredientsTagsCollection=ingredientsTagsCollection  + " "+(selectedProductInfo.allergens_hierarchy[i].slice(3));
                }
                for(let i = 0; i < selectedProductInfo.ingredients_tags.length; i++){
                    ingredientsTagsCollection=ingredientsTagsCollection  + " "+(selectedProductInfo.ingredients_tags[i].slice(3));
                }

                ingredientsTagsCollection = ingredientsTagsCollection + " " + (selectedProductInfo.ingredients_text_en)
                ingredientsTagsCollection = ingredientsTagsCollection.replace(/-/g, " ").toLowerCase()


                let animal = getAnimalObject()

                const warnings = getWarningsVariable(selectedProductInfo,animal)
                if(warnings){
                    let dangersNames: (string)[] = []
                    let dangersDetails = []
                    for(const danger of warnings.dangers){
                        if(ingredientsTagsCollection.includes(danger.ingredient)){

                            dangersNames.push(danger.name)
                            dangersDetails.push(danger.note)
                        }
                    }

                    for(const danger of warnings.additionalDangers as { name: string; note: string }[]){
                        dangersNames.push(danger.name)
                        dangersDetails.push(danger.note)
                    }

                    if(dangersNames.length>0){
                        setDangersView(dangersNames);
                        setDangersDetails(dangersDetails);
                        setDangersViewEmpty(false)
                    }else{
                        setDangersViewEmpty(true)
                    }

                    let cautionsNames: (string)[] = []
                    let cautionsDetails = []
                    for(const caution of warnings.cautions){
                        if(ingredientsTagsCollection.includes(caution.ingredient)){
                            cautionsNames.push(caution.name)
                            cautionsDetails.push(caution.note)
                        }
                    }
                    for(const caution of warnings.additionalCautions as { name: string; note: string }[]){
                        cautionsNames.push(caution.name)
                        cautionsDetails.push(caution.note)
                    }

                    if(cautionsNames.length>0){
                        setCautionsView(cautionsNames);
                        setCautionsDetails(cautionsDetails);
                        setCautionsViewEmpty(false)
                    }else{
                        setCautionsViewEmpty(true)
                    }

                    let notes: (string)[] = []
                    for(const note of warnings.notes as  {note: string }[]){
                        notes.push(note.note)
                    }

                    if(notes.length>0){
                        setNotesViewEmpty(false)
                        setNotesView(notes)
                    }else{
                        setNotesViewEmpty(true)
                    }
                }

                if(selectedProductInfo.product_name){
                    setProductNameView(selectedProductInfo.product_name)
                }else{
                    setProductNameView(selectedProductInfo.product_name_en)
                }
            }else{
                alert("The ingredients could not be found");
            }
        }

        if(selectedProductInfo !== undefined && selectedAnimal !== ""){
            getResultsForSelectedAnimal()
        }
    },[selectedProductInfo,selectedAnimal])



    return (
        <View>
            {detailsVisible?
                <>
                    <View style={{flex:1,margin:20}}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
                            <Text style={styles.productTitleText}>Details</Text>
                            <View style={{height:10}}></View>
                            {!dangersViewEmpty&&
                                (<>
                                    <Text style={[styles.detailsSubHeader,{color:"#D27777"}]}>DANGER</Text>
                                    {dangersDetails.map((item, index) => {
                                        const wordIndex = item.indexOf(dangersView[index])===-1?item.indexOf(dangersView[index].toLowerCase()):item.indexOf(dangersView[index])
                                        const before = item.slice(0,wordIndex)
                                        const after = item.slice(wordIndex+dangersView[index].length)
                                        return(
                                            <Text key={index} style={styles.detailsInfoText}>
                                                {before}<Text style={styles.detailsIngredientText}>{dangersView[index]}</Text>{after}
                                            </Text>
                                        )})}
                                </>)
                            }
                            <View style={{height:"2%"}}></View>
                            {!cautionsViewEmpty&&
                                (<>
                                    <Text style={[styles.detailsSubHeader,{color:"#F1CB61"}]}>CAUTION</Text>
                                    {cautionsDetails.map((item, index) => {
                                        const wordIndex = item.indexOf(cautionsView[index])===-1?item.indexOf(cautionsView[index].toLowerCase()):item.indexOf(cautionsView[index])
                                        const before = item.slice(0,wordIndex)
                                        const after = item.slice(wordIndex+cautionsView[index].length)
                                        return(
                                            <Text key={index} style={styles.detailsInfoText}>
                                                {before}<Text style={styles.detailsIngredientText}>{cautionsView[index]}</Text>{after}
                                            </Text>
                                        )})}
                                </>)
                            }

                        </ScrollView>

                    </View>
                    <TouchableOpacity
                        style={[styles.detailsButton]}
                        onPress={() => setDetailsVisible(false)}
                    >
                        <Ionicons name="chevron-back" size={20} color={colors.green2} />
                        <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                    <View style={{flex:1,margin:20}}>
                        <Text
                            numberOfLines={2}
                            adjustsFontSizeToFit
                            minimumFontScale={0.8}
                            style={styles.productTitleText}
                        >
                            {productNameView}
                        </Text>
                        <View style={{height:20}}></View>
                        <View style={{flex:1,justifyContent:"space-between",paddingBottom:50}}>
                            <View style={{ flexDirection: 'row' }}>
                                {!dangersViewEmpty&&
                                    (<View style={{ width:cautionsViewEmpty?"96%":"47%" }}>
                                        <View style={{flexDirection:"row"}}>
                                            <View style={{backgroundColor:"#D27777",borderRadius:5,marginRight:5}}>
                                                <Ionicons name="close" size={28} color="#FFFFFF"/>
                                            </View>
                                            <Text style={[styles.warningHeaderText,{color:"#D27777"}]}>DANGER</Text>
                                        </View>

                                        <View>
                                            {dangersView.map((item, index) => (
                                                <Text key={index} style={styles.warningContentText}>
                                                    {item}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>)
                                }
                                {(!cautionsViewEmpty&&!dangersViewEmpty)&&
                                    (<View style={{width:"6%"}}></View>)
                                }
                                {!cautionsViewEmpty&&
                                    (<View style={{ width:dangersViewEmpty?"96%":"47%"}}>
                                        <View style={{flexDirection:"row"}}>
                                            <View style={{backgroundColor:"#F1CB61",borderRadius:5,marginRight:5}}>
                                                <Ionicons name="alert" size={28} color="#FFFFFF"/>
                                            </View>
                                            <Text style={[styles.warningHeaderText,{color:"#F1CB61"}]}>CAUTION</Text>
                                        </View>

                                        <View>
                                            {cautionsView.map((item, index) => (
                                                <Text key={index} style={styles.warningContentText}>
                                                    {item}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>)
                                }
                            </View>
                            {notesViewEmpty?
                                <View></View>
                                :
                                <View>
                                    <Text style={[styles.disclaimerText,{fontSize:18,fontWeight:600}]}>Note</Text>
                                    {notesView.map((item, index) => (
                                        <Text key={index} style={styles.disclaimerText}>
                                            {item}
                                        </Text>
                                    ))}
                                </View>
                            }
                        </View>
                    </View>
                    {(cautionsViewEmpty&&dangersViewEmpty)?
                        <>
                            <Text style={{color:"#616161",fontSize:17,flex:1}}>{"No concerning ingredients found."}</Text>
                        </>
                        :
                        <TouchableOpacity
                            style={[styles.detailsButton]}
                            onPress={() => setDetailsVisible(true)}
                        >
                            <Text style={styles.detailsButtonText}>Details</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.green2} />
                        </TouchableOpacity>
                    }
                </>
            }
        </View>
    )
}