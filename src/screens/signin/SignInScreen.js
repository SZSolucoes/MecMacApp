import React from 'react';
import { 
    View,
    Text,
    ScrollView,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Button, SocialIcon } from 'react-native-elements';

import { colorAppSecondary } from '../utils/Constants';

export default class SignInScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            userInfo: ''
        };
    }

    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.onHandleBackPress);
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackPress);
    }

    onHandleBackPress = () => true

    handleGetUserInfo = async () => {
        const infoRequest = new GraphRequest(
            '/me?fields=name,email,picture.type(large)',
            null,
            (error, result) => {
                if (error) {
                    this.setState({ userInfo: `Error fetching data: ${error.toString()}` });
                } else {
                    this.setState({ userInfo: JSON.stringify(result) });
                    this.signInAsync();
                }
            }
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    handleFacebookLogin = () => {
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                    this.setState({ text: 'login is cancelled.' });
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            this.handleGetUserInfo(data.accessToken.toString());
                        }
                    );
                }
            },
            (error) => this.setState({ text: `login has error: ${error}` })
        );
    }

    handleFacebookLogout = async () => {
        const token = await AccessToken.getCurrentAccessToken()
        .then((data) => data.accessToken.toString());

        if (token) {
            const logoutInfo = new GraphRequest(
                    'me/permissions/',
                    {
                        accessToken: token,
                        httpMethod: 'DELETE'
                    },
                    (error/* , result */) => {
                        if (error) {
                            this.setState({ text: 'erro no logout' });
                        } else {
                            LoginManager.logOut();
                            this.setState({ text: 'logout com sucesso' });
                        }
                    });
            new GraphRequestManager().addRequest(logoutInfo).start();
        }
    }

    handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({ userInfo: JSON.stringify(userInfo) });
            this.signInAsync();
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                this.setState({ userInfo: 'canceled' });
            } else if (error.code === statusCodes.IN_PROGRESS) {
                this.setState({ userInfo: 'in progress' });
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                this.setState({ userInfo: 'not play services' });
            } else {
                this.setState({ userInfo: JSON.stringify(error) });
            }
        }
    };

    handleGoogleSignOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ userInfo: 'logout' });
        } catch (error) {
            this.setState({ userInfo: 'erro em logout' });
        }
    };

    signInAsync = async () => {
        try {
            await AsyncStorage.setItem('@isFirstOpened', 'true');
            await AsyncStorage.setItem('@isUserLogged', 'true');
        } catch (e) {
            console.log('AsyncStorage error');
        }

        this.props.navigation.navigate('App');
    };

    render = () => (
        <SafeAreaView style={[styles.viewMain, styles.center]}>
            <SafeAreaView
                style={{
                    flex: 3,
                    padding: 10,
                    flexDirection: 'row'
                }}
            >
                <View
                    style={{
                        flex: 1,
                        margin: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={styles.logoText}>Logo</Text>
                </View>
            </SafeAreaView>
            <SafeAreaView
                style={{
                    flex: 3,
                    padding: 10
                }}
            >
                <Button
                    raised
                    onPress={this.handleFacebookLogin}
                    icon={
                        <SocialIcon
                            type={'facebook'}
                            raised={false}
                            iconSize={18}
                            style={{ margin: 0, marginVertical: 7 }}
                        />
                    }
                    title="Entrar com Facebook"
                    buttonStyle={{
                        backgroundColor: '#3A5998',
                        height: 40,
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}
                />
                <View style={{ marginVertical: 5 }} />
                <Button
                    raised
                    onPress={this.handleGoogleSignIn}
                    icon={
                        <SocialIcon
                            type={'google'}
                            raised={false}
                            iconSize={18}
                            style={{ margin: 0, marginVertical: 7 }}
                        />
                    }
                    title="Entrar com Google"
                    buttonStyle={{
                        backgroundColor: '#ED3739',
                        height: 40,
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}
                />
                <ScrollView>
                    <Text>{this.state.userInfo}</Text>
                </ScrollView>
            </SafeAreaView>
            <SafeAreaView
                style={{
                    flex: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10
                }}
            >
                <Text style={styles.devText}>Desenvolvido por SZ Soluções</Text>
            </SafeAreaView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    viewMain: {
        flex: 1,
        backgroundColor: colorAppSecondary
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    devText: {
        fontSize: 10,
        fontFamily: 'Montserrat-Bold',
    },
    logoText: {
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center'
    }
});
