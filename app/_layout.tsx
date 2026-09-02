import React from "react";
import { Slot } from "expo-router";
import Toast from 'react-native-toast-message';
import {ThemeProvider} from "@/context/ThemeContext";

const _layout = () => {
  return (
    <ThemeProvider>
      <Slot />
      <Toast />
    </ThemeProvider>
  );
};

export default _layout;