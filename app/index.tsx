import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import { useRef, useState,useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,useColorScheme  } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getWarningsVariable } from '../scripts/customScript';

const buttonBorderWidth = 1;
const buttonBorderColor = "white";
const buttonBorderRadius = 15



export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cam, setCamDirection] = useState<CameraType>("back");
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalSelectionVisible, setAnimalSelectionVisible] = useState(false);
  const [selectableAnimals, setSelectableAnimals] = useState([{label:"Dog", value:"dog"},{label:"Cat", value:"cat"},{label:"Guinea Pig", value:"guinea-pig"}]);
  var [ingredientsFound, setIngredientsFound] = useState(false)
  var [productNameView, setProductNameView] = useState(<></>);
  var [dangersView, setDangersView] = useState<string[]>([]);
  var [cautionsView, setCautionsView] = useState<string[]>([]);
  var [dangersDetails, setDangersDetails] = useState<string[]>([]);
  var [cautionsDetails, setCautionsDetails] = useState<string[]>([]);
  var [cautionsViewEmpty, setCautionsViewEmpty] = useState(true);
  var [dangersViewEmpty, setDangersViewEmpty] = useState(true);
  var [isLoadingData, setIsLoadingData] = useState(false) 
  var [detailsVisible, setDetailsVisible] = useState(false)
  var [currentManualCode, setCurrentManualCode] = useState("")
  var [darkModeActive,setDarkMode] = useState(useColorScheme()==="dark")
  const currentScannedCode = useRef("");


  var [green1, setGreen1] = useState("#9AB286");
  var [green2, setGreen2] = useState(darkModeActive?"#528b5f":"#47614d");
  var [backgroundColor, setBackgroundColor] = useState(darkModeActive?"#3D403E":"#F1F1F1");
  var [mainDisplaybackgroundColor, setMainDisplaybackgroundColor] = useState(darkModeActive?"#343434":"#E3E3E3");
  var [textColor,setTextColor] = useState(darkModeActive?"#CFCFCF":"#686868")

  const toggleDarkMode = () => {

    if(!darkModeActive){
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
    setDarkMode(!darkModeActive)
  }

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const getJSON = async () => {
    if((currentScannedCode.current || currentManualCode) && selectedAnimal){
      setIsLoadingData(true)
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

          const warnings = getWarningsVariable(json,selectedAnimal)
          
          if(warnings){
            var dangersNames: (string)[] = []
            var dangersDetails = []
            for(const danger of warnings.dangers){
              if(ingredientsTagsCollection.includes(danger.ingredient)){
                dangersNames.push(danger.name)
                dangersDetails.push(danger.note)
              }             
            }
            for(const caution of warnings.additionalDangers as { name: string; note: string }[]){
                dangersNames.push(caution.name)
                dangersDetails.push(caution.note)
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
          }
          setProductNameView(json.product.product_name)
          setIngredientsFound(true)
          setScanning(false);
        }else{
          setIngredientsFound(false)
          alert("The ingredients could not be found");
        }       
      } else {
       alert('No Product found.\n Make sure you scanned an eadable Product?');
      }
      setIsLoadingData(false)
    }else if(selectedAnimal == ""){
      alert("Select a pet");
    }      
  }  

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if(currentScannedCode.current != data){
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
      flex: 1,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraDirectionSwitcher: {
      position: 'absolute',
      padding: 7,
      zIndex: 10,
      borderColor:"white", 
      borderWidth: 2,   
      borderRadius: 999,
    },
    cameraInputSelector: {
      position: 'absolute',
      top: 20,
      left: 20,
      padding: 7,
      zIndex: 10,
      backgroundColor: darkModeActive?"#5a5a5a":"#FFFFFF",
      borderColor:darkModeActive?"#5a5a5a":"#FFFFFF", 
      borderWidth: 2,   
      borderRadius: 999,
    },
    homeButton: {
      padding: 6,
      zIndex: 10,
    },
    detailsButton: {
      position: 'absolute',
      flexDirection:"row",
      bottom: 10,
      right: 10,
      padding: 8,
      zIndex: 10,
      borderRadius:999,
      borderWidth:1,
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
      color: "black",
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
      fontSize:20,
      fontWeight:600,
      color:textColor,
    },
    detailsTitle:{
      color:green2,
      fontSize:50,
      fontWeight:800,
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
    },disclaimerText:{
      fontSize: 14,
      color:"#959595"
    },logoWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
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
            onPress={toggleDarkMode}
          >
            <Ionicons name={darkModeActive?"contrast-outline":"sunny"} size={40} color={green1}/>
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
          style={[styles.animalSelectDropdown,{borderColor: selectedAnimal?green2:"#C4C4C4",}]}
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
                <BlurView intensity={20} tint="dark" style={[styles.buttonContainer,{top: 20,left: 20,}]}>
                
                  <TouchableOpacity
                    style={styles.manualInputSelector}
                    onPress={() => setShowCamera(false)}
                  >
                    <Ionicons name="search-outline" size={30} color="white" />
                  </TouchableOpacity>
                </BlurView>
                {permission?.granted?(
                  <>
                    <CameraView
                      facing={cam}
                      onBarcodeScanned={handleBarCodeScanned}
                      style={styles.camera}
                      videoStabilizationMode="standard"
                    />       
                    <BlurView intensity={20} tint="dark" style={[styles.buttonContainer,{top: 20,right: 20,}]}>
                    
                      <TouchableOpacity
                        style={styles.cameraDirectionSwitcher}
                        onPress={() => setCamDirection(cam === 'back' ? 'front' : 'back')}
                      >
                        <Ionicons name="camera-reverse-outline" size={30} color="white" />
                      </TouchableOpacity>     
                    </BlurView>
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
                    onChangeText={(text) => {setCurrentManualCode(text)}}
                  />
                  <Pressable onPress={() => {
                    if(currentManualCode != ""){
                      getJSON()
                    }
                  }}      
                  style={{marginLeft:10}}         
                  >
                    <Ionicons name="search-outline" size={27} style={styles.manualInputButton}></Ionicons>
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
                  
                  <View style={{flex:1,margin:"8%"}}>
                    {detailsVisible?
                      <>
                        <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
                          <Text style={styles.detailsTitle}>Details</Text>
                          <View style={{height:10}}></View>
                          {dangersViewEmpty?<></>:
                            <>
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
                            </>
                          }
                          <View style={{height:"2%"}}></View>
                          {cautionsViewEmpty?<></>:
                            <>
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
                            </>
                          }
                          
                        </ScrollView>
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
                        <Text 
                          numberOfLines={2} 
                          adjustsFontSizeToFit 
                          minimumFontScale={0.8} 
                          style={styles.productTitleText}
                        >
                          {productNameView}
                        </Text>
                        <View style={{height:20}}></View>
                        <View style={{ flexDirection: 'row' }}>
                          {!dangersViewEmpty?
                            <View style={{ width: cautionsViewEmpty?'100%':"50%" }}>
                              <View style={{flexDirection:"row"}}>
                                <Ionicons name="close-circle" size={28} color="#D27777"/>
                                <Text style={[styles.warningHeaderText,{color:"#D27777"}]}>DANGER</Text>
                              </View>
                              
                              <View>
                                {dangersView.map((item, index) => (
                                  <Text key={index} style={styles.warningContentText}>
                                    {item}
                                  </Text>
                                ))}
                              </View>
                            </View>
                            :
                            <></>
                          }
                          {!cautionsViewEmpty?
                            <View style={{ width: dangersViewEmpty?'100%':"50%"}}>
                              <View style={{flexDirection:"row"}}>
                                <Ionicons name="alert-circle" size={28} color="#F1CB61"/>
                                <Text style={[styles.warningHeaderText,{color:"#F1CB61"}]}>CAUTION</Text>
                              </View>
                              
                              <View>
                                {cautionsView.map((item, index) => (
                                  <Text key={index} style={styles.warningContentText}>
                                    {item}
                                  </Text>
                                ))}
                              </View>
                            </View>
                            :
                            <></>
                          }
                        </View>
                        {(cautionsViewEmpty&&dangersViewEmpty)?
                          <>
                            <Text style={{color:"#616161",fontSize:17}}>{"No concerning ingredients found."}</Text>
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
                          <Text style={styles.disclaimerText}>{"Even if there dont show up any warnings for the food you want to feed to your pet, always do your own research and double check. We do not take responsibility for what you are feeding to your pet."}</Text>
                        </View>
                  </View>)
                }
              </>)
            }
          </>)
        }
      </View>
      <View style={{height:30}}></View>
      <View style={{alignItems: "center",}}>
        <Pressable  style={styles.scanningButton} onPress={() => {setScanning(!scanning);currentScannedCode.current = "";setCurrentManualCode("");setDetailsVisible(false)}}>
          <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>{scanning ? "Cancel" : "Scan Barcode"}</Text>
        </Pressable >
      </View>
    </SafeAreaView>
  </View>
</SafeAreaProvider>
  );

  
}
