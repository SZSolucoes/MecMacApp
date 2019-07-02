/* eslint-disable max-len */
import React from 'react';
import { SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { colorAppForeground } from './Constants';

export const isPortrait = () => Dimensions.get('screen').height > Dimensions.get('screen').width;

export const getWindowWidthPortrait = () => { 
    if (isPortrait()) {
        return Dimensions.get('window').width;
    } 
    
    return Dimensions.get('window').height;
};

export const getWindowHeigthPortrait = () => { 
    if (isPortrait()) {
        return Dimensions.get('window').height;
    } 
    
    return Dimensions.get('window').width;
};

export const getStatusBarHeight = () => (Platform.OS === 'ios' ? 0 : StatusBar.currentHeight);

const sbHeight = Platform.OS === 'ios' ? {} : { height: getStatusBarHeight() };

export const renderOpacityStatusBar = (opacity = 0.3, barStyle = 'default') => (
    <React.Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: `rgba(0, 0, 0, ${opacity})`, ...sbHeight }} />
        <StatusBar 
            backgroundColor={`rgba(0, 0, 0, ${opacity})`}
            translucent
            barStyle={barStyle}
        />
    </React.Fragment>
);

export const renderStatusBar = (backgroundColor = colorAppForeground, barStyle = 'default') => (
    <React.Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor, ...sbHeight }} />
        <StatusBar 
            backgroundColor={backgroundColor}
            translucent
            barStyle={barStyle}
        />
    </React.Fragment>
);

