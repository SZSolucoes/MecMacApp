/* eslint-disable max-len */
import { 
    createAppContainer, 
    createStackNavigator, 
    createSwitchNavigator
    /* createDrawerNavigator */
} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { colorAppPrimary } from './screens/utils/Constants';
import { normalize } from './screens/utils/StringTextFormats';

import HomeNavigator from './screens/home/HomeNavigator';

import LoadingScreen from './LoadingScreen';
import SignInScreen from './screens/signin/SignInScreen';
import WelcomeScreen from './WelcomeScreen';
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
