/* eslint-disable max-len */
import React from 'react';
import {
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Animated from 'react-native-reanimated';

import { colorAppForeground } from '../utils/Constants';
import MainHomeScreen from './MainHomeScreen';
import HomeMyVehicleFragment from './screens_fragment/HomeMyVehicleFragment';
import { runSpring } from '../utils/ReanimatedUtils';

const { Value, block, set } = Animated;

class HomeScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.animFadeIn = new Value(0);
    }

    componentDidMount = () => {
        SplashScreen.hide();
    }

    renderScreensManager = () => {
        switch (this.props.menuChoosed) {
            case 'main':
                return (<MainHomeScreen navigation={this.props.navigation} />);
            case 'myvehicle':
                return (<HomeMyVehicleFragment navigation={this.props.navigation} />);
            default:
                return (<MainHomeScreen navigation={this.props.navigation} />);
        }
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Animated.View style={{ flex: 1, opacity: this.animFadeIn }}>
                <Animated.Code
                    key={this.props.menuChoosed}
                >
                    {
                        () => block([
                            set(this.animFadeIn, 0),
                            runSpring(this.animFadeIn, 1)
                        ])
                    }
                </Animated.Code>
                {this.renderScreensManager()}
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    }
});

const mapStateToProps = (state) => ({
    menuChoosed: state.HomeDrawerReducer.menuChoosed
});

export default connect(mapStateToProps)(HomeScreen);
