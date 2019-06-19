import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableRipple, Surface } from 'react-native-paper';
import { colorAppPrimary } from '../utils/Constants';

class CustomHomeTabBar extends React.Component {
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
            <Surface style={styles.container}>
                {routes.map((route, routeIndex) => {
                    const isRouteActive = routeIndex === activeRouteIndex;
                    const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

                    return (
                    <TouchableRipple
                        borderless
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
                    </TouchableRipple>
                    );
                })}
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        height: 52, 
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

export default CustomHomeTabBar;
