/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, Easing, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { Text, Surface } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import Animated from 'react-native-reanimated';
import { Icon } from 'react-native-elements';

import { colorAppPrimary, tabBarHeight } from '../utils/Constants';
import { modifyAnimatedVisible, modifyGetAnimTabBarTranslateY, modifyCloseFab } from '../../actions/CustomHomeTabBarActions';
import { runSpringDefault } from '../utils/ReanimatedUtils';
import OverlayTouchable from '../tools/OverlayTouchable';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const { Value, block, eq, cond, neq, set, call } = Animated;

const MULTIPLIER_DISTANCE_X = 1.4;
const MULTIPLIER_DISTANCE_Y = 1.4;
const MOVE_AXIS_X = -6;

class CustomHomeTabBar extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.animTabBarTranslateY = new Value(0);
        this.touchEnabled = true;

        this.floatButtons = React.memo(this.renderFloatExpenses);
        this.rippleTab = React.memo(this.renderRippleTab);

        this.animRunTrigger = new Value(-1);
        this.animTimingValue = new Value(0);

        this.animControl = 0;
        this.lockedAnim = false;

        this.state = {
            pointerEventsState: 0
        };
    }
    
    componentDidMount = () => { 
        if (this.props.modifyAnimatedVisible) this.props.modifyAnimatedVisible(this.animateVisible);
        if (this.props.modifyGetAnimTabBarTranslateY) this.props.modifyGetAnimTabBarTranslateY(this.getAnimTabBarTranslateY);
        if (this.props.modifyCloseFab) this.props.modifyCloseFab(this.closeFab);

        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onOverAnim = () => (this.lockedAnim = false)

    onBackButtonPressAndroid = () => {
        if (this.closeFab()) return true;

        return false;
    }

    getAnimTabBarTranslateY = () => this.animTabBarTranslateY

    getLabelTab = (labelScreen) => {
        switch (labelScreen) {
            case 'HomeTab':
                return 'Início';
            case 'ManutTab':
                return 'Manutenções';
            case 'ExpensesTab':
                return 'Despesas';
            case 'PromotionsTab':
                return 'Promoções';
            case 'BlogTabs':
                return ' Blog';
            case 'ServicesTab':
                return 'Serviços';
            case 'ProfileTab':
                return 'Perfil';
            default:
                return labelScreen;
        }
    }

    animateVisible = (tabBarVisible = 'visible', duration = 200, callBack = undefined, callBackParams = {}) => {
        if (tabBarVisible === 'hide') {
            this.touchEnabled = false;
            Animated.timing(
                this.animTabBarTranslateY,
                {
                    toValue: tabBarHeight,
                    duration,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ).start(callBack && callBack(callBackParams));
        } else if (tabBarVisible === 'visible') {
            this.touchEnabled = true;
            Animated.timing(
                this.animTabBarTranslateY,
                {
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ).start(callBack && callBack(callBackParams));
        }
    }

    closeFab = () => {
        if (this.animControl === 1 && !this.lockedAnim) {
            this.lockedAnim = true;

            this.setState({ pointerEventsState: 0 });
            this.animRunTrigger.setValue(0);
            this.animControl = 0;

            return true;
        }
    }

    openFab = () => {
        if (!this.lockedAnim) {
            this.lockedAnim = true;
    
            this.setState({ pointerEventsState: 1 });
            this.animRunTrigger.setValue(1);
            this.animControl = 1;
        }
    }

    runAnimFab = () => {
        if (this.animControl === 1) {
            this.closeFab();
        } else {
            this.openFab();
        }
    }

    renderExpenseTab = (propsTab) => (
        <View style={styles.tabButton} key={propsTab.routeIndex}>
            <this.floatButtons />
            <Animated.View
                style={{ 
                    position: 'absolute',
                    backgroundColor: 'white',
                    width: '100%',
                    height: '100%',
                    borderRadius: 20
                }}
            >
                <this.rippleTab {...propsTab} />
            </Animated.View>
        </View>
    )

    renderFloatExpenses = () => (
        <React.Fragment>
            <Animated.Code>
                {
                    () =>
                        block([
                            cond(
                                neq(this.animRunTrigger, -1),
                                cond(
                                    eq(this.animRunTrigger, 1),
                                    set(
                                        this.animTimingValue, 
                                        runSpringDefault(0, 1, 12, [call([], this.onOverAnim)])
                                    ),
                                    set(
                                        this.animTimingValue, 
                                        runSpringDefault(1, 0, 12, [call([], this.onOverAnim)])
                                    ),
                                ),
                            )
                        ])
                }
            </Animated.Code>
            <Animated.View
                style={{ 
                    position: 'absolute',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: Animated.interpolate(this.animTimingValue, {
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                        extrapolate: Animated.Extrapolate.CLAMP
                    }),
                    left: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [20, ((-75 + MOVE_AXIS_X) * MULTIPLIER_DISTANCE_X)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    ),
                    top: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [0, (-50 * MULTIPLIER_DISTANCE_Y)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    )
                }}
            >
                <AnimatedSurface
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colorAppPrimary,
                        elevation: 4,
                        marginBottom: 5
                    }}
                >
                    <Icon name={'fuel'} type={'material-community'} color={'white'} />
                </AnimatedSurface>
                <Text style={[styles.textTab, { color: 'white', fontFamily: 'OpenSans-SemiBold', textAlign: 'center' }]}>
                    Combustível
                </Text>
            </Animated.View>
            <Animated.View
                style={{ 
                    position: 'absolute',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: Animated.interpolate(this.animTimingValue, {
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                        extrapolate: Animated.Extrapolate.CLAMP
                    }),
                    left: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [20, ((-15 + MOVE_AXIS_X) * MULTIPLIER_DISTANCE_X)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    ),
                    top: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [0, (-50 * MULTIPLIER_DISTANCE_Y)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    )
                }}
            >
                <AnimatedSurface
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colorAppPrimary,
                        elevation: 4,
                        marginBottom: 5
                    }}
                >
                    <Icon name={'receipt'} type={'material-community'} color={'white'} />
                </AnimatedSurface>
                <Text style={[styles.textTab, { color: 'white', fontFamily: 'OpenSans-SemiBold', textAlign: 'center' }]}>
                    Impostos
                </Text>
            </Animated.View>
            <Animated.View
                style={{ 
                    position: 'absolute',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: Animated.interpolate(this.animTimingValue, {
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                        extrapolate: Animated.Extrapolate.CLAMP
                    }),
                    left: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [20, ((40 + MOVE_AXIS_X) * MULTIPLIER_DISTANCE_X)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    ),
                    top: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [0, (-50 * MULTIPLIER_DISTANCE_Y)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    )
                }}
            >
                <AnimatedSurface
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colorAppPrimary,
                        elevation: 4,
                        marginBottom: 5
                    }}
                >
                    <Icon name={'coins'} type={'material-community'} color={'white'} />
                </AnimatedSurface>
                <Text style={[styles.textTab, { color: 'white', fontFamily: 'OpenSans-SemiBold', textAlign: 'center' }]}>
                    Pedágio
                </Text>
            </Animated.View>
            <Animated.View
                style={{ 
                    position: 'absolute',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 75,
                    opacity: Animated.interpolate(this.animTimingValue, {
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                        extrapolate: Animated.Extrapolate.CLAMP
                    }),
                    left: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [20, ((85 + MOVE_AXIS_X) * MULTIPLIER_DISTANCE_X)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    ),
                    top: Animated.interpolate(
                        this.animTimingValue, {
                            inputRange: [0, 1],
                            outputRange: [0, (-50 * MULTIPLIER_DISTANCE_Y)],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }
                    )
                }}
            >
                <AnimatedSurface
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colorAppPrimary,
                        elevation: 4,
                        marginBottom: 5
                    }}
                >
                    <Icon name={'bank'} type={'material-community'} color={'white'} />
                </AnimatedSurface>
                <Text style={[styles.textTab, { color: 'white', fontFamily: 'OpenSans-SemiBold', textAlign: 'center' }]}>
                    Financiamento
                </Text>
            </Animated.View>
        </React.Fragment>
    )

    renderRippleTab = ({ 
        renderIcon, 
        onTabPress, 
        onTabLongPress, 
        getAccessibilityLabel, 
        tintColor, 
        routeIndex, 
        route, 
        isRouteActive, 
        routeName 
    }) => (
        <Ripple
            rippleCentered
            rippleColor={colorAppPrimary}
            key={routeIndex}
            style={styles.tabButton}
            onPress={() => {
                if (this.touchEnabled) {
                    if (routeName === 'ExpensesTab') {
                        if (!this.lockedAnim) this.runAnimFab();
                    } else {
                        this.closeFab();

                        onTabPress({ route });
                    }
                } 
            }}
            onLongPress={() => {
                if (this.touchEnabled) {
                    if (routeName === 'ExpensesTab') {
                        if (!this.lockedAnim) this.runAnimFab();
                    } else {
                        this.closeFab();

                        onTabLongPress({ route });
                    }
                } 
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
        >
            <View pointerEvents="none">
                {renderIcon({ route, focused: isRouteActive, tintColor })}
                <Text style={[styles.textTab, { color: tintColor }]}>
                    {this.getLabelTab(routeName)}
                </Text>
            </View>
        </Ripple>
    )
    
    render = () => { 
        const {
            renderIcon,
            getLabelText,
            activeTintColor,
            inactiveTintColor,
            onTabPress,
            onTabLongPress,
            getAccessibilityLabel,
            navigation
        } = this.props;
    
        const { routes, index: activeRouteIndex } = navigation.state;
        
        return (
            <React.Fragment>
                <OverlayTouchable 
                    pointerEventsState={this.state.pointerEventsState}
                    animValueFade={this.animTimingValue}
                    onTouch={this.closeFab}
                />
                <AnimatedSurface style={[styles.container, { transform: [{ translateY: this.animTabBarTranslateY }] }]}>
                    {routes.map((route, routeIndex) => {
                        const isRouteActive = routeIndex === activeRouteIndex;
                        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
                        const routeName = getLabelText({ route });
                        const propsTab = { 
                            renderIcon, 
                            onTabPress, 
                            onTabLongPress, 
                            getAccessibilityLabel, 
                            tintColor, 
                            routeIndex, 
                            route, 
                            isRouteActive, 
                            routeName 
                        };

                        if (routeName === 'ExpensesTab') {
                            return this.renderExpenseTab(propsTab);
                        } 

                        return <this.rippleTab {...propsTab} key={routeIndex} />;
                    })}
                </AnimatedSurface>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'row', 
        height: tabBarHeight, 
        elevation: 8
    },
    tabButton: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    textTab: {
        fontSize: 10,
        fontFamily: 'OpenSans-Regular'
    }
});

export default connect(() => ({}), { 
    modifyAnimatedVisible,
    modifyGetAnimTabBarTranslateY,
    modifyCloseFab
})(CustomHomeTabBar);
