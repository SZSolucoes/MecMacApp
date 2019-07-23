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

export const initConfigs = () => {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });
    
    // Travar orientacao em portrait
    Orientation.lockToPortrait();
    
    if (!global.btoa) {
        global.btoa = encode;
    }
    
    if (!global.atob) {
        global.atob = decode;
    }
    
    Axios.defaults.timeout = 10000; // Timeout default para o Axios

    DefaultTheme.colors.primary = colorAppPrimary;
    
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
        realmFetchsInit();
    }
};

