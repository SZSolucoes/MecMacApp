/* eslint-disable max-len */
import React from 'react';
import { SafeAreaView, Text, StyleSheet, BackHandler } from 'react-native';

import HomeAppHeader from '../HomeAppHeader';

class HomeMyVehicleFragment extends React.PureComponent {
    constructor(props) {
        super(props);

        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });
    }
    
    componentDidMount = () => {
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => {
        const drawer = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent();

        if (drawer.state.isDrawerOpen) {
            this.props.navigation.closeDrawer();
            return true;
        }

        return false;
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <HomeAppHeader 
                navigation={this.props.navigation}
                title={'Meu veículo'}
            />
            <Text> HomeMyVehicleFragment </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'yellow'
    }
});

export default HomeMyVehicleFragment;
