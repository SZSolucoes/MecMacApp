import React from 'react';
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';

export default class ServicesScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Text>Serviços</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorAppForeground
    }
});
