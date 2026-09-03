import {ActivityIndicator, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {WebView} from "react-native-webview";
import {createStyles, getColors, themeColors} from '@/constants/Colors';
import {useTheme} from "@/context/ThemeContext";
import {useState} from "react";

export default function DonationsModal(
    {
        donationsVisible,
        setDonationsVisible,
    }
    :
    {
        setDonationsVisible: (newDonationsVisible: boolean) => void;
        donationsVisible:boolean
    }
) {
    const {colors, toggleTheme, darkModeActive} = useTheme();
    const styles = createStyles(colors);

    let [isDonationWindowLoading, setIsDonationWindowLoading] = useState(false)

    return(
        <Modal
            visible={donationsVisible}
            animationType="slide"
            onRequestClose={() => setDonationsVisible(false)} // Android back button
        >
            <View style={{flex: 1,backgroundColor: colors.backgroundColor,alignItems: 'center',}}>
                <View style={{height:"7%"}}></View>
                <View style={{height: '85%', width:"100%", borderTopEndRadius:15, borderTopStartRadius:15,overflow: 'hidden',backgroundColor: 'white'}}>
                    {isDonationWindowLoading && (
                        <View style={{...StyleSheet.absoluteFillObject,backgroundColor: 'white',justifyContent: 'center',alignItems: 'center',zIndex: 1,}}>
                            <ActivityIndicator size="large" color={colors.green1} />
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
    )
}