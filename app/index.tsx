import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router";
import {useState} from 'react';
import { Image,ActivityIndicator,  Pressable,  Text,  TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {createStyles} from '@/constants/Colors';
import {useTheme} from "@/context/ThemeContext";
import SettingsModal from "@/app/SettingsModal";
import DonationsModal from "@/app/DonationsModal";
import BarcodeSelection from "@/app/BarcodeSelectionElement";
import ResultsView from "@/app/ResultsView";
import {useAnimal} from "@/context/AnimalContext";
import {useProductInfo} from "@/context/ProductInfoContext";


export default function Home() {
    const {colors, toggleTheme, darkModeActive} = useTheme();
    const styles = createStyles(colors);
    const {selectedAnimal, setSelectedAnimal, selectableAnimals} = useAnimal();
    const {isLoadingProductData, selectedProductInfo,setSelectedProductInfo} = useProductInfo()

    const [scanning, setScanning] = useState(false);
    const [animalSelectionVisible, setAnimalSelectionVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false)
    const [donationsVisible, setDonationsVisible] = useState(false)


  return (
<SafeAreaProvider>
  <View style={{flex: 1,backgroundColor: colors.backgroundColor,}}>
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />      
      <View
          style={{
              flexDirection: 'row',
            justifyContent:"space-between",
            alignItems: 'center',
            position: 'relative',height:50
        }}
      >
        {(selectedProductInfo == undefined&&!isLoadingProductData&&!scanning)?
          <View></View>
          :<TouchableOpacity
            style={styles.homeButton}
            onPress={() => {setScanning(false); setSelectedProductInfo(undefined)}}
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
          }}
          >
        </DropDownPicker>
      </View>
      <View style={{height:20}}></View>    
      <View style={styles.inputContainer}>
          {scanning ? (
              <BarcodeSelection
                  setScanning={setScanning}
              />
          ) : (
              <>
                  {
                      selectedProductInfo == undefined?
                          <View style={{margin:"7%",flex:1,justifyContent:"space-between"}}>
                              <Text style={[styles.welcomeInfoText,{fontSize:20,fontWeight:600}]}>{"Welcome"}</Text>
                              <View>
                                  <Text style={[styles.disclaimerText,{fontSize:18,fontWeight:600}]}>{"Disclaimer"}</Text>
                                  <Text style={styles.disclaimerText}>{"Always do your own research and double check. We do not take responsibility for what you are feeding to your pet, even if there dont show up any warnings."}</Text>
                              </View>
                          </View>
                          :
                          <>
                              {isLoadingProductData?(
                                      <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                                          <ActivityIndicator size="large" color="#ffffff"/>
                                          <Text style={{fontSize:25,color:colors.textColor,marginTop:40}}>Retrieving Data...</Text>
                                      </View>):
                                  (<>
                                      <ResultsView/>
                                  </>)
                              }
                          </>

                  }
              </>)
          }


      </View>
      <View style={{height:30}}></View>
      <View style={{flexDirection:"row",alignItems: "center",justifyContent: 'center'}}>
          <Pressable  style={[styles.settingsButton,{left:10}]} onPress={() => {setDonationsVisible(true)}}>
            <Image source={require("../assets/images/donation-Logo.png")} style={{width: 25, height: 25,tintColor: "#FFFFFF",margin:1 }}/>
          </Pressable>
          <Pressable
              style={styles.scanningButton}
              onPress={() => {
                  if(!scanning && selectedAnimal == "") {
                      alert("Please select an animal")
                  }else{
                    setScanning(!scanning);
                  }
              }}
          >
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
      />
    </SafeAreaView>
  </View>
</SafeAreaProvider>
  );
}
