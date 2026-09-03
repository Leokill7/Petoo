import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import {useRef, useState, useEffect, useContext} from 'react';
import { Image,Switch, Keyboard,Linking, Platform,Alert,Modal,ActivityIndicator,  Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,useColorScheme  } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getWarningsVariable } from '../scripts/customScript';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';
import Toast, { BaseToast, ErrorToast , ToastProps } from 'react-native-toast-message';
import {createStyles, getColors, themeColors} from '@/constants/Colors';
import {useTheme} from "@/context/ThemeContext";
import SettingsModal from "@/app/SettingsModal";
import {AnimalTypeInfo, OpenFoodFactsProductResponse} from "@/types/types";
import DonationsModal from "@/app/DonationsModal";
import BarcodeSelection from "@/app/BarcodeSelectionElement";


export default function Home() {
    const {colors, toggleTheme, darkModeActive} = useTheme();
    const styles = createStyles(colors);

    const [selectedProductInfo, setSelectedProductInfo] = useState<OpenFoodFactsProductResponse>();
  const [scanning, setScanning] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalSelectionVisible, setAnimalSelectionVisible] = useState(false);
  const [selectableAnimals, setSelectableAnimals] = useState<AnimalTypeInfo[]>([{label:"Dog", value:"dog",type:"dog",lactoseOkay:false},{label:"Cat",type:"cat", value:"cat",lactoseOkay:false},{label:"Guinea Pig",type:"guinea-pig", value:"guinea-pig",lactoseOkay:false}]);
  let [ingredientsFound, setIngredientsFound] = useState(false)
  let [productNameView, setProductNameView] = useState("");
  let [dangersView, setDangersView] = useState<string[]>([]);
  let [cautionsView, setCautionsView] = useState<string[]>([]);
  let [notesView, setNotesView] = useState<string[]>([]);
  let [dangersDetails, setDangersDetails] = useState<string[]>([]);
  let [cautionsDetails, setCautionsDetails] = useState<string[]>([]);
  let [cautionsViewEmpty, setCautionsViewEmpty] = useState(true);
  let [dangersViewEmpty, setDangersViewEmpty] = useState(true);
  let [notesViewEmpty, setNotesViewEmpty] = useState(true);
  let [isLoadingData, setIsLoadingData] = useState(false)
  let [detailsVisible, setDetailsVisible] = useState(false)
  let [settingsVisible, setSettingsVisible] = useState(false)
  let [donationsVisible, setDonationsVisible] = useState(false)
    const [selectedBarcode, setSelectedBarcode] = useState<string>("");
  //const currentScannedCode = useRef("");

  let persistentDataLoaded = useRef(false)

  const getAnimalObject = () => {
    return Object.values(selectableAnimals).find((item) => item["value"] === selectedAnimal);
  }

    useEffect(() => {
        getResultsForSelectedAnimal()
    }, [selectedProductInfo, selectedAnimal]);

    useEffect(() => {
        getJSON();
    }, [selectedBarcode]);

  useEffect(() => {
    const loadAnimal = async () => {
      try {
        const storedMode = await SecureStore.getItemAsync('selectedItem');
        if (storedMode !== null) {
          const parsed = JSON.parse(storedMode);
          if(parsed != ""){
            setSelectedAnimal(parsed);
          } 
        }
      } catch (e) {}
    };
    const loadSelectableAnimals = async () => {
      try {
        const storedMode = await SecureStore.getItemAsync('selectableAnimals');
        if (storedMode !== null) {
          const parsed = JSON.parse(storedMode);
          if(parsed != ""){
            setSelectableAnimals(parsed);
          } 
        }
      } catch (e) {}
    };
    const loadData = async () => {
      await loadAnimal()
      loadSelectableAnimals()
      persistentDataLoaded.current = true;
    }
    loadData()

    
  }, []);
  
  function getResultsForSelectedAnimal(){
      if(selectedProductInfo == null){
          return
      }

      let states_tags = []
        states_tags = selectedProductInfo.states_tags

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
                alert(notes.length)
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

            setIngredientsFound(true)
            setScanning(false);
        }else{
            setIngredientsFound(false)
            alert("The ingredients could not be found");
        }
    }



  const getJSON = async () => {
    setIsLoadingData(true)
    if(selectedBarcode && selectedAnimal){

      const response = await fetch(`https://world.openfoodfacts.org/api/v3/product/${selectedBarcode}.json`);

      const json = await response.json();

      if (json.status == 1) {
          try{
              setSelectedProductInfo(json.product)
          }catch(err){
              console.log(err)
              Alert.alert("Something went wrong","This Product may not be supported.")
          }

      } else {
        Alert.alert(
        "Product not found",
        "No Product found.\nDo you want to add the product to the Database?",
        [
          {
            text: "Cancle",
            style: "cancel" // makes the button look like a cancel action
          },
          {
            text: "Yes",
            onPress: () => {
              const appStoreUrl = "https://apps.apple.com/us/app/open-food-facts-product-scan/id588797948";
              const playStoreUrl = "https://play.google.com/store/apps/details?id=org.openfoodfacts.scanner";

              const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

              Linking.openURL(url).catch((err) =>
              console.error("Couldn't load page", err)
            );}
          }
        ],
        { cancelable: true }
      );
      }
    }else if(selectedAnimal == "" && persistentDataLoaded.current){
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No pet selected.',
      });
    }
    setIsLoadingData(false)
  }

  return (
<SafeAreaProvider>
  <View style={{flex: 1,backgroundColor: colors.backgroundColor,}}>
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />      
      <View style={{flexDirection: 'row',
        justifyContent:"space-between",
        alignItems: 'center', // vertical alignment
        position: 'relative',height:50}}
      >
        {(!ingredientsFound&&!isLoadingData&&!scanning)?
          <View></View>
          :<TouchableOpacity
            style={styles.homeButton}
            onPress={() => {setScanning(false);setIngredientsFound(false);setDetailsVisible(false)}}
          >
            <Ionicons name="home" size={35} color={colors.green2}/>
          </TouchableOpacity>
        }
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/images/PetooLogo.png')}
            style={{ width: 160,height:50}}
            resizeMode='contain'
          ></Image> 
        </View>
        <TouchableOpacity
            style={styles.homeButton}
            onPress={() => toggleTheme()}
          >
            <Ionicons name={darkModeActive?"contrast-outline":"sunny"} size={darkModeActive?35:40} color={colors.green1}/>
          </TouchableOpacity>
        
      </View>
      <View style={{height:30}}></View>
      <View style={styles.animalSelectDropdownContainer}>
        <DropDownPicker
          open={animalSelectionVisible}
          value={selectedAnimal}
          items={selectableAnimals}
          setOpen={setAnimalSelectionVisible}
          setValue={setSelectedAnimal}
          setItems={setSelectableAnimals}
          placeholder="Select Pet"
          listMode="SCROLLVIEW"
          style={[
              styles.animalSelectDropdown,
              { borderColor: selectedAnimal ? colors.green2 : '#C4C4C4' }
          ]}
          textStyle={{color:colors.green2,fontSize:25,fontWeight:600}}
          placeholderStyle={{ fontWeight: 600 , color: "#C4C4C4" }}
          dropDownContainerStyle={[styles.animalSelectDropdownItem,{borderColor: selectedAnimal?colors.green2:"#C4C4C4"}]}
          showTickIcon={false}
          ArrowDownIconComponent={({ style }) => (
            <Ionicons name="caret-down" size={20} color={selectedAnimal?colors.green2:"#C4C4C4"}/>
          )}
          ArrowUpIconComponent={({ style }) => (
            <Ionicons name="caret-up" size={20} color={selectedAnimal?colors.green2:"#C4C4C4"}/>
          )}
          onChangeValue={(value)=>{
            setSelectedAnimal(value?value:"")
            SecureStore.setItemAsync('selectedItem', JSON.stringify(selectedAnimal));
            getJSON()
          }}
          >
        </DropDownPicker>
      </View>
      <View style={{height:20}}></View>    
      <View style={styles.inputContainer}>
        {scanning ? (
          <BarcodeSelection
            getJSON={getJSON}
            selectedBarcode={selectedBarcode}
            setSelectedBarcode={setSelectedBarcode}
            setIsLoadingData={setIsLoadingData}
          />
        ) : (
          <>
            {isLoadingData?(
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#ffffff"/>
                <Text style={{fontSize:25,color:colors.textColor,marginTop:40}}>Retrieving Data...</Text>
              </View>):
              (<>
                {ingredientsFound?(
                  
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
                                  const wordIndex = item.indexOf(dangersView[index])==-1?item.indexOf(dangersView[index].toLowerCase()):item.indexOf(dangersView[index])
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
                                  const wordIndex = item.indexOf(cautionsView[index])==-1?item.indexOf(cautionsView[index].toLowerCase()):item.indexOf(cautionsView[index])
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
                ):(
                  <View style={{margin:"7%",flex:1,justifyContent:"space-between"}}>
                    <Text style={[styles.welcomeInfoText,{fontSize:20,fontWeight:600}]}>{"Welcome"}</Text>
                    <View>
                      <Text style={[styles.disclaimerText,{fontSize:18,fontWeight:600}]}>{"Disclaimer"}</Text>
                      <Text style={styles.disclaimerText}>{"Always do your own research and double check. We do not take responsibility for what you are feeding to your pet, even if there dont show up any warnings."}</Text>
                    </View>
                  </View>)
                }
              </>)
            }
          </>)
        }
      </View>
      <View style={{height:30}}></View>
      <View style={{flexDirection:"row",alignItems: "center",justifyContent: 'center'}}>
          <Pressable  style={[styles.settingsButton,{left:10}]} onPress={() => {setDonationsVisible(true)}}>
            <Image source={require("../assets/images/donation-Logo.png")} style={{width: 25, height: 25,tintColor: "#FFFFFF",margin:1 }}/>
          </Pressable>
          <Pressable  style={styles.scanningButton} onPress={() => {setScanning(!scanning);setDetailsVisible(false)}}>
            <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>{scanning ? "Cancel" : "Scan Barcode"}</Text>
          </Pressable>
          <Pressable  style={[styles.settingsButton,{right:10}]} onPress={() => {setSettingsVisible(true)}}>
            <Ionicons name="settings" size={27} color={"#FFFFFF"} />
          </Pressable>
      </View>
        <DonationsModal setDonationsVisible={setDonationsVisible} donationsVisible={donationsVisible}/>
      <SettingsModal
          settingsVisible={settingsVisible}
          setSettingsVisible={setSettingsVisible}
          setSelectableAnimals={setSelectableAnimals}
          selectableAnimals={selectableAnimals}
      />
    </SafeAreaView>
  </View>
</SafeAreaProvider>
  );
}
