import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import LoadingScreen from './LoadingScreen';
import SignInScreen from './screens/signin/SignInScreen';
import HomeScreen from './screens/home/HomeScreen';
import WelcomeScreen from './WelcomeScreen';
//import TransitionsScreens from './screens/utils/TransitionsScreens';

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
const AuthStack = createStackNavigator({ SignInScreen });

// Rotas da home
const AppStack = createStackNavigator(
    { 
        Home: {
            screen: HomeScreen
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
