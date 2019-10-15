/* eslint-disable max-len */
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { initializeBatchs, initAsyncFetchs } from './screens/utils/InitConfigs';
import { apiGetUserVehicles } from './screens/utils/api/ApiManagerConsumer';
import { store } from './App';
import { DESENV_EMAIL } from './screens/utils/Constants';

export default class LoadingScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    }
    
    componentDidMount = async () => { 
        await initAsyncFetchs();

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
            } else if (isUserLogged) {
                initializeBatchs();
                
                try {
                    const email = store.getState().UserReducer.userInfo.email || DESENV_EMAIL;
                    const vehicles = await apiGetUserVehicles({ user_email: email });

                    if (vehicles && vehicles.data && vehicles.data.data && vehicles.data.data.length) {
                        this.props.navigation.navigate('SelectVehicle', { vehiclesData: [...vehicles.data.data] });
                        return;
                    }
                } catch (e) {
                    console.log(e);
                }

                this.props.navigation.navigate('Home');
            } else {
                this.props.navigation.navigate('SignIn');
            }
        } catch (e) {
            console.log('AsyncStorage error');
        }
    };

    render = () => null
}
