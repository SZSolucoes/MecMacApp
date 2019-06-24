import React from 'react';
import { 
    View,
    Text,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import { colorAppForeground } from '../utils/Constants';

class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            
            if (this.props.animatedVisible) {
                this.props.animatedVisible('visible', 200);
            }
        });
    }
    
    componentDidMount = () => {
        SplashScreen.hide();
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
        <SafeAreaView style={styles.mainView}>
            <Text>Início</Text>
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

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible
});

export default connect(mapStateToProps)(HomeScreen);
