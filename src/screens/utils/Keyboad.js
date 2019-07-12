import React from 'react';
import { TouchableOpacity, Keyboard } from 'react-native';

export const dismissKeyboard = () => Keyboard.dismiss();

export const DimissedKeyboardView = (props) => (
    <TouchableOpacity {...props} activeOpacity={1} onPress={dismissKeyboard} />
);
