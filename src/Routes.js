/* eslint-disable max-len */
import React from 'react';
import { 
    createAppContainer, 
    createStackNavigator
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
import ProfileScreen from './screens/home/ProfileScreen';
import SelectVehicleScreen from './screens/select_vehicle/SelectVehicleScreen';

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

const AppStack = createStackNavigator(
    { 
        Loading: {
            screen: LoadingScreen
        },
        Welcome: {
            screen: WelcomeScreen
        },
        SignIn: SignInScreen,
        SelectVehicle: {
            screen: SelectVehicleScreen
        },
        Home: {
            screen: HomeNavigator
        },
        AddVehicle: {
            screen: AddVehicleScreen
        },
        AddVehicleFragment: {
            screen: AddVehicleFragmentScreen
        },
        Profile: {
            screen: ProfileScreen
        }
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

const Routes = createAppContainer(createAnimatedSwitchNavigator(
    {
        App: AppStack,
    },
    {
        initialRouteName: 'App',
        transition: (
            <Transition.In type={'fade'} durationMs={200} delayMs={200} />
        )
    }
));

export default Routes;
