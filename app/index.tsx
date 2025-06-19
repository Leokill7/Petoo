import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import { useRef, useState,useEffect } from 'react';
import { Image,Switch, Keyboard,Linking, Platform,Alert,Modal,ActivityIndicator,  Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,useColorScheme  } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getWarningsVariable } from '../scripts/customScript';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';
import Toast, { BaseToast, ErrorToast , ToastProps } from 'react-native-toast-message';

const buttonBorderWidth = 1;
const buttonBorderRadius = 15

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cam, setCamDirection] = useState<CameraType>("back");
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalSelectionVisible, setAnimalSelectionVisible] = useState(false);
  const [selectableAnimals, setSelectableAnimals] = useState([{label:"Dog", value:"dog",type:"dog",lactoseOkay:false},{label:"Cat",type:"cat", value:"cat",lactoseOkay:false},{label:"Guinea Pig",type:"guinea-pig", value:"guinea-pig",lactoseOkay:false}]);
  var [ingredientsFound, setIngredientsFound] = useState(false)
  var [productNameView, setProductNameView] = useState(<></>);
  var [dangersView, setDangersView] = useState<string[]>([]);
  var [cautionsView, setCautionsView] = useState<string[]>([]);
  var [notesView, setNotesView] = useState<string[]>([]);
  var [dangersDetails, setDangersDetails] = useState<string[]>([]);
  var [cautionsDetails, setCautionsDetails] = useState<string[]>([]);
  var [cautionsViewEmpty, setCautionsViewEmpty] = useState(true);
  var [dangersViewEmpty, setDangersViewEmpty] = useState(true);
  var [notesViewEmpty, setNotesViewEmpty] = useState(true);
  var [isLoadingData, setIsLoadingData] = useState(false) 
  var [isDonationWindowLoading, setIsDonationWindowLoading] = useState(false) 
  var [detailsVisible, setDetailsVisible] = useState(false)
  var [settingsVisible, setSettingsVisible] = useState(false)
  var [donationsVisible, setDonationsVisible] = useState(false)
  var [currentManualCode, setCurrentManualCode] = useState("")
  var [darkModeActive,setDarkMode] = useState(useColorScheme()==="dark")
  const currentScannedCode = useRef("");

  var persistentDataLoaded = useRef(false)


  var [isLactoseIntolerantSelected, setIsLactoseIntolerantSelected] = useState(false)
  var [customPetName, setCustomPetName] = useState("")
  var [customePetTypeSelectionVisible, setCustomePetTypeSelectionVisible] = useState(false)
  var [customPetType, setCustomPetType] = useState("")
  var [petTypes, setPetTypes] = useState([{label:"Dog", value:"dog"},{label:"Cat", value:"cat"},{label:"Guinea Pig", value:"guinea-pig"}])

  var [deletePetNameSelectionVisible, setDeletePetNameSelectionVisible] = useState(false)
  var [deletePetName, setDeletePetName] = useState("")

  var [green1, setGreen1] = useState("#9AB286");
  var [green2, setGreen2] = useState(darkModeActive?"#528b5f":"#47614d");
  var [backgroundColor, setBackgroundColor] = useState(darkModeActive?"#3D403E":"#F1F1F1");
  var [mainDisplaybackgroundColor, setMainDisplaybackgroundColor] = useState(darkModeActive?"#343434":"#E3E3E3");
  var [textColor,setTextColor] = useState(darkModeActive?"#CFCFCF":"#686868")
  var [inputElementBorderColor, setInputElementBorderColor] = useState("#999999");

  const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: green1 ,backgroundColor: mainDisplaybackgroundColor,height:80}}
      text1Style={{fontSize: 18,fontWeight:700,color:textColor,paddingBottom:10}}
      text2Style={{fontSize: 16,fontWeight:600,color:"#959595"}}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast 
      {...props}
      style={{ borderLeftColor: '#D27777',backgroundColor: mainDisplaybackgroundColor,height:80}}
      text1Style={{fontSize: 18,fontWeight:700,color:textColor,paddingBottom:10}}
      text2Style={{fontSize: 16,fontWeight:600,color:"#959595"}}
    />
  )}

  const toggleDarkMode = (willBeActive: boolean) => {

    if(willBeActive){
      setGreen2("#528b5f")
      setMainDisplaybackgroundColor("#343434")
      setBackgroundColor("#3D403E")
      setTextColor("#CFCFCF")
    }else{
      setGreen2("#47614d")
      setMainDisplaybackgroundColor("#E3E3E3")
      setBackgroundColor("#F1F1F1")
      setTextColor("#686868")
    }
    SecureStore.setItemAsync('darkMode', JSON.stringify(willBeActive));
    setDarkMode(willBeActive)
  }

  const getAnimalObject = () => {
    return Object.values(selectableAnimals).find((item) => item["value"] === selectedAnimal);
  }

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedMode = await SecureStore.getItemAsync('darkMode');
        if (storedMode !== null) {
          const parsed = JSON.parse(storedMode);
          toggleDarkMode(parsed)
        }
      } catch (e) {}
    };
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
      loadTheme()
      persistentDataLoaded.current = true;
    }
    loadData()
    if (!permission?.granted) {
      requestPermission();
    }
    
  }, []);

  const getJSON = async () => {
    setIsLoadingData(true)
    if((currentScannedCode.current || currentManualCode) && selectedAnimal){
      var code = ""
      if(currentScannedCode.current){
        code = currentScannedCode.current
      }else{
        code = currentManualCode
      }
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);

      const json = await response.json();

      if (json.status == 1) {
        var states_tags = []
        states_tags = json.product.states_tags

        if(states_tags.includes("en:ingredients-completed")){
          var ingredientsTagsCollection = ""
          
          for(var i = 0; i < json.product.allergens_hierarchy.length; i++){
            ingredientsTagsCollection=ingredientsTagsCollection  + " "+(json.product.allergens_hierarchy[i].slice(3));
          }
          for(var i = 0; i < json.product.ingredients_tags.length; i++){
            ingredientsTagsCollection=ingredientsTagsCollection  + " "+(json.product.ingredients_tags[i].slice(3));
          }
        
          ingredientsTagsCollection = ingredientsTagsCollection + " " + (json.product.ingredients_text_en)
          ingredientsTagsCollection = ingredientsTagsCollection.replace(/-/g, " ").toLowerCase()

          var animal = getAnimalObject()

          const warnings = getWarningsVariable(json,animal)
          if(warnings){
            var dangersNames: (string)[] = []
            var dangersDetails = []
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
     
            var cautionsNames: (string)[] = []
            var cautionsDetails = []
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
            
            var notes: (string)[] = []
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
        
          if(json.product.product_name){
            setProductNameView(json.product.product_name)
          }else{
            setProductNameView(json.product.product_name_en)
          }
          
          setIngredientsFound(true)
          setScanning(false);
        }else{
          setIngredientsFound(false)
          alert("The ingredients could not be found");
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

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if(currentScannedCode.current != data){
      setIsLoadingData(true)
      currentScannedCode.current = data;
      getJSON();     
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      margin:"5%"
    },
    inputContainer: {
      backgroundColor: mainDisplaybackgroundColor,
      borderRadius:buttonBorderRadius,
      overflow: 'visible',
      alignItems: "center",
      height: "60%",
      width: "100%",
    },
    camera: {
      borderRadius: buttonBorderRadius,
      overflow: 'hidden',
      height: "100%",
      width: "100%",
    },
    buttonContainer: {
      position: 'absolute',
      zIndex:10,
      width: 50,
      height: 50,
      borderRadius: 999,
      overflow: 'hidden',
    },
    manualInputSelector: {
      top: 20,left: 20,
      position: 'absolute',
      zIndex:10,
      padding: 7,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkModeActive?"#5a5a5a":"#FFFFFF", 
    },
    cameraDirectionSwitcher: {
      top: 20,right: 20,
      position: 'absolute',
      padding: 7,
      zIndex: 10,  
      backgroundColor: darkModeActive?"#5a5a5a":"#FFFFFF", 
      borderRadius: 999,
    },
    cameraInputSelector: {
      position: 'absolute',
      top: 20,
      left: 20,
      padding: 7,
      zIndex: 10,
      backgroundColor: darkModeActive?"#5a5a5a":"#FFFFFF", 
      borderRadius: 999,
    },
    homeButton: {
      padding: 6,
      zIndex: 10,
    },
    detailsButton: {
      position: 'absolute',
      flexDirection:"row",
      bottom: 20,
      right: 20,
      padding: 8,
      zIndex: 10,
      borderRadius:999,
      borderWidth:1,
      alignItems: 'center',
      borderColor:green2,
      backgroundColor:mainDisplaybackgroundColor
    },
    detailsButtonText: {
      color:green2,
      fontSize:18,
      fontWeight:600,
      margin:"auto",
      paddingLeft:5,
      paddingRight:5,
    },manualInputContainer: {
      flex: 1,
      flexDirection:"row",
      backgroundColor: mainDisplaybackgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },manualInputButton: {
      backgroundColor:green2,
      color:"white",
      borderRadius:999,
      padding:8,
    },
    textInputManual: {
      fontSize:18,
      fontWeight:700,
      width: 220,
      height: "auto",
      backgroundColor:mainDisplaybackgroundColor,
      borderColor:"#959595",
      borderWidth:buttonBorderWidth,
      borderRadius:buttonBorderRadius,
      color: textColor,
      padding:11,
      textAlign:"center"
    },
    animalSelectDropdownContainer: {
      minHeight: 10,
    },
    animalSelectDropdown: {
      width:180,
      backgroundColor:backgroundColor,
      borderRadius:buttonBorderRadius,
      borderColor: selectedAnimal?green2:"#C4C4C4"
    },
    animalSelectDropdownItem: {
      backgroundColor:backgroundColor,
      width:180,
    },
    welcomeInfoText:{
      color: textColor,
      fontSize: 14,
    },
    productTitleText:{
      fontSize:40,
      fontWeight:800,
      color:green2,
    },
    warningHeaderText:{
      fontSize:25,
      fontWeight:900,
    },
    warningContentText:{
      paddingTop:8,
      marginTop:8,
      borderTopWidth:1,
      borderColor:"#b3b3b3",
      fontSize:20,
      fontWeight:600,
      color:textColor,
    },
    detailsTitle:{
      color:green2,
      fontSize:50,
      fontWeight:800,
      marginBottom:5
    },
    detailsSubHeader:{
      fontSize:25,
      fontWeight:900,
    },detailsIngredientText:{
      color:textColor,
      fontSize:25,
      fontWeight:500,
    },detailsInfoText:{
      color:textColor,
      fontSize:18,
      marginBottom:15,
      marginTop:5
    },scanningButton:{
      backgroundColor:green1,
      borderRadius:999,
      height:"auto",
      width:"auto",
      padding:12
    },settingsButton:{
      backgroundColor:green1,
      borderRadius:999,
      position:"absolute",
      padding:8,
      height:"auto",
      width:"auto",
    },disclaimerText:{
      fontSize: 14,
      color:"#959595"
    },logoWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },petCreationSubHeader:{
      color:textColor,
      fontSize: 19,
      fontWeight: 600,
      alignSelf:"flex-end",
      marginRight: 10
    },settingsGridElement:{
      width:"50%",
      alignItems:"center"
    },settingsGridElementContainer:{
      flexDirection:"row",
      alignItems:"center", 
      margin:10
    },animalCreateDropdown: {
      borderRadius:buttonBorderRadius,
      borderColor: deletePetName?green2:inputElementBorderColor,
      width:"50%",backgroundColor:mainDisplaybackgroundColor
    },animalCreateDropdownItem: {
      borderColor: deletePetName?green2:inputElementBorderColor,
      width:"50%",
      backgroundColor:mainDisplaybackgroundColor
    },closeModalButton:{
      height:"8%",
      backgroundColor:green1,
      width:"100%",
      alignItems:"center",
      paddingTop:8
    },settingElementContainer:{
      width:"94%",
      backgroundColor:mainDisplaybackgroundColor, 
      padding:5, 
      borderRadius:15,
      margin:"3%"
    }
  });

  return (
<SafeAreaProvider>
  <View style={{flex: 1,backgroundColor: backgroundColor,}}>
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
            onPress={() => {setScanning(false);setIngredientsFound(false);currentScannedCode.current = "";setCurrentManualCode("");setDetailsVisible(false)}}
          >
            <Ionicons name="home" size={35} color={green2}/>
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
            onPress={() => toggleDarkMode(!darkModeActive)}
          >
            <Ionicons name={darkModeActive?"contrast-outline":"sunny"} size={darkModeActive?35:40} color={green1}/>
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
          style={styles.animalSelectDropdown}
          textStyle={{color:green2,fontSize:25,fontWeight:600}}
          placeholderStyle={{ fontWeight: 600 , color: "#C4C4C4" }}
          dropDownContainerStyle={[styles.animalSelectDropdownItem,{borderColor: selectedAnimal?green2:"#C4C4C4"}]}
          showTickIcon={false}
          ArrowDownIconComponent={({ style }) => (
            <Ionicons name="caret-down" size={20} color={selectedAnimal?green2:"#C4C4C4"}/>
          )}
          ArrowUpIconComponent={({ style }) => (
            <Ionicons name="caret-up" size={20} color={selectedAnimal?green2:"#C4C4C4"}/>
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
          <>
            {showCamera ? (
              <> 
                  <TouchableOpacity
                    style={[styles.manualInputSelector,{}]}
                    onPress={() => setShowCamera(false)}
                  >
                    <Ionicons name="search" size={30} color={green1} />
                  </TouchableOpacity>
                {permission?.granted?(
                  <>
                    <CameraView
                      facing={cam}
                      onBarcodeScanned={handleBarCodeScanned}
                      style={styles.camera}
                      videoStabilizationMode="standard"
                    />       
                      <TouchableOpacity
                        style={styles.cameraDirectionSwitcher}
                        onPress={() => setCamDirection(cam === 'back' ? 'front' : 'back')}
                      >
                        <Ionicons name="camera-reverse" size={30} color={green1} />
                      </TouchableOpacity>     
                  </>
                ):(
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color:textColor ,fontSize:20,fontWeight:600,marginBottom:20}}>We need camera permission</Text>
                    <Pressable 
                      onPress={requestPermission} 
                      style={styles.scanningButton}
                    >
                      <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>Grant Permission</Text>
                    </Pressable>
                  </View>
                )}
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.cameraInputSelector}
                  onPress={() => setShowCamera(true)}
                >
                  <Ionicons name="camera" size={30} color={green1} />
                </TouchableOpacity>
                <View style={styles.manualInputContainer}>
                  <TextInput
                    placeholder="Enter barcode"
                    placeholderTextColor="#aaa"                    
                    style={styles.textInputManual}
                    value={currentManualCode}
                    autoCorrect={false}
                    onChangeText={(text) => {setCurrentManualCode(text)}}
                  />
                  <Pressable onPress={() => {
                    Keyboard.dismiss();
                    if(currentManualCode != ""){
                      getJSON()
                    }
                  }}      
                  style={{marginLeft:10}}         
                  >
                    <Ionicons name="search" size={27} style={styles.manualInputButton}></Ionicons>
                  </Pressable>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {isLoadingData?(
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#ffffff"/>
                <Text style={{fontSize:25,color:textColor,marginTop:40}}>Retrieving Data...</Text>
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
                            <Ionicons name="chevron-back" size={20} color={green2} />
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
                            <Ionicons name="chevron-forward" size={20} color={green2} />
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
          <Pressable  style={styles.scanningButton} onPress={() => {setScanning(!scanning);currentScannedCode.current = "";setCurrentManualCode("");setDetailsVisible(false)}}>
            <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>{scanning ? "Cancel" : "Scan Barcode"}</Text>
          </Pressable>
          <Pressable  style={[styles.settingsButton,{right:10}]} onPress={() => {setSettingsVisible(true)}}>
            <Ionicons name="settings" size={27} color={"#FFFFFF"} />
          </Pressable>
      </View>
      <Modal
        visible={donationsVisible}
        animationType="slide"
        onRequestClose={() => setDonationsVisible(false)} // Android back button
      >
        <View style={{flex: 1,backgroundColor: backgroundColor,alignItems: 'center',}}>
          <View style={{height:"7%"}}></View>
          <View style={{height: '85%', width:"100%", borderTopEndRadius:15, borderTopStartRadius:15,overflow: 'hidden',backgroundColor: 'white'}}>
            {isDonationWindowLoading && (
              <View style={{...StyleSheet.absoluteFillObject,backgroundColor: 'white',justifyContent: 'center',alignItems: 'center',zIndex: 1,}}>
                <ActivityIndicator size="large" color={green1} />
              </View>
            )}
            <WebView
              source={{ uri: 'https://ko-fi.com/yakoto' }}
              style={{ flex: 1}}
              onLoadStart={() => setIsDonationWindowLoading(true)}
              onLoadEnd={() => setIsDonationWindowLoading(false)}
            />
          </View>
          <Pressable  style={styles.closeModalButton} onPress={() => {setDonationsVisible(false)}}>
            <Text style={{height:"auto", fontSize:30, fontWeight:700,color:"white"}}>Close</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal
        visible={settingsVisible}
        animationType="slide"
        onRequestClose={() => setDonationsVisible(false)}
      >
        <Toast />
        <View style={{flex: 1,backgroundColor: backgroundColor,alignItems: 'center',}}>
          <View style={{height:"7%"}}></View>
          <View style={{height: '85%', width:"100%", borderTopEndRadius:15, borderTopStartRadius:15,overflow: 'hidden',backgroundColor: backgroundColor}}>
            <View style={{alignItems:"center",margin:20}}>
              <Text style={styles.productTitleText}>Settings</Text>
            </View>
            
            <Text style={{color:textColor,fontSize: 30,fontWeight: 800,alignSelf:"center"}}>Create Custom Pet</Text>
              <View style={styles.settingElementContainer}>
                <View>
                  <View style={styles.settingsGridElementContainer}>                  
                    
                  <View style={styles.settingsGridElement}>
                    <Text style={styles.petCreationSubHeader}>Pet type:</Text>
                  </View>
                  <View style={[styles.animalSelectDropdownContainer,{width:"100%"}]}>
                    <DropDownPicker
                      open={customePetTypeSelectionVisible}
                      value={customPetType}
                      items={petTypes}
                      setOpen={setCustomePetTypeSelectionVisible}
                      setValue={setCustomPetType}
                      setItems={setPetTypes}
                      placeholder="Pet type"
                      listMode="SCROLLVIEW"
                      style={[styles.animalSelectDropdown,{borderColor: customPetType?green2:inputElementBorderColor,width:"50%",backgroundColor:mainDisplaybackgroundColor}]}
                      textStyle={{color:green2,fontSize:20,fontWeight:600}}
                      placeholderStyle={{ fontWeight: 600 , color: inputElementBorderColor }}
                      dropDownContainerStyle={[styles.animalSelectDropdownItem,{borderColor: customPetType?green2:inputElementBorderColor,width:"50%",backgroundColor:mainDisplaybackgroundColor}]}
                      showTickIcon={false}
                      ArrowDownIconComponent={({ style }) => (
                        <Ionicons name="caret-down" size={20} color={customPetType?green2:inputElementBorderColor}/>
                      )}
                      ArrowUpIconComponent={({ style }) => (
                        <Ionicons name="caret-up" size={20} color={customPetType?green2:inputElementBorderColor}/>
                      )}
                    >
                    </DropDownPicker>
                  </View>
                </View>
                <View style={styles.settingsGridElementContainer}>
                  <View style={styles.settingsGridElement}>
                    <Text style={styles.petCreationSubHeader}>Pet name:</Text>
                  </View>
                  <View style={{width:"50%"}}>
                    <TextInput
                      autoCorrect={false}
                      style={[styles.textInputManual,{width:"auto",borderColor:inputElementBorderColor}]}
                      placeholderTextColor="#aaa"                    
                      value={customPetName}
                      onChangeText={setCustomPetName}
                    />
                  </View>
                </View>
                <View style={styles.settingsGridElementContainer}>
                  <View style={styles.settingsGridElement}>
                    <Text style={styles.petCreationSubHeader}>Lactose intolerant:</Text>
                  </View>
                  <View style={styles.settingsGridElement}>
                    <Switch
                      value={isLactoseIntolerantSelected}
                      onValueChange={setIsLactoseIntolerantSelected}
                      trackColor={{ false: backgroundColor, true: green1 }}
                    />
                  </View>
                </View>
                <View style={styles.settingsGridElementContainer}>
                  <View style={styles.settingsGridElement}></View>
                  <View style={styles.settingsGridElement}>
                    <Pressable  style={styles.scanningButton}  onPress={()=>{
                      Keyboard.dismiss();
                      if(customPetName !== "" && customPetType){
                        setSelectableAnimals(prevAnimals => {
                          const newValue = [...prevAnimals, { label: customPetName, value: customPetName.toLowerCase(), type:customPetType, lactoseOkay: isLactoseIntolerantSelected }];
                          SecureStore.setItemAsync('selectableAnimals', JSON.stringify(newValue));
                          return newValue
                        });
                        setIsLactoseIntolerantSelected(false)
                        setCustomPetName("")
                        setCustomPetType("")
                    
                        Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Pet "'+customPetName+'" was created.',
                        });
                      }if(!customPetType){
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: 'No pet type given.',
                        });
                      }else{
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: 'No pet name given.',
                        });
                      }
                    }}>
                      <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>Create Pet</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              
            </View> 
            <Text style={{color:textColor,fontSize: 30,fontWeight: 800,alignSelf:"center"}}>Delete Pet</Text>
            <View style={styles.settingElementContainer}>
              <View style={styles.settingsGridElementContainer}>                  
                  
                <View style={styles.settingsGridElement}>
                  <Text style={styles.petCreationSubHeader}>Pet:</Text>
                </View>
                <View style={[styles.animalSelectDropdownContainer,{width:"100%"}]}>
                  <DropDownPicker
                    open={deletePetNameSelectionVisible}
                    value={deletePetName}
                    items={selectableAnimals}
                    setOpen={setDeletePetNameSelectionVisible}
                    setValue={setDeletePetName}
                    setItems={setSelectableAnimals}
                    placeholder="Pet"
                    listMode="SCROLLVIEW"
                    style={styles.animalCreateDropdown}
                    textStyle={{color:green2,fontSize:20,fontWeight:600}}
                    placeholderStyle={{ fontWeight: 600 , color:inputElementBorderColor }}
                    dropDownContainerStyle={styles.animalCreateDropdownItem}
                    showTickIcon={false}
                    ArrowDownIconComponent={({ style }) => (
                      <Ionicons name="caret-down" size={20} color={deletePetName?green2:inputElementBorderColor}/>
                    )}
                    ArrowUpIconComponent={({ style }) => (
                      <Ionicons name="caret-up" size={20} color={deletePetName?green2:inputElementBorderColor}/>
                    )}
                    >
                  </DropDownPicker>
                </View>
              </View>
              <View style={[styles.settingsGridElementContainer,{margin:0}]}>
                <View style={styles.settingsGridElement}>
                  <Text style={styles.petCreationSubHeader}>Pet type:</Text>
                </View>
                <View style={styles.settingsGridElement}>
                  <Text style={[styles.petCreationSubHeader,{alignSelf:"center"}]}>
                    {Object.values(selectableAnimals).find((item) => item["value"] === deletePetName)?.type.charAt(0).toUpperCase()}{Object.values(selectableAnimals).find((item) => item["value"] === deletePetName)?.type.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.settingsGridElementContainer}>
                <View style={styles.settingsGridElement}></View>
                <View style={styles.settingsGridElement}>
                  <Pressable  style={styles.scanningButton}  
                    onPress={()=>{
                      if(deletePetName !== ""){
                        setSelectableAnimals( () => {
                          const newValue = selectableAnimals.filter(item => item.value !== deletePetName);
                          SecureStore.setItemAsync('selectableAnimals', JSON.stringify(newValue));
                          return newValue
                        });
                        
                        Toast.show({
                          type: 'success',
                          text1: 'Success',
                          text2: 'Animal "'+deletePetName+'" deleted.',
                        });
                        setDeletePetName("")
                      }else{
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: 'No pet selected to delete.',
                        });
                      } 
                    }}
                  >
                    <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>Delete Pet</Text>
                  </Pressable>
                </View>
              </View>
            </View> 
            <Pressable style={{position:"absolute",bottom:5,left:5}} onPress={() => Linking.openURL('https://leonard-arnold.site/petoo/Petoo_Privacy_Policy.pdf')}>
              <Text style={{ color:"#959595",padding:10}}>Privacy Policy</Text>
            </Pressable>
          </View>
          <Pressable  style={styles.closeModalButton} onPress={() => {setSettingsVisible(false)}}>
            <Text style={{height:"auto", fontSize:30, fontWeight:700,color:"white"}}>Close</Text>
          </Pressable>
        </View>
        <Toast config={toastConfig}/>
      </Modal>
    </SafeAreaView>
  </View>
</SafeAreaProvider>
  );
}
