/* eslint-disable max-len */
import React from 'react';
import { 
    createAppContainer, 
    createStackNavigator
    /* createDrawerNavigator */
} from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import { colorAppPrimary } from './screens/utils/Constants';
import { normalize } from './screens/utils/StringTextFormats';

import HomeNavigator from './screens/home/HomeNavigator';

import LoadingScreen from './LoadingScreen';
import SignInScreen from './screens/signin/SignInScreen';
import WelcomeScreen from './WelcomeScreen';
import AddVehicleScreen from './screens/home/drawer_vehicles/AddVehicleScreen';
import AddVehicleFragmentScreen from './screens/home/drawer_vehicles/AddVehicleFragmentScreen';
import TransitionsScreens from './screens/utils/TransitionsScreens';
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
            screen: HomeNavigator
        },
        AddVehicle: {
            screen: AddVehicleScreen
        },
        AddVehicleFragment: {
            screen: AddVehicleFragmentScreen
        }
    },
    {
        initialRouteName: 'AddVehicle',
        transitionConfig: TransitionsScreens
    }
);

const Routes = createAppContainer(createAnimatedSwitchNavigator(
    {
        Start: StartStack,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Start',
        transition: (
            <Transition.In type={'fade'} durationMs={200} delayMs={200} />
        )
    }
));

export default Routes;
