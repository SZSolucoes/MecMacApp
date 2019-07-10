/* eslint-disable max-len */
import React from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler } from 'react-native';
import { Surface } from 'react-native-paper';

import { renderStatusBar } from '../../utils/Screen';
import HeaderDefault from '../../tools/HeaderDefault';
import { colorAppForeground, tabBarHeight } from '../../utils/Constants';

class AddVehicleScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

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

    onPressBackButton = () => this.props.navigation.goBack()
    
    render = () => (
        <View style={{ flex: 1 }}>
            { renderStatusBar('white', 'dark-content') }
            <SafeAreaView style={styles.mainView}>
                <HeaderDefault 
                    backActionProps={{ onPress: this.onPressBackButton }}
                    title={'Adicionar veículo'}
                />
                <View style={{ flex: 1, overflow: 'hidden' }}>
                    <Surface style={[styles.barPass, { position: 'absolute', left: 0, top: 0, elevation: 2 }]}>
                        <View style={{ height: 40, width: 40, backgroundColor: 'blue' }} />
                        <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
                        <View style={{ height: 40, width: 40, backgroundColor: 'green' }} />
                    </Surface>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
    barPass: {
        height: tabBarHeight,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default AddVehicleScreen;
