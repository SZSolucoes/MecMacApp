/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    Alert,
    ScrollView,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { List, Divider, Appbar } from 'react-native-paper';

import { Pages } from 'react-native-pages';
import { Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { colorAppForeground } from '../utils/Constants';
import ProfileScreenFragment from './ProfileScreenFragment';

class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.currentPage = 0;

        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });

        this.state = {
            userInfo: {}
        };
    }

    componentDidMount = async () => {
        const userInfoJsonString = await AsyncStorage.getItem('@userProfileJson');
        if (userInfoJsonString) {
            const userInfo = JSON.parse(userInfoJsonString);

            if (userInfo) {
                this.setState({ userInfo });
            }
        }

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => {
        const routeName = this.props.navigation.state.routeName;

        if (routeName === 'ProfileTab') {
            if (this.currentPage > 0) {
                const pageToBack = this.currentPage - 1;

                if (pageToBack === 0) {
                    this.backToProfile();
                } else {
                    this.swiperRef.scrollToPage(this.currentPage - 1);
                }

                this.currentPage = pageToBack;

                return true;
            }
        }

        return false;
    }

    onPressItemList = async (itemName) => {
        if (itemName === 'profile_exit') {
            try {
                Alert.alert(
                    'Aviso', 
                    'Desejar encerrar a sessão e sair para a tela de login ?',
                    [
                        { text: 'Cancelar', onPress: () => false },
                        { 
                            text: 'Sim', 
                            onPress: async () => {
                                await AsyncStorage.removeItem('@isFirstOpened');
                                await AsyncStorage.removeItem('@isUserLogged');
                                await AsyncStorage.removeItem('@userProfileJson');

                                this.props.navigation.navigate('Auth');
                            }
                        }
                    ],
                    { cancelable: true }
                );
            } catch (e) {
                console.log('AsyncStorage error');
            }
        } else if (itemName === 'profile_next') {
            if (this.swiperRef) {
                this.swiperRef.scrollToPage(1);
                this.currentPage = 1;
            } 
            if (this.props.animatedVisible) {
                this.props.animatedVisible('hide', 200);
            }
        }
    }

    backToProfile = () => {
        if (this.swiperRef) {
            this.swiperRef.scrollToPage(0);
            if (this.props.animatedVisible) {
                this.props.animatedVisible('visible', 200);
            }
        }
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Pages
                ref={ref => (this.swiperRef = ref)}
                scrollEnabled={false}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                indicatorPosition={'none'}
            >
                <View style={{ flex: 1 }}>
                    <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
                        { this.state.userInfo.name ? 
                            (
                                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
                                    <ListItem
                                        leftAvatar={{ 
                                            source: { uri: this.state.userInfo.photourl },
                                        }}
                                        title={this.state.userInfo.name}
                                        titleStyle={{ fontFamily: 'OpenSans-Regular', fontSize: 18, fontWeight: '400' }}
                                        containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                                    />
                                </View>
                            )
                            :
                            (
                                <Appbar.Content title={'Perfil'} titleStyle={{ fontFamily: 'OpenSans-Regular' }} />
                            )
                        }
                    </Appbar.Header>
                    <ScrollView style={{ marginTop: 1 }}>
                        <View style={{ backgroundColor: 'white' }}>
                            <List.Item
                                title="Item 1"
                                onPress={() => this.onPressItemList('profile_next')}
                                left={() => <List.Icon icon="folder" />}
                                right={() => <Icon size={20} color="gray" name="ios-arrow-forward" type={'ionicon'} containerStyle={styles.iconContainer} />}
                                style={{ backgroundColor: 'white' }}
                            />
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                <Divider />
                            </View>
                            <List.Item
                                title="Item 2"
                                onPress={() => this.onPressItemList('profile_next')}
                                titleStyle={{ color: 'black' }}
                                left={() => <List.Icon color="#000" icon="folder" />}
                                right={() => <Icon size={20} color="gray" name="ios-arrow-forward" type={'ionicon'} containerStyle={styles.iconContainer} />}
                                style={{ backgroundColor: 'white' }}
                            />
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                <Divider />
                            </View>
                            <List.Item
                                title="Sair"
                                onPress={() => this.onPressItemList('profile_exit')}
                                titleStyle={{ color: 'red' }}
                                left={() => <Icon size={26} name="ios-log-out" type={'ionicon'} containerStyle={[styles.iconContainer, { marginLeft: 10 }]} />}
                            />
                        </View>
                        <View style={{ marginVertical: 60 }} />
                    </ScrollView>
                </View>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <ProfileScreenFragment backToProfile={this.backToProfile} />
                </View>
            </Pages>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colorAppForeground
    },
    iconContainer: {
        marginVertical: 8,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible
});

export default connect(mapStateToProps)(ProfileScreen);
