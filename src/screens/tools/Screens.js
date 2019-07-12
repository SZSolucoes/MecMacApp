/* eslint-disable max-len */
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { colorAppForeground } from '../utils/Constants';
import { renderStatusBar } from '../utils/Screen';
import HeaderDefault from './HeaderDefault';

const onPressBackButton = (navigation) => navigation && navigation.goBack();

export const DefaultScreenAndHeaderContainer = React.memo((props) => (
    <View style={{ flex: 1 }}>
        {renderStatusBar('white', 'dark-content')}
        <SafeAreaView style={{ flex: 1, backgroundColor: colorAppForeground }}>
            <HeaderDefault 
                backActionProps={{ onPress: props.onPressBackButton || (() => onPressBackButton(props.navigation)) }}
                title={props.title || ''}
            />
            {props.children}
        </SafeAreaView>
    </View>
));

