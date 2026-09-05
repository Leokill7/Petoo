import React from "react";
import Toast from 'react-native-toast-message';
import {ThemeProvider} from "@/context/ThemeContext";
import {ProductInfoProvider} from "@/context/ProductInfoContext";
import {AnimalProvider} from "@/context/AnimalContext";
import AppNavigator from "@/navigation/AppNaviator";

const _layout = () => {
  return (
      <AnimalProvider>
          <ProductInfoProvider>
              <ThemeProvider>
                <AppNavigator />
                  <Toast />
              </ThemeProvider>
          </ProductInfoProvider>
      </AnimalProvider>
  );
};

export default _layout;