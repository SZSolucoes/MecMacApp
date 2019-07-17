/* eslint-disable max-len */
import React from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler, Text, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Surface } from 'react-native-paper';
import { Pages } from 'react-native-pages';
import { Icon } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';

import { renderStatusBar } from '../../utils/Screen';
import HeaderDefault from '../../tools/HeaderDefault';
import { colorAppForeground, tabBarHeight, colorAppPrimary } from '../../utils/Constants';
import FormInitial from './FormInitial';
import FormKM from './FormKM';
import FormComplete from './FormComplete';
import { runSpring } from '../../utils/ReanimatedUtils';
import { 
    modifyResetFields, 
    modifyBannerVisible, 
    modifyBannerText, 
    modifyAlertVisible, 
    modifyAlertTitle, 
    modifyAlertMessage, 
    modifyAlertConfirmFunction,
    modifyAlertCancelFunction
} from '../../../actions/AddVehicleActions';
import AddVehicleBanner from './AddVehicleBanner';
import AddVehicleAlert from './AddVehicleAlert';
import { store } from '../../../App';

const PAGEINITIAL = 0;
const PAGEKM = 1;
const PAGECOMPLETE = 2;

const BUTTON_HIDED = 0;
const BUTTON_VISIBLE = 1;

const MAXSCALE = 1.3;

const { Value, cond, set, block, greaterThan, lessThan, and, eq } = Animated;

class AddVehicleScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.refPages = React.createRef();
        this.lockedSwitchPage = true;

        this.state = {
            currentPage: 0,
            bannerVisible: true
        };

        this.animProgressPage = new Value(-1);

        this.animPageInitialValue = new Value(0);
        this.animPageKMValue = new Value(-1);
        this.animPageCompleteValue = new Value(-1);

        this.animBtnTranslateYTrigger = new Value(1);
        this.animBtnTranslateY = new Value(0);

        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            Keyboard.addListener('keyboardDidShow', this.onKeyBoardDidShow);
            Keyboard.addListener('keyboardDidHide', this.onKeyBoardDidHide);
        });
    }
    
    componentDidMount = () => {
        SplashScreen.hide();
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            Keyboard.removeListener('keyboardDidShow', this.onKeyBoardDidShow);
            Keyboard.removeListener('keyboardDidHide', this.onKeyBoardDidHide);

            this.animBtnTranslateYTrigger.setValue(BUTTON_VISIBLE);
        });

        this.lockedSwitchPage = false;
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        Keyboard.removeListener('keyboardDidShow', this.onKeyBoardDidShow);
        Keyboard.removeListener('keyboardDidHide', this.onKeyBoardDidHide);

        this.props.modifyResetFields();
    }

    onKeyBoardDidShow = () => {
        this.animBtnTranslateYTrigger.setValue(BUTTON_HIDED);
    }
    
    onKeyBoardDidHide = () => {
        this.animBtnTranslateYTrigger.setValue(BUTTON_VISIBLE);
    }
    
    onBackButtonPressAndroid = () => {
        const { currentPage } = this.state;

        this.props.modifyBannerVisible(false);

        if (!this.lockedSwitchPage && currentPage === PAGEINITIAL) {
            this.onPressBackButton();

            return true;
        } else if (!this.lockedSwitchPage && currentPage === PAGEKM) {
            this.setLockedSwitchPage();

            this.refPages.current.scrollToPage(PAGEINITIAL);
            this.setState({ currentPage: PAGEINITIAL });

            return true;
        } else if (!this.lockedSwitchPage && currentPage === PAGECOMPLETE) {
            this.setLockedSwitchPage();

            this.refPages.current.scrollToPage(PAGEKM);
            this.setState({ currentPage: PAGEKM });

            return true;
        } else if (this.lockedSwitchPage) {
            return true;
        }

        return false;
    }

    onPressBackButton = () => this.props.navigation.goBack()

    onPressNextOrFinish = async () => {
        const screenValid = await this.validateScreens();

        if (screenValid) {
            const { currentPage } = this.state;
    
            if (!this.lockedSwitchPage && currentPage === PAGEINITIAL) {
                this.setLockedSwitchPage();
    
                this.refPages.current.scrollToPage(PAGEKM);
                this.setState({ currentPage: PAGEKM });
            } else if (!this.lockedSwitchPage && currentPage === PAGEKM) {
                this.setLockedSwitchPage();
    
                this.refPages.current.scrollToPage(PAGECOMPLETE);
                this.setState({ currentPage: PAGECOMPLETE });
            } else if (!this.lockedSwitchPage && currentPage === PAGECOMPLETE) {
                //alert('finalizou');
            }
        }
    }

    onManualPressNumbers = (pageNumber) => {
        const { currentPage } = this.state;

        if (!this.lockedSwitchPage && pageNumber === PAGEINITIAL) {
            this.setLockedSwitchPage();

            this.refPages.current.scrollToPage(PAGEINITIAL);
            this.setState({ currentPage: PAGEINITIAL });
        } else if (!this.lockedSwitchPage && pageNumber === PAGEKM && currentPage === PAGECOMPLETE) {
            this.setLockedSwitchPage();

            this.refPages.current.scrollToPage(PAGEKM);
            this.setState({ currentPage: PAGEKM });
        }
    }

    onScrollPageEnd = () => (this.lockedSwitchPage = false)

    setLockedSwitchPage = () => { 
        this.lockedSwitchPage = true;

        setTimeout(() => { 
            if (this.lockedSwitchPage) this.lockedSwitchPage = false; 
        }, 2000);
    }

    validateScreens = async () => {
        const {
            manufacturer,
            model,
        } = this.props;

        const quilometers = store.getState().AddVehicleReducer.quilometers;

        const { currentPage } = this.state;

        if (currentPage === PAGEINITIAL && (!manufacturer || !model)) {
            this.props.modifyBannerText('Os campos ( Marca e Modelo ) devem ser preenchidos para prosseguir.');
            this.props.modifyBannerVisible(true);
            return false;
        }

        if (currentPage === PAGEKM && !quilometers) {
            const funPromise = new Promise((resolve) => {
                this.props.modifyAlertTitle('Aviso');
                this.props.modifyAlertMessage('O Acompanhamento de manutenção do veículo será menos otimizado sem a quilometragem. Deseja realmente continuar?');
                this.props.modifyAlertConfirmFunction((doHideAlert) => { doHideAlert(); resolve(true); });
                this.props.modifyAlertCancelFunction((doHideAlert) => { doHideAlert(); resolve(false); });
                this.props.modifyAlertVisible(true);
            });

            return funPromise;
        }

        return true;
    }

    render = () => (
        <View style={{ flex: 1 }}>
            <Animated.Code>
                {
                    () =>
                        block([
                            cond(
                                and(greaterThan(this.animProgressPage, 0), lessThan(this.animProgressPage, 1)),
                                [
                                    set(this.animPageInitialValue, this.animProgressPage),
                                    set(this.animPageKMValue, this.animProgressPage)
                                ]
                            ),
                            cond(
                                and(greaterThan(this.animProgressPage, 1), lessThan(this.animProgressPage, 2)),
                                [
                                    set(this.animPageKMValue, this.animProgressPage),
                                    set(this.animPageCompleteValue, this.animProgressPage)
                                ]
                            )
                        ])
                }
            </Animated.Code>
            <Animated.Code>
                {
                    () =>
                        block([
                            cond(
                                eq(this.animBtnTranslateYTrigger, 0),
                                runSpring(this.animBtnTranslateY, tabBarHeight),
                                runSpring(this.animBtnTranslateY, 0)
                            )
                        ])
                }
            </Animated.Code>
            { renderStatusBar('white', 'dark-content') }
            <SafeAreaView style={styles.mainView}>
                <HeaderDefault 
                    backActionProps={{ onPress: this.onPressBackButton }}
                    title={'Adicionar veículo'}
                />
                <View style={{ flex: 1 }}>
                    <Surface style={[styles.barPass, { elevation: 2 }]}>
                        <Icon 
                            name={'key-variant'} 
                            type={'material-community'} 
                            color={'white'} 
                            size={26} 
                            containerStyle={{ flex: 3 }}
                            onPress={() => this.onManualPressNumbers(PAGEINITIAL)}
                            Component={
                                (props) => 
                                    <TouchableOpacity 
                                        {...props} 
                                        activeOpacity={this.state.currentPage !== PAGEINITIAL ? 0.5 : 1}
                                    >
                                        <Animated.View
                                            style={{
                                                transform: [{ 
                                                    scale: Animated.interpolate(
                                                        this.animPageInitialValue, {
                                                            inputRange: [0, 1],
                                                            outputRange: [MAXSCALE, 1],
                                                            extrapolate: Animated.Extrapolate.CLAMP
                                                        }
                                                    )
                                                }]
                                            }}
                                        >
                                            {props.children}
                                        </Animated.View>
                                    </TouchableOpacity>
                            }
                        />
                        <Icon 
                            name={'chevron-double-right'} 
                            type={'material-community'} 
                            color={this.state.currentPage === PAGEKM || this.state.currentPage === PAGECOMPLETE ? 'white' : 'black'} 
                            size={18} 
                            containerStyle={{ flex: 1 }} 
                        />
                        <Icon 
                            name={'ios-speedometer'} 
                            type={'ionicon'} 
                            color={this.state.currentPage === PAGEKM || this.state.currentPage === PAGECOMPLETE ? 'white' : 'black'} 
                            size={28} 
                            containerStyle={{ flex: 3 }}
                            onPress={() => this.onManualPressNumbers(PAGEKM)}
                            Component={
                                (props) => 
                                    <TouchableOpacity 
                                        {...props} 
                                        activeOpacity={this.state.currentPage === PAGECOMPLETE ? 0.5 : 1} 
                                    >
                                        <Animated.View
                                            style={{
                                                transform: [{ 
                                                    scale: Animated.interpolate(
                                                        this.animPageKMValue, {
                                                            inputRange: [0, 1, 2],
                                                            outputRange: [1, MAXSCALE, 1],
                                                            extrapolate: Animated.Extrapolate.CLAMP
                                                        }
                                                    )
                                                }]
                                            }}
                                        >
                                            {props.children}
                                        </Animated.View>
                                    </TouchableOpacity>
                            }
                        />
                        <Icon 
                            name={'chevron-double-right'} 
                            type={'material-community'} 
                            color={this.state.currentPage === PAGECOMPLETE ? 'white' : 'black'} 
                            size={18} 
                            containerStyle={{ flex: 1 }} 
                        />
                        <Icon 
                            name={'check-circle'} 
                            type={'material-community'} 
                            color={this.state.currentPage === PAGECOMPLETE ? 'white' : 'black'} 
                            size={28} 
                            containerStyle={{ flex: 3 }}
                            Component={
                                (props) => 
                                    <TouchableOpacity 
                                        {...props} 
                                        activeOpacity={1} 
                                    >
                                        <Animated.View
                                            style={{
                                                transform: [{ 
                                                    scale: Animated.interpolate(
                                                        this.animPageKMValue, {
                                                            inputRange: [1, 2],
                                                            outputRange: [1, MAXSCALE],
                                                            extrapolate: Animated.Extrapolate.CLAMP
                                                        }
                                                    )
                                                }]
                                            }}
                                        >
                                            {props.children}
                                        </Animated.View>
                                    </TouchableOpacity>
                            }
                        />
                    </Surface>
                    <Pages
                        ref={this.refPages}
                        startPage={1}
                        scrollEnabled={false}
                        style={{ flex: 1, backgroundColor: 'transparent' }}
                        indicatorPosition={'none'}
                        progress={this.animProgressPage}
                        onScrollEnd={this.onScrollPageEnd}
                    >
                        <View style={{ flex: 1 }}>
                            <FormInitial navigation={this.props.navigation} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormKM navigation={this.props.navigation} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormComplete navigation={this.props.navigation} />
                        </View>
                    </Pages>
                    <Animated.View 
                        style={{ 
                            height: tabBarHeight,
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            transform: [{
                                translateY: this.animBtnTranslateY
                            }]
                        }}
                    >
                        <TouchableOpacity
                            onPress={this.onPressNextOrFinish}
                            activeOpacity={0.5}
                        >
                            <Surface
                                style={{
                                    height: tabBarHeight,
                                    backgroundColor: colorAppPrimary,
                                    elevation: 8,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text 
                                    style={{
                                        color: 'white',
                                        fontFamily: 'OpenSans-Bold',
                                        fontSize: 18
                                    }}
                                >
                                    {this.state.currentPage === PAGECOMPLETE ? 'Adicionar' : 'Prosseguir'}
                                </Text>
                            </Surface>
                        </TouchableOpacity>
                    </Animated.View>
                    <AddVehicleBanner />
                </View>
            </SafeAreaView>
            <AddVehicleAlert />
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
    barPass: {
        height: tabBarHeight,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colorAppPrimary
    }
});

const mapStateToProps = state => ({
    manufacturer: state.AddVehicleReducer.manufacturer,
    manufacturerValue: state.AddVehicleReducer.manufacturerValue,
    model: state.AddVehicleReducer.model,
    modelValue: state.AddVehicleReducer.modelValue
});

export default connect(mapStateToProps, {
    modifyResetFields,
    modifyBannerVisible,
    modifyBannerText, 
    modifyAlertVisible, 
    modifyAlertTitle, 
    modifyAlertMessage, 
    modifyAlertConfirmFunction,
    modifyAlertCancelFunction
})(AddVehicleScreen);
