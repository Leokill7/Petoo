import {Keyboard, Pressable, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useTheme} from "@/context/ThemeContext";
import {createStyles} from "@/constants/Colors";
import {useEffect, useState} from "react";
import {useProductInfo} from "@/context/ProductInfoContext";

export default function BarcodeSelection({setScanning}:{setScanning: (scanning: boolean) => void}) {
    const {colors} = useTheme();
    const styles = createStyles(colors);
    const {searchForBarcode} = useProductInfo()

    const [permission, requestPermission] = useCameraPermissions();
    const [camDirection, setCamDirection] = useState<CameraType>("back");
    const [showCamera, setShowCamera] = useState(true);
    const [currentManualCode, setCurrentManualCode] = useState("")

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    },[])

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
                                onBarcodeScanned={( scanningResult ) => {
                                    setScanning(false)
                                    searchForBarcode(scanningResult.data)
                                }}
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
                            if(currentManualCode !== ""){
                                setScanning(false)
                                searchForBarcode(currentManualCode);
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