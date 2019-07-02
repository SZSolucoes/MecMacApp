import React from 'react';
import {
    View,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { initializeBatchs } from './screens/utils/InitConfigs';

export default class LoadingScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    }
    
    constructor(props) {
        super(props);

        setTimeout(() => this.getTokensAsync(), 100);
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

    render = () => (
        <View 
            style={{ 
                flex: 1, 
                backgroundColor: 'black', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <StatusBar 
                backgroundColor={'rgba(0, 0, 0, 0.5)'}
                translucent
            />
            <ActivityIndicator color={'white'} />
            <StatusBar barStyle="default" />
        </View>
    )
}
