import React from 'react';
import { 
    View,
    Button
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome to the app!',
    };

    showMoreApp = () => {
        this.props.navigation.navigate('Other');
    };

    signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };

    render = () => (
        <View>
            <Button title="Show me more of the app" onPress={this.showMoreApp} />
            <Button title="Actually, sign me out :)" onPress={this.signOutAsync} />
        </View>
    )
}
