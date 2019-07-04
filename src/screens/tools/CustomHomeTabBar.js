/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, Easing } from 'react-native';
import { connect } from 'react-redux';
import { Text, Surface } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import Animated from 'react-native-reanimated';

import { colorAppPrimary, tabBarHeight } from '../utils/Constants';
import { modifyAnimatedVisible, modifyGetAnimTabBarTranslateY } from '../../actions/CustomHomeTabBarActions';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const { Value } = Animated;

class CustomHomeTabBar extends React.PureComponent {
    
    constructor(props) {
        super(props);
        
        this.animTabBarTranslateY = new Value(0);
        this.touchEnabled = true;
    }
    
    componentDidMount = () => { 
        if (this.props.modifyAnimatedVisible) this.props.modifyAnimatedVisible(this.animateVisible);
        if (this.props.modifyGetAnimTabBarTranslateY) this.props.modifyGetAnimTabBarTranslateY(this.getAnimTabBarTranslateY);
    }

    getAnimTabBarTranslateY = () => this.animTabBarTranslateY

    getLabelTab = (labelScreen) => {
        switch (labelScreen) {
            case 'HomeTab':
                return 'Início';
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
            <AnimatedSurface style={[styles.container, { transform: [{ translateY: this.animTabBarTranslateY }] }]}>
                {routes.map((route, routeIndex) => {
                    const isRouteActive = routeIndex === activeRouteIndex;
                    const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

                    return (
                    <Ripple
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        key={routeIndex}
                        style={styles.tabButton}
                        onPress={() => {
                            if (this.touchEnabled) onTabPress({ route });
                        }}
                        onLongPress={() => {
                            if (this.touchEnabled) onTabLongPress({ route });
                        }}
                        accessibilityLabel={getAccessibilityLabel({ route })}
                    >
                        <View pointerEvents="none">
                            {renderIcon({ route, focused: isRouteActive, tintColor })}
                            <Text style={[styles.textTab, { color: tintColor }]}>
                                {this.getLabelTab(getLabelText({ route }))}
                            </Text>
                        </View>
                    </Ripple>
                    );
                })}
            </AnimatedSurface>
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
        fontFamily: 'OpenSans-Regular'
    }
});

export default connect(() => ({}), { 
    modifyAnimatedVisible,
    modifyGetAnimTabBarTranslateY 
})(CustomHomeTabBar);
