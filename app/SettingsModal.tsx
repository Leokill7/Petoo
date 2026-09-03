import Toast, {BaseToast, ErrorToast, ToastProps} from "react-native-toast-message";
import {Keyboard, Linking, Modal, Pressable, ScrollView, Switch, Text, TextInput, View} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {Ionicons} from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import {useTheme} from "@/context/ThemeContext";
import {createStyles} from '@/constants/Colors';
import {useState} from "react";
import {useAnimal} from "@/context/AnimalContext";

export default function SettingsModal(
    {settingsVisible, setSettingsVisible}
    :
    {
        settingsVisible:boolean,
        setSettingsVisible:(arg0:boolean) => void
    }
) {
    const {colors} = useTheme();
    const styles = createStyles(colors);
    const {selectableAnimals, setSelectableAnimals} = useAnimal();

    const [animalSelectionVisible, setAnimalSelectionVisible] = useState(false);
    const [isLactoseIntolerantSelected, setIsLactoseIntolerantSelected] = useState(false)
    const [customPetName, setCustomPetName] = useState("")
    const [customePetTypeSelectionVisible, setCustomePetTypeSelectionVisible] = useState(false)
    const [customPetType, setCustomPetType] = useState("")
    const [petTypes, setPetTypes] = useState([{label:"Dog", value:"dog"},{label:"Cat", value:"cat"},{label:"Guinea Pig", value:"guinea-pig"}])

    const [deletePetNameSelectionVisible, setDeletePetNameSelectionVisible] = useState(false)
    const [deletePetName, setDeletePetName] = useState("")


    const toastConfig = {
        success: (props: ToastProps) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: colors.green1 ,backgroundColor: colors.mainDisplaybackgroundColor,height:80}}
                text1Style={{fontSize: 18,fontWeight:700,color:colors.textColor,paddingBottom:10}}
                text2Style={{fontSize: 16,fontWeight:600,color:"#959595"}}
            />
        ),
        error: (props: ToastProps) => (
            <ErrorToast
                {...props}
                style={{ borderLeftColor: '#D27777',backgroundColor: colors.mainDisplaybackgroundColor,height:80}}
                text1Style={{fontSize: 18,fontWeight:700,color:colors.textColor,paddingBottom:10}}
                text2Style={{fontSize: 16,fontWeight:600,color:"#959595"}}
            />
        )}

    return(
        <Modal
            visible={settingsVisible}
            animationType="slide"
            onRequestClose={() => setSettingsVisible(false)}
        >
            <Toast />
            <View style={{flex: 1,backgroundColor: colors.backgroundColor,alignItems: 'center',}}>
                <View style={{height:"7%"}}></View>
                <View style={{height: '85%', width:"100%", borderTopEndRadius:15, borderTopStartRadius:15,overflow: 'hidden',backgroundColor: colors.backgroundColor}}>
                    <View style={{alignItems:"center",margin:20}}>
                        <Text style={styles.productTitleText}>Settings</Text>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
                        <Text style={{color:colors.textColor,fontSize: 30,fontWeight: 800,alignSelf:"center"}}>Create Custom Pet</Text>
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
                                            onOpen={()=>{
                                                setAnimalSelectionVisible(false)
                                                setDeletePetNameSelectionVisible(false)
                                            }}
                                            setItems={setPetTypes}
                                            placeholder="Pet type"
                                            listMode="SCROLLVIEW"
                                            style={[styles.animalSelectDropdown,{borderColor: customPetType?colors.green2:colors.inputElementBorderColor,width:"50%",backgroundColor:colors.mainDisplaybackgroundColor}]}
                                            textStyle={{color:colors.green2,fontSize:20,fontWeight:600}}
                                            placeholderStyle={{ fontWeight: 600 , color: colors.inputElementBorderColor }}
                                            dropDownContainerStyle={[styles.animalSelectDropdownItem,{borderColor: customPetType?colors.green2:colors.inputElementBorderColor,width:"50%",backgroundColor:colors.mainDisplaybackgroundColor}]}
                                            showTickIcon={false}
                                            ArrowDownIconComponent={({ style }) => (
                                                <Ionicons name="caret-down" size={20} color={customPetType?colors.green2:colors.inputElementBorderColor}/>
                                            )}
                                            ArrowUpIconComponent={({ style }) => (
                                                <Ionicons name="caret-up" size={20} color={customPetType?colors.green2:colors.inputElementBorderColor}/>
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
                                            style={[styles.textInputManual,{width:"auto",borderColor:colors.inputElementBorderColor}]}
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
                                            trackColor={{ false: colors.backgroundColor, true: colors.green1 }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.settingsGridElementContainer}>
                                    <View style={styles.settingsGridElement}></View>
                                    <View style={styles.settingsGridElement}>
                                        <Pressable  style={styles.scanningButton}  onPress={()=>{
                                            Keyboard.dismiss();
                                            if(customPetName !== "" && customPetType){
                                                const newValue = [...selectableAnimals, { label: customPetName, value: customPetName.toLowerCase(), type:customPetType, lactoseOkay: isLactoseIntolerantSelected }];
                                                setSelectableAnimals(newValue);
                                                SecureStore.setItemAsync('selectableAnimals', JSON.stringify(newValue));

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
                        <Text style={{color:colors.textColor,fontSize: 30,fontWeight: 800,alignSelf:"center"}}>Delete Pet</Text>
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
                                        onOpen={()=>{
                                            setCustomePetTypeSelectionVisible(false)
                                            setAnimalSelectionVisible(false)
                                        }}

                                        placeholder="Pet"
                                        listMode="SCROLLVIEW"
                                        style={[styles.animalCreateDropdown,{borderColor: deletePetName ? colors.green2 : colors.inputElementBorderColor}]}
                                        textStyle={{color:colors.green2,fontSize:20,fontWeight:600}}
                                        placeholderStyle={{ fontWeight: 600 , color:colors.inputElementBorderColor }}
                                        dropDownContainerStyle={[styles.animalCreateDropdownItem,{borderColor: deletePetName ? colors.green2 : colors.inputElementBorderColor}]}
                                        showTickIcon={false}
                                        ArrowDownIconComponent={({ style }) => (
                                            <Ionicons name="caret-down" size={20} color={deletePetName?colors.green2:colors.inputElementBorderColor}/>
                                        )}
                                        ArrowUpIconComponent={({ style }) => (
                                            <Ionicons name="caret-up" size={20} color={deletePetName?colors.green2:colors.inputElementBorderColor}/>
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
                                                        const newValue = selectableAnimals.filter(item => item.value !== deletePetName);
                                                        setSelectableAnimals(newValue);
                                                        SecureStore.setItemAsync('selectableAnimals', JSON.stringify(newValue));

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
                    </ScrollView>

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
    )
}