/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { Text, Surface } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';

import { colorAppPrimary } from '../utils/Constants';
import { modifyAnimatedVisible } from '../../actions/CustomHomeTabBarActions';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const tabBarHeight = 52;

class CustomHomeTabBar extends React.PureComponent {
    
    constructor(props) {
        super(props);
        
        this.animTabBarTranslateY = new Animated.Value(0);
    }
    
    componentDidMount = () => { 
        if (this.props.modifyAnimatedVisible) this.props.modifyAnimatedVisible(this.animateVisible);
    }

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
                            onTabPress({ route });
                        }}
                        onLongPress={() => {
                            onTabLongPress({ route });
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

export default connect(() => ({}), { modifyAnimatedVisible })(CustomHomeTabBar);
