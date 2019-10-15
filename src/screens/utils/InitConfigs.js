import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation';
import { GoogleSignin } from 'react-native-google-signin';
import { DefaultTheme } from 'react-native-paper';
import Axios from 'axios';
import { decode, encode } from 'base-64';
import _ from 'lodash';

import { store } from '../../App';
import { realmFetchsInit } from '../../storage/RealmManager';
import { checkIsConnected } from './device/DeviceInfos';
import { colorAppPrimary } from './Constants';

const DefaultTextColor = DefaultTheme.colors.text;
//const DefaultPrimaryColor = DefaultTheme.colors.primary;
const DefaultPlaceHolderColor = DefaultTheme.colors.placeholder;

export const initConfigs = () => {
    /* const googleScopes = {
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
    }; */

    GoogleSignin.configure(/* googleScopes */);
    
    // Travar orientacao em portrait
    Orientation.lockToPortrait();
    
    if (!global.btoa) {
        global.btoa = encode;
    }
    
    if (!global.atob) {
        global.atob = decode;
    }
    
    Axios.defaults.timeout = 10000; // Timeout default para o Axios

    initDefaultTheme();
    
    console.disableYellowBox = true;

    const consoleCloned = _.clone(console);

    console.warn = message => {
        if (message.indexOf('Setting a timer') <= -1) {
            consoleCloned.warn(message);
        }
    };
};

export const initializeBatchs = async () => {
    try {
        // ######### USER INFO #########
        const userInfoJsonString = await AsyncStorage.getItem('@userProfileJson');
        if (userInfoJsonString) {
            const userInfo = JSON.parse(userInfoJsonString);
    
            if (userInfo) {
                store.dispatch({
                    type: 'modify_userreducer_userinfo',
                    payload: userInfo
                });
            }
        }
        // ######### END #########
    } catch (e) {
        console.log('Error initialize Batchs');
    }
};

export const initAsyncFetchs = async () => {
    // Realm fetchs
    const isConnected = await checkIsConnected();

    if (isConnected) {
        await realmFetchsInit();
    }
};

export const initDefaultTheme = () => {
    DefaultTheme.colors.text = DefaultTextColor;
    DefaultTheme.colors.primary = colorAppPrimary;
    DefaultTheme.colors.placeholder = DefaultPlaceHolderColor;
};

