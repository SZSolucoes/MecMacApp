/* eslint-disable max-len */
import React from 'react';
import { 
    createAppContainer, 
    createStackNavigator, 
    createSwitchNavigator,
    createBottomTabNavigator
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import { colorAppPrimary } from './screens/utils/Constants';
import { normalize } from './screens/utils/StringTextFormats';

import CustomHomeTabBar from './screens/tools/CustomHomeTabBar';

import LoadingScreen from './LoadingScreen';
import SignInScreen from './screens/signin/SignInScreen';
import HomeScreen from './screens/home/HomeScreen';
import WelcomeScreen from './WelcomeScreen';
import ServicesScreen from './screens/home/ServicesScreen';
import ProfileScreen from './screens/home/ProfileScreen';
//import TransitionsScreens from './screens/utils/TransitionsScreens';

const styles = {
    title: {
        color: 'white',
        fontSize: normalize(18),
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular'
    },
    titlesmall: {
        color: 'white',
        fontSize: normalize(14),
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular'
    },
    titlevsmall: {
        color: 'white',
        fontSize: normalize(12),
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular'
    },
};

// Rotas do start na aplicacao
const StartStack = createStackNavigator(
    { 
        Loading: {
            screen: LoadingScreen
        },
        Welcome: {
            screen: WelcomeScreen
        }
    }
);

// Rotas de autenticacao
const AuthStack = createStackNavigator(
    { 
        SignIn: SignInScreen 
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: colorAppPrimary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                ...styles.title
            },
        }
    }
);

// Rotas principais
const AppStack = createStackNavigator(
    { 
        Home: {
            screen: createBottomTabNavigator({
                HomeTab: HomeScreen,
                ServicesTab: ServicesScreen,
                ProfileTab: ProfileScreen
            }, 
            { 
                initialRouteName: 'HomeTab',
                header: null,
                headerMode: 'none',
                tabBarComponent: CustomHomeTabBar,
                navigationOptions: {
                    header: null
                },
                defaultNavigationOptions: ({ navigation }) => ({
                    tabBarIcon: ({ focused, /* horizontal,*/ tintColor }) => {
                        const { routeName } = navigation.state;
                        const IconComponent = Icon;
                        let iconName;
                        if (routeName === 'HomeTab') {
                            iconName = `home${focused ? '' : '-outline'}`;
                            // Sometimes we want to add badges to some icons. 
                            // You can check the implementation below.
                            //IconComponent = HomeIconWithBadge; 
                        } else if (routeName === 'ServicesTab') {
                            iconName = 'magnify';
                        } else if (routeName === 'ProfileTab') {
                            iconName = `account${focused ? '' : '-outline'}`;
                        }
                        
                        // You can return any component that you like here!
                        return (<IconComponent name={iconName} type='material-community' size={25} color={tintColor} />);
                    },
                }),
                tabBarOptions: {
                    activeTintColor: colorAppPrimary,
                    inactiveTintColor: 'gray',
                    style: { borderTopWidth: 0, elevation: 8 }
                },
            }),
        }
    },
    {
        initialRouteName: 'Home',
        //transitionConfig: TransitionsScreens
    }
);


const Routes = createAppContainer(createSwitchNavigator(
    {
        Start: StartStack,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Start',
        //transitionConfig: TransitionsScreens
    }
));

export default Routes;
