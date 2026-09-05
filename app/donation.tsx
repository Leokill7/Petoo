import {ActivityIndicator, View} from "react-native";
import {WebView} from "react-native-webview";
import {useTheme} from "@/context/ThemeContext";
import {useRef, useState} from "react";

export default function Donation() {
    const {colors} = useTheme();
    const webViewRef = useRef<WebView>(null);
    let [isDonationWindowLoading, setIsDonationWindowLoading] = useState(false)

    return(
        <View style={{flex: 1,backgroundColor: colors.backgroundColor,alignItems: 'center',}}>
            <View style={{height: '100%', width:"100%",overflow: 'hidden',backgroundColor: 'white'}}>
                {isDonationWindowLoading && (
                    <View style={{backgroundColor: 'white',justifyContent: 'center',alignItems: 'center',zIndex: 1,}}>
                        <ActivityIndicator size="large" color={colors.green1} />
                    </View>
                )}
                <WebView
                    ref={webViewRef}
                    source={{ uri: 'https://ko-fi.com/yakoto' }}
                    style={{ flex: 1}}
                    onLoadStart={() => setIsDonationWindowLoading(true)}
                    onLoadEnd={() => {
                        setIsDonationWindowLoading(false);
                        webViewRef.current?.injectJavaScript(`
                          window.scrollTo(0, 0);
                          true;
                        `);
                    }}
                />
            </View>
        </View>
    )
}