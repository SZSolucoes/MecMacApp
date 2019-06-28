/* eslint-disable max-len */
import React from 'react';
import { View, Dimensions, Platform, StatusBar } from 'react-native';
import { colorAppForeground } from './Constants';

export const isPortrait = () => Dimensions.get('screen').height > Dimensions.get('screen').width;

export const getWindowWidthPortrait = () => { 
    if (isPortrait()) {
        return Dimensions.get('window').width;
    } 
    
    return Dimensions.get('window').height;
};

export const getStatusBarHeight = () => (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);

export const renderOpacityStatusBar = (opacity = 0.3) => (
    <View style={{ height: getStatusBarHeight() }}>
        <StatusBar 
            backgroundColor={`rgba(0, 0, 0, ${opacity})`}
            translucent
        />
    </View>
);

export const renderStatusBar = (backgroundColor = colorAppForeground, barStyle = 'dark-content') => (
    <View style={{ height: getStatusBarHeight() }}>
        <StatusBar 
            backgroundColor={backgroundColor}
            barStyle={barStyle}
            translucent
        />
    </View>
);

