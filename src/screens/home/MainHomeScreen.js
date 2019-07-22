/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    Text,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import HomeBottomActionSheet from './HomeBottomActionSheet';
import { colorAppForeground } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';
import HomeOverlayTouchable from './HomeOverlayTouchable';
import HomeAppHeader from './HomeAppHeader';

class MainHomeScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.enabledVHC = true;

        this.state = {
            enabledRenderBS: false
        };
    }
    
    componentDidMount = () => {
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            this.enabledVHC = true; // Libera toque no botao de troca de veiculo durante transicao de tela
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            
            if (this.props.animatedVisible) {
                this.props.animatedVisible('visible', 200);
            }
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            this.enabledVHC = false; // Bloqueia toque no botao de troca de veiculo durante transicao de tela
            if (this.props.bacChangePosition) this.props.bacChangePosition(0);
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });

        setTimeout(() => this.setState({ enabledRenderBS: true }), 1000);
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);

        this.onManualCloseAS();
    }

    onPressActionChooseVHC = () => {
        if (this.enabledVHC) {
            if (this.props.bacChangePosition && this.props.getPositionHomeBottomActionSheet) {
                if (this.props.getPositionHomeBottomActionSheet() === 0) {
                    if (this.props.animatedVisible) {
                        this.props.animatedVisible('hide', 120);
                    }
                    this.props.bacChangePosition(1);
                } else {
                    if (this.props.animatedVisible) {
                        this.props.animatedVisible('visible', 200);
                    }
                    this.props.bacChangePosition(0);
                }
            }
        }
    }

    onManualCloseAS = () => {
        if (this.props.animatedVisible) this.props.animatedVisible('visible', 200);
    }

    onBackButtonPressAndroid = () => {
        const routeName = this.props.navigation.state.routeName;
        const drawer = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent();

        if (drawer.state.isDrawerOpen) {
            this.props.navigation.closeDrawer();
            return true;
        }

        if (routeName === 'HomeTab') {
            if (this.props.getPositionHomeBottomActionSheet() !== 0) this.props.bacChangePosition(0); 
            return true;
        }

        return false;
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <HomeAppHeader
                navigation={this.props.navigation}
                rightIcon={() => 
                    (
                        <TouchableOpacity onPress={() => this.onPressActionChooseVHC()}>
                            <View style={{ width: 60, height: '100%', justifyContent: 'center' }}>
                                <Icon
                                    name={'ios-arrow-down'}
                                    type={'ionicon'}
                                    size={20}
                                    color={'black'}
                                />
                            </View>
                        </TouchableOpacity>
                    )
                }
                title={'Meu incrível veículo'}
                subtitle={'Ano 2019'}
                titleStyle={StyleSheet.flatten([defaultTextHeader, styles.titleVehicle])}
                containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
            />
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Início
                    </Text>
                </View>
                <HomeOverlayTouchable onPressActionChooseVHC={this.onPressActionChooseVHC} />
                {this.state.enabledRenderBS && (
                    <HomeBottomActionSheet getAnimTabBarTranslateY={this.props.getAnimTabBarTranslateY} onManualCloseAS={this.onManualCloseAS} />
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
    iconDrawer: {
        backgroundColor: 'white', 
        borderColor: 'grey', 
        borderWidth: 0.5, 
        width: 18, 
        height: 18, 
        borderRadius: 9
    },
    titleVehicle: {
        fontSize: 16
    }
});

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible,
    getAnimTabBarTranslateY: state.CustomHomeTabBarReducer.getAnimTabBarTranslateY,
    bacChangePosition: state.HomeBottomActionSheetReducer.bacChangePosition,
    getPositionHomeBottomActionSheet: state.HomeBottomActionSheetReducer.getPosition
});

export default connect(mapStateToProps)(MainHomeScreen);
