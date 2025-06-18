import React from "react";
import { Slot } from "expo-router";
import Toast from 'react-native-toast-message';

const _layout = () => {
  return (
    <>
      <Slot />
      <Toast />
    </>
  );
};

export default _layout;