/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    Text,
    Image,
    Platform,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
/* import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk'; */
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Button, SocialIcon, Icon } from 'react-native-elements';
import { Appbar, Divider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import Images from '../utils/AssetsManager';
import { colorAppPrimary, DESENV_EMAIL } from '../utils/Constants';
import { getDeviceInfos } from '../utils/device/DeviceInfos';

import { apiPostUser, apiGetUserVehicles } from '../utils/api/ApiManagerConsumer';
import { initializeBatchs } from '../utils/InitConfigs';
import { renderOpacityStatusBar } from '../utils/Screen';
import { modifyHandleFacebookLogout, modifyHandleGoogleLogout } from '../../actions/SignInActions';

const { 
    imgLogo 
} = Images;

class SignInScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            disableButtons: false
        };
    }

    componentDidMount = async () => {
        SplashScreen.hide();
        BackHandler.addEventListener('hardwareBackPress', this.onHandleBackPress);

        if (this.props.modifyHandleFacebookLogout && this.props.modifyHandleGoogleLogout) {
            this.props.modifyHandleFacebookLogout(this.handleFacebookLogout);
            this.props.modifyHandleGoogleLogout(this.handleGoogleSignOut);
        }
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackPress);
    }

    onHandleBackPress = () => true

    /* handleGetUserInfo = async () => {
        const infoRequest = new GraphRequest(
            '/me?fields=name,email,picture.type(large)',
            null,
            (error, result) => {
                if (error) {
                    this.setState({ disableButtons: false });
                } else {
                    const userInfo = result;
                    const userJson = {};

                    if (userInfo && userInfo.email && userInfo.name) {
                        userJson.email = userInfo.email;
                        userJson.name = userInfo.name;
                        userJson.isFacebook = true;

                        if (userInfo.picture && userInfo.picture.data && userInfo.picture.data.url) {
                            userJson.photourl = userInfo.picture.data.url;
                        }
                    }
                     
                    this.signInAsync(userJson);
                    this.setState({ disableButtons: false });
                }
            }
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
    } */

    handleEmailLogin = () => this.signInAsync({ isEmail: true })

    /* handleFacebookLogin = () => {
        this.setState({ disableButtons: true });

        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            async (result) => {
                if (result.isCancelled) {
                    console.log('Facebook: login cancelado');
                    this.setState({ disableButtons: false });
                } else {
                    await AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            this.handleGetUserInfo(data.accessToken.toString());
                        }
                    );

                    this.setState({ disableButtons: false });
                }
            },
            () => { console.log('Facebook: erro em logout'); this.setState({ disableButtons: false }); }
        );
    } */

    /* handleFacebookLogout = async () => {
        try {
            const token = await AccessToken.getCurrentAccessToken()
            .then((data) => {
                if (data && data.accessToken) return data.accessToken.toString();
            });
    
            if (token) {
                const logoutInfo = new GraphRequest(
                        'me/permissions/',
                        {
                            accessToken: token,
                            httpMethod: 'DELETE'
                        },
                        (error) => {
                            if (error) {
                                console.log('Facebook: erro em logout');
                            } else {
                                LoginManager.logOut();
                            }
                        });
                new GraphRequestManager().addRequest(logoutInfo).start();
            } else {
                LoginManager.logOut();
            }
        } catch (e) {
            console.log('Facebook: erro em logout');
        }
    } */

    handleGoogleSignIn = async () => {
        this.setState({ disableButtons: true });

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const userJson = {};

            if (userInfo && userInfo.user && userInfo.user.email && userInfo.user.name) {
                userJson.email = userInfo.user.email;
                userJson.name = userInfo.user.name;
                userJson.isGoogle = true;

                if (userInfo.user.photo) {
                    userJson.photourl = userInfo.user.photo;
                }
            }

            this.signInAsync(userJson);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Google: login cancelado');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Google: login em progresso');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Google: google play service não disponivel');
            } else {
                console.log('Google: erro desconhecido em login');
            }
        }

        this.setState({ disableButtons: false });
    };

    handleGoogleSignOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            console.log('Google: erro em logout');
        }
    };

    signInAsync = async (userJson = {}) => {
        try {
            await AsyncStorage.setItem('@isFirstOpened', 'true');
            await AsyncStorage.setItem('@isUserLogged', 'true');
            if (Object.keys(userJson).length) {
                await AsyncStorage.setItem('@userProfileJson', JSON.stringify(userJson));
            }

            const asyncFunExec = async () => {
                const deviceInfos = await getDeviceInfos();
                const userProfileUrl = userJson.isEmail ? { user_profile_url: userJson.photourl } : {};
                const userProfileUrlGoogle = userJson.isGoogle ? { user_profile_google_url: userJson.photourl } : {};
                const userProfileUrlFacebook = userJson.isFacebook ? { user_profile_fb_url: userJson.photourl } : {};

                const params = {
                    user_name: userJson.name,
                    user_email: userJson.email,
                    ...userProfileUrl,
                    ...userProfileUrlGoogle,
                    ...userProfileUrlFacebook,
                    device_user_name: userJson.name,
                    device_user_email: userJson.email,
                    ...deviceInfos
                };

                try {
                    apiPostUser(params);
                } catch (e) {
                    console.log('apiPostUser error');
                }
            };

            asyncFunExec();
        } catch (e) {
            console.log('AsyncStorage error');
        }

        try {
            const email = userJson.email || DESENV_EMAIL;
            const vehicles = await apiGetUserVehicles({ user_email: email });

            if (vehicles && vehicles.data && vehicles.data.data && vehicles.data.data.length) {
                this.props.navigation.navigate('SelectVehicle', { vehiclesData: [...vehicles.data.data] });
                return;
            }
        } catch (e) {
            console.log(e);
        }

        this.props.navigation.navigate('Home');
        initializeBatchs();
    };

    render = () => (
        <View style={styles.viewMain}>
            { renderOpacityStatusBar(0.2, Platform.OS === 'ios' ? 'light-content' : 'default') }
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image source={imgLogo} resizeMode={'contain'} style={{ width: '80%', height: '80%', opacity: 0.2 }} />
            </View>
            <View style={{ width: '100%', height: 56 }}>
                <Appbar.Content 
                    title={'Entrar'} 
                    titleStyle={{ textAlign: 'center', color: 'white' }} 
                    style={{ alignItems: 'center', justifyContent: 'center' }} 
                />
            </View>
            <SafeAreaView style={[{ flex: 1 }, styles.center]}>
                <SafeAreaView
                    style={{
                        flex: 1.5,
                        paddingHorizontal: 40,
                        width: '100%',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button
                        raised
                        disabled={this.state.disableButtons}
                        disabledStyle={{ backgroundColor: 'white' }}
                        onPress={this.handleEmailLogin}
                        icon={
                            <Icon
                                name={'email-outline'}
                                type={'material-community'}
                                color={colorAppPrimary}
                                iconSize={28}
                                containerStyle={{ marginHorizontal: 10 }}
                            />
                        }
                        title="Entrar com tester  "
                        titleStyle={{ color: 'black' }}
                        buttonStyle={{
                            backgroundColor: 'white',
                            height: 52,
                            width: '100%',
                            justifyContent: 'center',
                            paddingRight: 30
                        }}
                        ViewComponent={(props) => <View {...props} pointerEvents={'box-only'} />}
                    />
                </SafeAreaView>
                <SafeAreaView
                    style={{
                        flex: 1,
                        padding: 20,
                        flexDirection: 'row',
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}
                >
                    <Divider style={{ flex: 4, backgroundColor: 'white' }} />
                    <View 
                        style={{ 
                            flex: 1, 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            paddingBottom: 4 
                        }}
                    >
                        <Text style={{ color: 'white' }}>ou</Text>
                    </View>
                    <Divider style={{ flex: 4, backgroundColor: 'white' }} />
                </SafeAreaView>
                <SafeAreaView
                    style={{
                        flex: 2.5,
                        paddingHorizontal: 40,
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}
                >
                    <Button
                        raised
                        disabled/* ={this.state.disableButtons} */
                        disabledStyle={{ backgroundColor: '#3A5998' }}
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
                            height: 52,
                            width: '100%',
                            justifyContent: 'center'
                        }}
                        ViewComponent={(props) => <View {...props} pointerEvents={'box-only'} />}
                    />
                    <View style={{ marginVertical: 5 }} />
                    <Button
                        raised
                        disabled={this.state.disableButtons}
                        disabledStyle={{ backgroundColor: '#ED3739' }}
                        onPress={this.handleGoogleSignIn}
                        icon={
                            <SocialIcon
                                type={'google'}
                                raised={false}
                                iconSize={18}
                                style={{ margin: 0, marginVertical: 7 }}
                            />
                        }
                        title="Entrar com Google     "
                        buttonStyle={{
                            backgroundColor: '#ED3739',
                            height: 52,
                            width: '100%',
                            justifyContent: 'center'
                        }}
                        ViewComponent={(props) => <View {...props} pointerEvents={'box-only'} />}
                    />
                </SafeAreaView>
                <SafeAreaView
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: 10
                    }}
                >
                    <Text 
                        style={{ color: 'white' }}
                    >É novo por aqui? <Text style={{ fontFamily: 'OpenSans-Bold' }}>Criar uma conta</Text>
                    </Text>
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
        </View>
    )
}

const styles = StyleSheet.create({
    viewMain: {
        flex: 1,
        backgroundColor: colorAppPrimary
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    devText: {
        fontSize: 10,
        fontFamily: 'Montserrat-Thin',
        color: 'white'
    },
    logoText: {
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center'
    }
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
    modifyHandleFacebookLogout, 
    modifyHandleGoogleLogout
})(SignInScreen);
