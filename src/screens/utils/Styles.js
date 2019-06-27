import { Platform } from 'react-native';

export const defaultTextHeader = {
    fontFamily: 'OpenSans-Regular', 
    fontSize: Platform.OS === 'ios' ? 17 : 20, 
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.7)'
};
