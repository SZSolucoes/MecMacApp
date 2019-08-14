/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import Animated from 'react-native-reanimated';

import HomeHeaderVehicle from '../home/HomeHeaderVehicle';
import { colorAppForeground } from '../utils/Constants';
import HomeOverlayTouchable from '../home/HomeOverlayTouchable';
import { runSpring } from '../utils/ReanimatedUtils';
import ManutTabViewMain from './ManutTabViewMain';

const { Value, block, eq, cond } = Animated;

class ManutTabScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.toggleAsTooltip = React.createRef();

        this.animTransition = new Value(100);
        this.animTriggerType = new Value(-1);

        this.enabledVHC = true;
    }
    
    componentDidMount = () => {
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            this.runTransitionAnim(true);

            this.enabledVHC = true; // Libera toque no botao de troca de veiculo durante transicao de tela
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            
            if (this.props.animatedVisible) this.props.animatedVisible('visible', 200);

            if (this.props.showHomeNewVehicleTooltip && this.toggleAsTooltip.current && !this.toggleAsTooltip.current.state.isVisible) {
                if (this.props.fetchVehicles) this.props.fetchVehicles();
                this.toggleAsTooltip.current.toggleTooltip();
            }
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            this.runTransitionAnim(false);

            this.enabledVHC = false; // Bloqueia toque no botao de troca de veiculo durante transicao de tela
            if (this.props.bacChangePosition) this.props.bacChangePosition(0);
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });
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

        if (this.toggleAsTooltip.current && this.toggleAsTooltip.current.state.isVisible) {
            this.toggleAsTooltip.current.toggleTooltip();
            this.props.modifyShowHomeNewVehicleTooltip(false);

            return true;
        }

        if (drawer.state.isDrawerOpen) {
            this.props.navigation.closeDrawer();
            return true;
        }

        if (routeName === 'ManutTab') {
            if (this.props.getPositionHomeBottomActionSheet() !== 0) {
                this.props.bacChangePosition(0);

                return true;
            }
        }

        return false;
    }

    onBeforeOpenDrawer = () => {
        if (this.props.animatedVisible) {
            this.props.animatedVisible('visible', 200);
        }
        this.props.bacChangePosition(0);
    }

    runTransitionAnim = (switchOn) => {
        if (switchOn) {
            this.animTriggerType.setValue(1);
        } else {
            this.animTriggerType.setValue(0);
        }
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Animated.Code>
                {
                    () => 
                        block([
                            cond(eq(this.animTriggerType, 1), runSpring(this.animTransition, 0, 12)),
                            cond(eq(this.animTriggerType, 0), runSpring(this.animTransition, 100, 12))
                        ])
                }
            </Animated.Code>
            <HomeHeaderVehicle
                navigation={this.props.navigation}
                refTooltip={this.toggleAsTooltip}
                onCloseTooltip={this.onCloseTooltip}
                onPressActionChooseVHC={this.onPressActionChooseVHC}
                onBeforeOpenDrawer={this.onBeforeOpenDrawer}
            />
            <View style={{ flex: 1 }}>
                <Animated.View 
                    style={{ 
                        flex: 1,
                        transform: [{ translateY: this.animTransition }],
                        opacity: Animated.interpolate(
                            this.animTransition, {
                                inputRange: [0, 100],
                                outputRange: [1, 0],
                                extrapolate: Animated.Extrapolate.CLAMP
                            }
                        )
                    }}
                >
                    <ManutTabViewMain />
                </Animated.View>
                <HomeOverlayTouchable onPressActionChooseVHC={this.onPressActionChooseVHC} />
            </View>
        </SafeAreaView>
    ); 
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
    }
});

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible,
    showHomeNewVehicleTooltip: state.CustomHomeTabBarReducer.showHomeNewVehicleTooltip,
    bacChangePosition: state.HomeBottomActionSheetReducer.bacChangePosition,
    getPositionHomeBottomActionSheet: state.HomeBottomActionSheetReducer.getPosition,
    fetchVehicles: state.HomeBottomActionSheetReducer.fetchVehicles
});

export default connect(mapStateToProps)(ManutTabScreen);
