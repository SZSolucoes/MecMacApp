import React from 'react';
import { 
    View,
    Text,
    StyleSheet,
    BackHandler
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.didFocusSubscription = props.navigation.addListener('didFocus', () =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }
    
    componentDidMount = () => {
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
          BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => {
        const routeName = this.props.navigation.state.routeName;

        if (routeName === 'HomeTab') {
            return true;
        }

        return false;
    }

    render = () => (
        <View style={styles.mainView}>
            <Text>Início</Text>
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

