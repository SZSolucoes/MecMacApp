import { Dimensions } from 'react-native';

export const isPortrait = () => Dimensions.get('screen').height > Dimensions.get('screen').width;

export const getWindowWidthPortrait = () => { 
    if (isPortrait()) {
        return Dimensions.get('window').width;
    } 
    
    return Dimensions.get('window').height;
};
