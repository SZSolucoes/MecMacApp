import React, { Component } from 'react';
import { 
    View,
    Text,
    Easing,
    Animated,
    StatusBar,
    StyleSheet,
    BackHandler, 
} from 'react-native';
import Video from 'react-native-video';
import { Swiper } from 'react-native-awesome-viewpager';

import welcomevideo from './assets/videos/welcomevideo.mp4';

export default class WelcomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.animTabsOpacity = new Animated.Value(0);
    }

    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.onHandleBackPress);
    }
    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackPress);
    }

    onHandleBackPress = () => true

    onVideoBuffer = () => true

    onVideoLoad = () => this.doAnimTabsOpacity()

    onVideoError = () => true

    doAnimTabsOpacity = async () => {
        Animated.timing(this.animTabsOpacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear
        }).start();
    }

    render = () => (
        <View style={styles.mainView}>
            <StatusBar 
                backgroundColor={'rgba(0, 0, 0, 0.5)'}
                translucent
            />
            <Video 
                source={welcomevideo}
                ref={ref => (this.videoPlayer = ref)}
                style={styles.backgroundVideo}
                resizeMode={'cover'}
                onBuffer={this.onVideoBuffer}
                onLoad={this.onVideoLoad}
                onError={this.onVideoError}
                repeat
            />
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Animated.View
                    style={{ 
                        flex: 1,
                        opacity: this.animTabsOpacity
                    }}
                >  
                    <View style={{ flex: 10, padding: 20 }}>
                        <View style={{ marginVertical: 30 }} />
                        <View style={styles.viewLogo}>
                            <View 
                                style={{ 
                                    width: 80, 
                                    height: 80, 
                                    borderRadius: 40, 
                                    borderWidth: 2, 
                                    borderColor: 'white' 
                                }} 
                            />
                            <View style={{ position: 'absolute' }}>
                                <Text style={{ fontSize: 13, color: 'white' }}>Logo Marca</Text>
                            </View>
                        </View>
                        <Swiper
                            ref='ViewPager'
                            autoplay={false}
                            interval={2000}
                            scrollEnabled
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
                                    style={{ color: 'white' }}
                                >
                                    Página 2
                                </Text>
                            </View>
                            <View style={styles.center}>
                                <Text
                                    style={{ color: 'white' }}
                                >
                                    Página 3
                                </Text>
                            </View>
                            <View style={styles.center}>
                                <Text
                                    style={{ color: 'white' }}
                                >
                                    Página 4
                                </Text>
                            </View>
                        </Swiper>
                    </View>
                    <View 
                        style={{ 
                            flex: 1, 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            borderTopColor: 'white', 
                            borderTopWidth: 0.2 
                        }}
                    >
                        <Text
                            style={{ color: 'white', textAlign: 'center' }}
                        >
                            VAMOS COMEÇAR
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    center: {
        alignItems: 'center',
        padding: 35
    },
    textCenterTitle: { 
        fontSize: 24, 
        fontWeight: '400', 
        color: 'white', 
        textAlign: 'center' 
    },
    textCenterSubtitle: {
        color: 'white', 
        textAlign: 'center'
    },
    viewLogo: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
