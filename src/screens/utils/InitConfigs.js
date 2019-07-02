import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import { decode, encode } from 'base-64';
import _ from 'lodash';

import { store } from '../../App';

export const initConfigs = () => {
    if (!global.btoa) {
        global.btoa = encode;
    }
    
    if (!global.atob) {
        global.atob = decode;
    }
    
    Axios.defaults.timeout = 80000; // Timeout default para o Axios
    
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

