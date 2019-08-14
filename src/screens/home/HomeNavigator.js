/* eslint-disable max-len */
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import {
    createMaterialTopTabNavigator
} from 'react-navigation';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SplashScreen from 'react-native-splash-screen';

import CustomHomeTabBar from './CustomHomeTabBar';

import HomeScreen from '../../screens/home/HomeScreen';
/* import ServicesScreen from '../../screens/home/ServicesScreen';
import ProfileScreen from '../../screens/home/ProfileScreen'; */
import { colorAppPrimary } from '../utils/Constants';
import { getWindowWidthPortrait, renderStatusBar } from '../utils/Screen';
import HomeDrawer from './HomeDrawer';
import HomeBottomActionSheet from './HomeBottomActionSheet';
import ManutTabScreen from '../manut_tab/ManutTabScreen';

const BottomTabNavigator = createMaterialTopTabNavigator({
    HomeTab: HomeScreen,
    ManutTab: ManutTabScreen,
    ExpensesTab: View,
    PromotionsTab: View,
    BlogTabs: View,
    /* ServicesTab: ServicesScreen,
    ProfileTab: ProfileScreen */
}, 
{ 
    initialRouteName: 'HomeTab',
    header: null,
    headerMode: 'none',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: false,
    tabBarComponent: CustomHomeTabBar,
    navigationOptions: {
        header: null
    },
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, /* horizontal,*/ tintColor }) => {
            const { routeName } = navigation.state;
            const IconComponent = Icon;
            const iconSize = 25;
            
            let iconName = 'home';

            if (routeName === 'HomeTab') {
                iconName = `home${focused ? '' : '-outline'}`;
            } else if (routeName === 'ManutTab') {
                iconName = `toolbox${focused ? '' : '-outline'}`;
            } else if (routeName === 'ExpensesTab') {
                iconName = 'currency-usd';
            } else if (routeName === 'PromotionsTab') {
                iconName = 'sale';
            } else if (routeName === 'BlogTabs') {
                iconName = 'blogger';
            } /* else if (routeName === 'ServicesTab') {
                iconName = 'magnify';
            } else if (routeName === 'ProfileTab') {
                iconName = `account${focused ? '' : '-outline'}`;
            } */
            
            // You can return any component that you like here!
            return (<IconComponent name={iconName} type='material-community' size={iconSize} color={tintColor} />);
        }
    }),
    tabBarOptions: {
        activeTintColor: colorAppPrimary,
        inactiveTintColor: 'gray',
        style: { borderTopWidth: 0, elevation: 8 }
    },
});

const HomeNavigatorStack = createDrawerNavigator({
        screen: BottomTabNavigator
    },
    {
        drawerWidth: (getWindowWidthPortrait() * 0.83),
        edgeWidth: 80,
        contentComponent: HomeDrawer,
        navigationOptions: {
            header: null
        }
    }
);

BottomTabNavigator.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 1) {
        drawerLockMode = 'locked-closed';
    }

    return {
        drawerLockMode
    };
};

class HomeNavigator extends React.PureComponent {
    static router = HomeNavigatorStack.router;

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        SplashScreen.hide();
    }

    render = () => (
        <View style={{ flex: 1 }}>
            { renderStatusBar('white', 'dark-content') }
            <SafeAreaView style={{ flex: 1 }}>
                <HomeNavigatorStack {...this.props} />
            </SafeAreaView>
            <HomeBottomActionSheet />
        </View>
    );
}

export default HomeNavigator;
