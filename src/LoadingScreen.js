import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { initializeBatchs, initAsyncFetchs } from './screens/utils/InitConfigs';

export default class LoadingScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    }
    
    componentDidMount = () => {
        initAsyncFetchs();

        setTimeout(() => {
            this.getTokensAsync();
        }, 1000);
    }

    getTokensAsync = async () => {
        try {
            const isFirstOpened = await AsyncStorage.getItem('@isFirstOpened');
            const isUserLogged = await AsyncStorage.getItem('@isUserLogged');
    
            if (!isFirstOpened) {
                this.props.navigation.navigate('Welcome');
            } else {
                this.props.navigation.navigate(isUserLogged ? 'App' : 'Auth');
                if (isUserLogged) initializeBatchs();
            }
        } catch (e) {
            console.log('AsyncStorage error');
        }
    };

    render = () => null
}
