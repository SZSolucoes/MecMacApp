import React, { Component } from 'react';
import {
    Text,
    View,
    Easing,
    Animated,
    AppState,
    StyleSheet,
    BackHandler,
    SafeAreaView,
    TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';
import { Pages } from 'react-native-pages';
import SplashScreen from 'react-native-splash-screen';

import welcomevideo from './assets/videos/welcomevideo.mp4';
import { renderOpacityStatusBar } from './screens/utils/Screen';

export default class WelcomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.animTabsOpacity = new Animated.Value(0);

        this.state = {
            videoPaused: false
        };
    }

    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.onHandleBackPress);
        AppState.addEventListener('change', this.onHandleAppStateChange);
    }
    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackPress);
        AppState.removeEventListener('change', this.onHandleAppStateChange);
    }

    onHandleAppStateChange = (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            this.setState({ videoPaused: true });
        } else {
            this.setState({ videoPaused: false });
        }
    }

    onHandleBackPress = () => true

    onVideoBuffer = () => true

    onVideoLoad = () => {
        SplashScreen.hide();
        this.doAnimTabsOpacity();
    }

    onVideoError = () => true

    doAnimTabsOpacity = async () => {
        Animated.timing(this.animTabsOpacity, {
            toValue: 1,
            delay: 200,
            duration: 1000,
            easing: Easing.linear
        }).start();
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            { renderOpacityStatusBar(0.6) }
            <Video 
                source={welcomevideo}
                ref={ref => (this.videoPlayer = ref)}
                paused={this.state.videoPaused}
                style={styles.backgroundVideo}
                resizeMode={'cover'}
                onBuffer={this.onVideoBuffer}
                onLoad={this.onVideoLoad}
                onError={this.onVideoError}
                repeat
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Animated.View
                    style={{ 
                        flex: 1,
                        opacity: this.animTabsOpacity
                    }}
                >  
                    <SafeAreaView style={{ flex: 10, padding: 20 }}>
                        <SafeAreaView style={{ marginVertical: 30 }} />
                        <SafeAreaView style={styles.viewLogo}>
                            <SafeAreaView 
                                style={{ 
                                    width: 80, 
                                    height: 80, 
                                    borderRadius: 40, 
                                    borderWidth: 2, 
                                    borderColor: 'white' 
                                }} 
                            />
                            <SafeAreaView style={{ position: 'absolute' }}>
                                <Text style={{ fontSize: 13, color: 'white' }}>Logo Marca</Text>
                            </SafeAreaView>
                        </SafeAreaView>
                        <Pages
                            startPage={0}
                            style={{ 
                                flex: 1
                            }}
                        >
                            <View style={styles.center}>
                                <Text
                                    style={styles.textCenterTitle}
                                >
                                    Bem-vindo ao
                                </Text>
                                <Text
                                    style={styles.textCenterTitle}
                                >
                                    MecMac
                                </Text>
                                <View style={{ marginVertical: 10 }} />
                                <Text
                                    style={styles.textCenterSubtitle}
                                >
                                    Acompanhe a manutenção do seu veículo 
                                    e encontre os melhores serviços disponíveis
                                </Text>
                            </View>
                            <View style={styles.center}>
                                <Text
                                    style={styles.textCenterSubtitle}
                                >
                                    Página 2
                                </Text>
                            </View>
                            <View style={styles.center}>
                                <Text
                                    style={styles.textCenterSubtitle}
                                >
                                    Página 3
                                </Text>
                            </View>
                            <View style={styles.center}>
                                <Text
                                    style={styles.textCenterSubtitle}
                                >
                                    Página 4
                                </Text>
                            </View>
                        </Pages>
                    </SafeAreaView>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('SignIn')}
                    >
                        <SafeAreaView 
                            style={{ 
                                flex: 1, 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                borderTopColor: 'rgba(255, 255, 255, 0.6)', 
                                borderTopWidth: 0.5
                            }}
                        >
                            <Text
                                style={{ color: 'white', textAlign: 'center' }}
                            >
                                VAMOS COMEÇAR
                            </Text>
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </SafeAreaView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'black'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    center: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        padding: 35
    },
    textCenterTitle: { 
        fontSize: 24,
        fontFamily: 'OpenSans-Bold',
        color: 'white', 
        textAlign: 'center' 
    },
    textCenterSubtitle: {
        fontFamily: 'OpenSans-SemiBold',
        color: 'white', 
        textAlign: 'center'
    },
    viewLogo: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textMontserrat: {
        fontFamily: 'OpenSans-Regular',
        color: 'white',
        textAlign: 'center'
    }
});
