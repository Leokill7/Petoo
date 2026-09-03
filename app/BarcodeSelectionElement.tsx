import {Keyboard, Pressable, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useTheme} from "@/context/ThemeContext";
import {createStyles} from "@/constants/Colors";
import {RefObject, useEffect, useState} from "react";

export default function BarcodeSelection({
    currentScannedCode,
    getJSON,
    setIsLoadingData
                                         }:{
    getJSON: () => Promise<void>;
    currentScannedCode:RefObject<string>;
    setIsLoadingData: (isLoading: boolean) => void;
}) {
    const {colors, toggleTheme, darkModeActive} = useTheme();
    const styles = createStyles(colors);

    const [permission, requestPermission] = useCameraPermissions();
    const [camDirection, setCamDirection] = useState<CameraType>("back");
    const [showCamera, setShowCamera] = useState(true);
    const [currentManualCode, setCurrentManualCode] = useState("")

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    },[])

    const searchWithBarcode = (barcode: string) => {
        if(currentScannedCode.current != barcode){
            setIsLoadingData(true)
            currentScannedCode.current = barcode;
            getJSON();
        }
    }

    return(
        <>
            {showCamera ? (
                <>
                    <TouchableOpacity
                        style={[styles.manualInputSelector,{}]}
                        onPress={() => setShowCamera(false)}
                    >
                        <Ionicons name="search" size={30} color={colors.green1} />
                    </TouchableOpacity>
                    {permission?.granted?(
                        <>
                            <CameraView
                                facing={camDirection}
                                onBarcodeScanned={( scanningResult ) => searchWithBarcode(scanningResult.data)}
                                style={styles.camera}
                                videoStabilizationMode="standard"
                            />
                            <TouchableOpacity
                                style={styles.cameraDirectionSwitcher}
                                onPress={() => setCamDirection(camDirection === 'back' ? 'front' : 'back')}
                            >
                                <Ionicons name="camera-reverse" size={30} color={colors.green1} />
                            </TouchableOpacity>
                        </>
                    ):(
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color:colors.textColor ,fontSize:20,fontWeight:600,marginBottom:20}}>We need camera permission</Text>
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
                        <Ionicons name="camera" size={30} color={colors.green1} />
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
                                searchWithBarcode(currentManualCode);
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
    )
}