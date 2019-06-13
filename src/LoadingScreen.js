import React from 'react';
import {
    View,
    StatusBar,
    BackHandler,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class LoadingScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    
    constructor(props) {
        super(props);

        setTimeout(() => this.getTokensAsync(), 2000);
    }

    getTokensAsync = async () => {
        const firstOpened = await AsyncStorage.getItem('firstOpened');
        const userToken = await AsyncStorage.getItem('userToken');

        if (!firstOpened) {
            this.props.navigation.navigate('Welcome');
        } else {
            this.props.navigation.navigate(userToken ? 'App' : 'Auth');
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
