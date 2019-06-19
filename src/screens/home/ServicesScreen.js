import React from 'react';
import { 
    View,
    Text,
    StyleSheet
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';

export default class ServicesScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render = () => (
        <View style={styles.mainView}>
            <Text>Serviços</Text>
        </View>
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
