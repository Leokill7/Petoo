import React from "react";
import { Slot } from "expo-router";
import Toast from 'react-native-toast-message';
import {ThemeProvider} from "@/context/ThemeContext";
import {ProductInfoProvider} from "@/context/ProductInfoContext";
import {AnimalProvider} from "@/context/AnimalContext";

const _layout = () => {
  return (
      <AnimalProvider>
          <ProductInfoProvider>
              <ThemeProvider>
                  <Slot />
                  <Toast />
              </ThemeProvider>
          </ProductInfoProvider>
      </AnimalProvider>
  );
};

export default _layout;