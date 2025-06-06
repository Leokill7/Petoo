import { View,TouchableOpacity, Text,TextInput, StyleSheet, SafeAreaView,ScrollView ,ActivityIndicator, Pressable, Modal } from "react-native";
import { Link, Stack } from "expo-router";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState, useRef } from 'react';
import { CameraView, Camera, useCameraPermissions, CameraType } from "expo-camera";
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import {getWarningsVariable} from '../scripts/customScript'

export default function Home() {
  const useCameraPermission = useCameraPermissions()
  const [cam, setCamDirection] = useState<CameraType>("back");
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showCamera, setShowCamera] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalSelectionVisible, setAnimalSelectionVisible] = useState(false);
  const [selectableAnimals, setSelectableAnimals] = useState([{label:"Dog", value:"dog"},{label:"Cat", value:"cat"},{label:"Guinea Pig", value:"guinea-pig"}]);
  var [ingredientsFound, setIngredientsFound] = useState(false)
  var [productNameView, setProductNameView] = useState(<></>);
  var [dangersView, setDangersView] = useState(<></>);
  var [cautionsView, setCautionsView] = useState(<></>);
  var [dangersDetails, setDangersDetails] = useState(<></>);
  var [cautionsDetails, setCautionsDetails] = useState(<></>);
  var [cautionsViewEmpty, setCautionsViewEmpty] = useState(true);
  var [dangersViewEmpty, setDangersViewEmpty] = useState(true);
  var [isLoadingData, setIsLoadingData] = useState(false) 
  var [detailsVisible, setDetailsVisible] = useState(false)
  const codeScanned = useRef(false);
  const currentScannedCode = useRef("");
  if(!useCameraPermission){
    return <View><Text>xy</Text></View>;
  }

  const getJSON = async () => {
    if(currentScannedCode.current && selectedAnimal){
      setIsLoadingData(true)
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${currentScannedCode.current}.json`);

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
              setDangersView(<>{dangersNames.map((item, index) => (
                <Text key={index} style={styles.warningContentText}>
                  {item}
                </Text>
              ))}</>);
              setDangersDetails(<>{dangersDetails.map((item, index) => {
                const wordIndex = item.indexOf(dangersNames[index])==-1?item.indexOf(dangersNames[index].toLowerCase()):item.indexOf(dangersNames[index])
                const before = item.slice(0,wordIndex)
                const after = item.slice(wordIndex+dangersNames[index].length)
                return(
                  <Text key={index} style={styles.detailsInfoText}>
                    {before}<Text style={styles.detailsIngredientText}>{dangersNames[index]}</Text>{after}
                  </Text>
              )})}</>);
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
              setCautionsView(
              <>{cautionsNames.map((item, index) => (
                <Text key={index} style={styles.warningContentText}>
                  {item}
                </Text>
              ))}</>);
              setCautionsDetails(<>{cautionsDetails.map((item, index) => {
                const wordIndex = item.indexOf(cautionsNames[index])==-1?item.indexOf(cautionsNames[index].toLowerCase()):item.indexOf(cautionsNames[index])
                const before = item.slice(0,wordIndex)
                const after = item.slice(wordIndex+cautionsNames[index].length)             
                return(
                  <Text key={index} style={styles.detailsInfoText}>
                    {before}<Text style={styles.detailsIngredientText}>{cautionsNames[index]}</Text>{after}
                  </Text>
              )})}</>);
              setCautionsViewEmpty(false)
            }else{
              setCautionsViewEmpty(true)
            }           
          }
          setProductNameView(json.product.product_name)
          setIngredientsFound(true)
        }else{
          setIngredientsFound(false)
          alert("The ingredients could not be found");
        }       
      } else {
       alert('No Product found.\n Make sure you scanned an eadable Product?');
      }
      setIsLoadingData(false)
    }else if(currentScannedCode){
      alert("Select an animal");
    }      
  }     

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if(!codeScanned.current){
      codeScanned.current = true;
      setScanning(false);
      currentScannedCode.current = data;
      setManualCode(data)   
      getJSON();     
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />      
      <Text style={styles.title}>Petoo</Text>
      <View style={styles.animalSelectDropdownContainer}>
        <View>
          <DropDownPicker
            open={animalSelectionVisible}
            value={selectedAnimal}
            items={selectableAnimals}
            setOpen={setAnimalSelectionVisible}
            setValue={setSelectedAnimal}
            setItems={setSelectableAnimals}
            placeholder="Select Animal"
            listMode="SCROLLVIEW"
            style={[styles.animalSelectDropdown,{borderColor:"white"}]}
            textStyle={[{color:"white", textAlign: "center",fontSize:25,fontWeight:600}]}
            placeholderStyle={[{ fontWeight: 600 , color: "#949191" ,textAlign:"center"}]}
            dropDownContainerStyle={styles.animalSelectDropdownItem}
            showArrowIcon={false}
            showTickIcon={false}
            onChangeValue={(value)=>{
              setSelectedAnimal(value?value:"")
              getJSON()
            }}
            >
          </DropDownPicker>
        </View>
      </View>    
      <View style={styles.inputContainer}>
        {scanning ? (
          <>
            {showCamera ? (
              <>
                <CameraView
                  facing={cam}
                  onBarcodeScanned={handleBarCodeScanned}
                  style={styles.camera}
                  videoStabilizationMode="standard"
                />
                <TouchableOpacity
                  style={styles.inputTypeSwitcher}
                  onPress={() => setShowCamera(false)}
                >
                  <Ionicons name="search-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraDirectionSwitcher}
                  onPress={() => setCamDirection(cam === 'back' ? 'front' : 'back')}
                >
                  <Ionicons name="camera-reverse-outline" size={24} color="white" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.manualInputContainer}>
                <TouchableOpacity
                  style={styles.inputTypeSwitcher}
                  onPress={() => setShowCamera(true)}
                >
                  <Ionicons name="camera-outline" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.manualInput}>
                  <TextInput
                    placeholder="Enter barcode manually"
                    
                    placeholderTextColor="#aaa"
                    style={styles.textInputManual}
                    value={manualCode}
                    onChangeText={setManualCode}
                  />
                  <Pressable onPress={() => {
                    currentScannedCode.current = manualCode;
                    getJSON()
                    
                  }}
                  style={styles.manualInputButton}
                  ><Text style={{color:"white",fontSize:16,fontWeight:600}}>Search</Text></Pressable>
                </View>
              </View>
            )}
          </>
          ) : (
          <>
            {isLoadingData?(
              <View style={[{flex:1},{justifyContent: 'center'},{alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#ffffff"/>
                <Text style={[{fontSize:25},{color:"white"},{marginTop:40}]}>Retrieving Data...</Text>
              </View>):
              (<>
                {ingredientsFound?(
                  <View style={{flex:1}}>
                    <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.productTitleText}>{productNameView}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {!dangersViewEmpty?
                      <View style={{ width: cautionsViewEmpty?'100%':"50%" }}>
                        <Text style={[styles.warningHeaderText,{color:"red"}]}>Danger:</Text>
                        <View>{dangersView}</View>
                      </View>
                      :
                      <></>
                      }
                      {!cautionsViewEmpty?
                      <View style={{ width: dangersViewEmpty?'100%':"50%"}}>
                        <Text style={[styles.warningHeaderText,{color:"yellow"}]}>Caution:</Text>
                        <View>{cautionsView}</View>
                      </View>
                      :
                      <></>
                      }
                    </View>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => setDetailsVisible(true)}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                  ):(
                  <View>
                    <Text style={styles.welcomeInfoText}>{"1. Select the type of animal you want to feed.\n\n2. Scan the barcode of the product you want to feed to find out about potential warnings.\n\n\nAll infos without guarantee"}</Text>
                  </View>)
                }
              </>)
            }
          </>)
        }
      </View>
      <View style={styles.buttonContainer}>
        <Pressable  style={styles.scanningButton} onPress={() => setScanning(!scanning)}>
          <Text style={{color:"white",fontSize:18,fontWeight:700}}>{scanning ? "Cancel" : "Scan Barcode"}</Text>
        </Pressable >
      </View>
      <Modal
        animationType="slide"
        visible={detailsVisible}>
        <View style={[{flex:1},{backgroundColor:"#222"},{justifyContent: "flex-end"}]}>
          <ScrollView style={styles.detailsContainer} contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.detailsTitle}>Details</Text>
            <View style={{height:40}}></View>
            {dangersViewEmpty?<></>:
              <>
              <Text style={[styles.detailsSubHeader,{color:"red"}]}>Dangers:</Text>
              {dangersDetails}
              </>
            }
            <View style={{height:"2%"}}></View>
            {dangersViewEmpty?<></>:
              <>
              <Text style={[styles.detailsSubHeader,{color:"yellow"}]}>Caution:</Text>
              {cautionsDetails}
              </>
            }
          </ScrollView>
        </View>
        <Pressable style={styles.closeDetailsButton} onPress={() => setDetailsVisible(false)}>
          <Text style={styles.closeDetailsButtonText}>Close</Text>
        </Pressable>
      </Modal>   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "white",
    margin: 15,

  },
  inputContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",

    height: "60%",
    width: "90%",
    margin: "5%"
  },
  camera: {
    borderRadius: 15,
    overflow: 'hidden',

    height: "100%",
    width: "100%",
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
  },
  inputTypeSwitcher: {
    position: 'absolute',
    backgroundColor:"black",
    borderRadius:999,
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  cameraDirectionSwitcher: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
    backgroundColor:"black",
    borderRadius:999,
  },
  detailsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
    backgroundColor:"black",
    borderRadius:999,
  },
  detailsButtonText: {
    color:"white",
    fontSize:15,
    fontWeight:600,
    padding:3
  },
  manualInputContainer: {
    borderRadius: 15,
    overflow: 'hidden',

    height: "100%",
    width: "100%",
  },manualInput: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },manualInputButton: {
    backgroundColor:"black",
    borderColor:"white",
    borderWidth:1,
    borderRadius:10,
    height:"auto",
    width:"auto",
    padding:8
  },
  textInputManual: {
    width: '80%',
    height: 40,
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    textAlign:"center"
  },
  animalSelectDropdownContainer: {
    minHeight: 10,
    justifyContent: 'center', // vertical centering
    alignItems: 'center',     // horizontal centering
  },
  animalSelectDropdown: {
    borderColor: '#ccc',
    width:200,
    textAlign:"center",
    backgroundColor:"black"
  },
  animalSelectDropdownItem: {
    borderColor:"white",
    backgroundColor:"black",
    width:200,
  },
  welcomeInfoText:{
    textAlign:"center",
    color: "white",
    fontSize: 18,
    padding:12
  },
  productTitleText:{
    textAlign:"center",
    fontSize:40,
    fontWeight:800,
    color:"white",
    margin:10,
  },
  warningHeaderText:{
    textAlign:"center",
    fontSize:30,
    fontWeight:700,
    color:"white",
    margin:10
  },
  warningContentText:{
    textAlign:"center",
    fontSize:20,
    fontWeight:600,
    color:"white",
    margin:10
  },
  detailsContainer:{
    height:"92%",
    padding:"2%",
    paddingTop:80,
  },
  closeDetailsButton:{
    position: 'absolute',
    bottom: 40,
    right: 20,
    padding: 10,
    zIndex: 10,
    backgroundColor:"black",
    borderRadius:999,
  },
  closeDetailsButtonText:{
    color:"white",
    fontSize:19,
    fontWeight:600,
    padding:4
  },
  detailsTitle:{
    color:"white",
    fontSize:50,
    fontWeight:800,
    marginLeft:5
  },
  detailsSubHeader:{
    color:"white",
    fontSize:30,
    fontWeight:600,
    margin:10
  },detailsIngredientText:{
    color: "white",
    fontSize:25,
    fontWeight:500,
  },detailsInfoText:{
    paddingLeft:20,
    color: "white",
    fontSize:18,
    margin:10
  },scanningButton:{
    backgroundColor:"black",
    borderColor:"white",
    borderWidth:1,
    borderRadius:10,
    height:"auto",
    width:"auto",
    padding:10
  }
});
