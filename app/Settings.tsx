import Toast from "react-native-toast-message";
import {Keyboard, Linking,  Pressable, ScrollView, Switch, Text, TextInput, View} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {Ionicons} from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import {useTheme} from "@/context/ThemeContext";
import {createStyles} from '@/constants/Colors';
import {useState} from "react";
import {useAnimal} from "@/context/AnimalContext";

export default function Settings(
) {
    const {colors} = useTheme();
    const styles = createStyles(colors);
    const {selectableAnimals, setSelectableAnimals, petTypes} = useAnimal();

    const [isLactoseIntolerantSelected, setIsLactoseIntolerantSelected] = useState(false)
    const [customPetName, setCustomPetName] = useState("")
    const [customPetTypeSelectionVisible, setCustomPetTypeSelectionVisible] = useState(false)
    const [customPetType, setCustomPetType] = useState("")

    const [deletePetNameSelectionVisible, setDeletePetNameSelectionVisible] = useState(false)
    const [deletePetName, setDeletePetName] = useState("")

    const [invalidPetTypeInput, setInvalidPetTypeInput] = useState(false);
    const [invalidPetNameInput, setInvalidPetNameInput] = useState(false);
    const [invalidDeletePetInput, setInvalidDeletePetInput] = useState(false);

    return(
            <View style={{flex: 1,backgroundColor: colors.backgroundColor,alignItems: 'center',}}>
                <View style={{height: '91%',marginTop:"6%", width:"90%", overflow: 'hidden',backgroundColor: colors.backgroundColor}}>
                    <ScrollView  contentContainerStyle={{ paddingBottom: 70 }}>
                        <Text style={{color:colors.textColor,fontSize: 30,fontWeight: 800,alignSelf:"center"}}>Create Custom Pet</Text>
                        <View style={styles.settingElementContainer}>
                            <View>
                                <View style={styles.settingsGridElementContainer}>

                                    <View style={styles.settingsGridElement}>
                                        <Text style={styles.petCreationSubHeader}>Pet type:</Text>
                                    </View>
                                    <View style={[styles.animalSelectDropdownContainer,{width:"100%",height:"100%"}]}>
                                        <DropDownPicker
                                            open={customPetTypeSelectionVisible}
                                            value={customPetType}
                                            items={petTypes}
                                            setOpen={setCustomPetTypeSelectionVisible}
                                            setValue={setCustomPetType}
                                            onChangeValue={() => setInvalidPetTypeInput(false)}
                                            onOpen={()=>{
                                                setDeletePetNameSelectionVisible(false)
                                            }}
                                            selectedItemLabelStyle={{
                                                color: colors.green2,
                                            }}
                                            selectedItemContainerStyle={{
                                                backgroundColor: colors.green1 + '20',
                                            }}
                                            placeholder="Pet type"
                                            listMode="SCROLLVIEW"
                                            style={[
                                                styles.animalSelectDropdown,
                                                {
                                                    borderColor: invalidPetTypeInput?colors.errorRed:colors.inputElementBorderColor,
                                                    width:"50%",
                                                    backgroundColor:colors.mainDisplaybackgroundColor
                                                }
                                            ]}
                                            textStyle={{color:colors.textColor,fontSize:20,fontWeight:600}}
                                            placeholderStyle={{ fontWeight: 600 , color: colors.inputElementBorderColor }}
                                            dropDownContainerStyle={[styles.animalSelectDropdownItem,{borderColor: invalidPetTypeInput?colors.errorRed:colors.inputElementBorderColor,width:"50%",backgroundColor:colors.mainDisplaybackgroundColor}]}
                                            showTickIcon={false}
                                            ArrowDownIconComponent={() => (
                                                <Ionicons name="caret-down" size={20} color={colors.inputElementBorderColor}/>
                                            )}
                                            ArrowUpIconComponent={() => (
                                                <Ionicons name="caret-up" size={20} color={colors.inputElementBorderColor}/>
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
                                            style={[
                                                styles.textInputManual,
                                                {
                                                    width:"auto",
                                                    borderColor:invalidPetNameInput?colors.errorRed:colors.inputElementBorderColor
                                                }
                                            ]}
                                            placeholderTextColor="#aaa"
                                            value={customPetName}
                                            onChangeText={(value) => {
                                                setCustomPetName(value)
                                                setInvalidPetNameInput(false)
                                            }}

                                        />
                                    </View>
                                </View>
                                <View style={styles.settingsGridElementContainer}>
                                    <View style={styles.settingsGridElement}>
                                        <Text style={styles.petCreationSubHeader}>Lactose intolerant:</Text>
                                    </View>
                                    <View style={[
                                        styles.settingsGridElement,
                                        {
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }
                                    ]}>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Switch
                                                value={isLactoseIntolerantSelected}
                                                onValueChange={setIsLactoseIntolerantSelected}
                                                trackColor={{ false: colors.selectorBackground, true: colors.green1 }}
                                                ios_backgroundColor={!isLactoseIntolerantSelected ? colors.selectorBackground : colors.green1}
                                                thumbColor={!isLactoseIntolerantSelected ? colors.textColor : colors.green2}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.settingsGridElementContainer}>
                                    <View style={styles.settingsGridElement}></View>
                                    <View style={styles.settingsGridElement}>
                                        <Pressable
                                            style={styles.scanningButton}
                                            onPress={()=>{
                                                Keyboard.dismiss();
                                                if(customPetName !== "" && petTypes.find(e => e.value === customPetType)){
                                                    setInvalidPetTypeInput(false);
                                                    setInvalidPetNameInput(false);

                                                    const newValue = [...selectableAnimals, { label: customPetName, value: customPetName.toLowerCase(), type:customPetType, lactoseOkay: isLactoseIntolerantSelected }];
                                                    setSelectableAnimals(newValue);
                                                    SecureStore.setItemAsync('selectableAnimals', JSON.stringify(newValue));

                                                    setIsLactoseIntolerantSelected(false)
                                                    setCustomPetName("")
                                                    setCustomPetType("")
                                                }

                                                if(petTypes.find(e => e.value === customPetType) === undefined){
                                                    setInvalidPetTypeInput(true);
                                                }
                                                if(customPetName === ""){
                                                    setInvalidPetNameInput(true);
                                                }
                                            }}
                                        >
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
                                <View style={[styles.animalSelectDropdownContainer,{width:"100%",height:"100%"}]}>
                                    <DropDownPicker
                                        open={deletePetNameSelectionVisible}
                                        value={deletePetName}
                                        items={selectableAnimals}
                                        setOpen={setDeletePetNameSelectionVisible}
                                        setValue={(value) => {
                                            setDeletePetName(value);
                                            setInvalidDeletePetInput(false)
                                        }}
                                        onOpen={()=>{
                                            setCustomPetTypeSelectionVisible(false)
                                        }}
                                        selectedItemLabelStyle={{
                                            color: colors.green2,
                                        }}
                                        selectedItemContainerStyle={{
                                            backgroundColor: colors.green1 + '20',
                                        }}
                                        placeholder="Pet"
                                        listMode="SCROLLVIEW"
                                        style={[styles.animalCreateDropdown,{borderColor:invalidDeletePetInput?colors.errorRed:colors.inputElementBorderColor}]}
                                        textStyle={{color:colors.textColor,fontSize:20,fontWeight:600}}
                                        placeholderStyle={{ fontWeight: 600 , color:colors.inputElementBorderColor }}
                                        dropDownContainerStyle={[styles.animalCreateDropdownItem,{borderColor: invalidDeletePetInput?colors.errorRed:colors.inputElementBorderColor}]}
                                        showTickIcon={false}
                                        ArrowDownIconComponent={() => (
                                            <Ionicons name="caret-down" size={20} color={colors.inputElementBorderColor}/>
                                        )}
                                        ArrowUpIconComponent={() => (
                                            <Ionicons name="caret-up" size={20} color={colors.inputElementBorderColor}/>
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
                                        {
                                            Object.values(selectableAnimals).find(
                                                (item) => item["value"] === deletePetName
                                            )
                                                ?.type.charAt(0).toUpperCase()}
                                        {
                                            Object.values(selectableAnimals).find(
                                                (item) => item["value"] === deletePetName
                                            )
                                                ?.type.slice(1)
                                        }
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.settingsGridElementContainer}>
                                <View style={styles.settingsGridElement}></View>
                                <View style={styles.settingsGridElement}>
                                    <Pressable
                                        style={styles.scanningButton}
                                        onPress={()=>{
                                            if(deletePetName !== ""){
                                                const newValue = selectableAnimals.filter(item => item.value !== deletePetName);
                                                setSelectableAnimals(newValue);
                                                SecureStore.setItemAsync('selectableAnimals', JSON.stringify(newValue));
                                                setDeletePetName("")
                                            }else{
                                                setInvalidDeletePetInput(true)
                                            }
                                        }}
                                    >
                                        <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:700}}>Delete Pet</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <Pressable style={{height: "4%", paddingLeft: 20}} onPress={() => Linking.openURL('https://leonard-arnold.site/petoo/Petoo_Privacy_Policy.pdf')}>
                        <Text style={{ color:"#959595"}}>Privacy Policy</Text>
                    </Pressable>
                </View>
            </View>
    )
}