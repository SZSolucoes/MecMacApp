import Axios from 'axios';
import { decode, encode } from 'base-64';
import _ from 'lodash';

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
