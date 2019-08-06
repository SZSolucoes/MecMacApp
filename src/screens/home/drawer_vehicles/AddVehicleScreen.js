/* eslint-disable max-len */
import React from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler, Text, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Surface, ProgressBar } from 'react-native-paper';
import { Pages } from 'react-native-pages';
import { Icon } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';
import { linear } from 'everpolate';

import { renderStatusBar } from '../../utils/Screen';
import HeaderDefault from '../../tools/HeaderDefault';
import { colorAppForeground, tabBarHeight, colorAppPrimary, VEHICLES_TYPES, DESENV_EMAIL } from '../../utils/Constants';
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
    modifyAlertCancelFunction,
    modifyIsFetching,
    modifyIsLoadingComplete,
    modifyAlertInit,
    modifyAlertShowCancelButton,
    modifyAlertShowConfirmButton
} from '../../../actions/AddVehicleActions';
import AddVehicleBanner from './AddVehicleBanner';
import AddVehicleAlert from './AddVehicleAlert';
import { store } from '../../../App';
import { apiPostUserVehicles } from '../../utils/api/ApiManagerConsumer';
import AddVehicleProgress from './AddVehicleProgress';
import { modifyShowHomeNewVehicleTooltip } from '../../../actions/CustomHomeTabBarActions';

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
            bannerVisible: true,
            alertProgressVisible: false,
            alertProgressSuccess: false,
            alertProgressError: false
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
        const { bannerVisible, alertVisible } = store.getState().AddVehicleReducer;

        if (bannerVisible) { this.props.modifyBannerVisible(false); return true; }
        if (alertVisible) { this.props.modifyAlertVisible(false); return true; }

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
            const { isLoadingComplete } = store.getState().AddVehicleReducer;

            if (!this.lockedSwitchPage && currentPage === PAGEINITIAL) {
                this.setLockedSwitchPage();

                this.refPages.current.scrollToPage(PAGEKM);
                this.setState({ currentPage: PAGEKM });
            } else if (!this.lockedSwitchPage && currentPage === PAGEKM) {
                this.setLockedSwitchPage();

                const { isFetching } = store.getState().AddVehicleReducer;

                this.props.modifyIsLoadingComplete(true);
                this.props.modifyIsFetching(!isFetching);

                this.refPages.current.scrollToPage(PAGECOMPLETE);
                this.setState({ currentPage: PAGECOMPLETE });
            } else if (!this.lockedSwitchPage && currentPage === PAGECOMPLETE && !isLoadingComplete) {
                const funExec = async () => {
                    try {
                        const { manufacturer, model, year, fuel, nickname, quilometers, actionsRows } = store.getState().AddVehicleReducer;
                        const { userInfo } = store.getState().UserReducer;
                        const validNickname = nickname.trim() ? nickname.trim() : model.trim().split(' ')[0];
                        const vehicletype = VEHICLES_TYPES.car;
                        const manuts = [];

                        if (actionsRows && actionsRows.length) {
                            for (let indexA = 0; indexA < actionsRows.length; indexA++) {
                                const elementA = actionsRows[indexA];
                                if (elementA.manut) {
                                    manuts.push({
                                        vehicletype,
                                        itemabrev: elementA.manut.itemabrev,
                                        months: elementA.manut.mes,
                                        miles: elementA.manut.milhas,
                                        quilometers_manut: elementA.manut.quilometros,
                                        type_manut: elementA.manut.tipomanut,
                                        action: elementA.action
                                    });
                                }
                            }
                        }

                        const retSuccess = await apiPostUserVehicles({
                            user_email: userInfo.email || DESENV_EMAIL,
                            manufacturer,
                            model,
                            year,
                            price: null,
                            fuel: fuel.join('|'),
                            fipe_ref: null,
                            nickname: validNickname.trim(),
                            quilometers,
                            manuts
                        });

                        if (retSuccess) {
                            this.setState({ alertProgressVisible: false, alertProgressSuccess: true });
                        } else {
                            this.setState({ alertProgressVisible: false, alertProgressError: true });
                        }
                    } catch (e) {
                        console.log('erro na adição de veículo');
                        this.setState({ alertProgressVisible: false });
                    }
                };

                this.setState({ alertProgressVisible: true }, () => funExec());
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

    onSuccessDoAction = () => {
        this.props.modifyShowHomeNewVehicleTooltip(true);
        this.props.navigation.navigate('Home');
    }

    onErrorDoAction = () => this.setState({ alertProgressError: false }, () => {
        this.props.modifyAlertInit();
        this.props.modifyAlertTitle('Erro');
        this.props.modifyAlertMessage('Ops... Ocorreu um erro inesperado. Verifique a conexão com a internet ou contate o suporte caso o erro persistir.');
        this.props.modifyAlertCancelFunction((doHideAlert) => { doHideAlert(); });
        this.props.modifyAlertShowConfirmButton(false);
        this.props.modifyAlertVisible(true);
    })
    

    setLockedSwitchPage = () => {
        this.lockedSwitchPage = true;

        setTimeout(() => {
            if (this.lockedSwitchPage) this.lockedSwitchPage = false;
        }, 3000);
    }

    validateScreens = async () => {
        const {
            manufacturer,
            model,
            year
        } = this.props;

        const { quilometers, nickname } = store.getState().AddVehicleReducer;

        const { currentPage } = this.state;

        if (currentPage === PAGEINITIAL && (!manufacturer || !model || !year)) {
            this.props.modifyBannerText('Os campos ( Marca, Modelo e Ano ) devem ser preenchidos para prosseguir.');
            this.props.modifyBannerVisible(true);

            return false;
        }

        if (currentPage === PAGEKM && !quilometers) {
            const funPromise = new Promise((resolve) => {
                this.props.modifyAlertInit();
                this.props.modifyAlertTitle('Aviso');
                this.props.modifyAlertMessage('O Acompanhamento de manutenção do veículo será menos otimizado sem a quilometragem. Deseja realmente continuar?');
                this.props.modifyAlertConfirmFunction((doHideAlert) => { doHideAlert(); resolve(true); });
                this.props.modifyAlertCancelFunction((doHideAlert) => { doHideAlert(); resolve(false); });
                this.props.modifyAlertVisible(true);
            });

            return funPromise;
        }

        if (currentPage === PAGECOMPLETE) {
            const validNickname = nickname.trim() ? nickname.trim() : model.trim().split(' ')[0];

            const funPromisePageComplete = new Promise((resolve) => {
                this.props.modifyAlertInit();
                this.props.modifyAlertTitle('Aviso');
                this.props.modifyAlertMessage(`O veículo "${validNickname.trim()}" será adicionado a sua lista de super máquinas. Deseja continuar?`);
                this.props.modifyAlertConfirmFunction((doHideAlert) => { doHideAlert(); resolve(true); });
                this.props.modifyAlertCancelFunction((doHideAlert) => { doHideAlert(); resolve(false); });
                this.props.modifyAlertVisible(true);
            });

            return funPromisePageComplete;
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
            {renderStatusBar('white', 'dark-content')}
            <SafeAreaView style={styles.mainView}>
                <HeaderDefault
                    backActionProps={{ onPress: this.onBackButtonPressAndroid }}
                    title={'Adicionar veículo'}
                />
                <View style={{ flex: 1 }}>
                    <Surface
                        style={{
                            elevation: 2,
                            backgroundColor: colorAppPrimary
                        }}
                    >
                        <View style={styles.barPass}>
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
                                                            this.animPageCompleteValue, {
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
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ProgressBar
                                style={{ width: '90%', paddingVertical: 0 }}
                                color={'white'}
                                progress={linear(this.state.currentPage, [0, 1, 2], [0.3, 0.7, 1])[0]}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 4
                            }}
                        >
                            <Text style={{ fontFamily: 'OpenSans-SemiBold', color: 'white' }}>{`${this.state.currentPage + 1}/3`}</Text>
                        </View>
                    </Surface>
                    <Pages
                        ref={this.refPages}
                        startPage={0}
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
            <AddVehicleProgress
                alertProgressVisible={this.state.alertProgressVisible}
                alertProgressError={this.state.alertProgressError}
                alertProgressSuccess={this.state.alertProgressSuccess}
                onErrorDoAction={this.onErrorDoAction}
                onSuccessDoAction={this.onSuccessDoAction}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
    barPass: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingBottom: 5
    }
});

const mapStateToProps = state => ({
    manufacturer: state.AddVehicleReducer.manufacturer,
    manufacturerValue: state.AddVehicleReducer.manufacturerValue,
    model: state.AddVehicleReducer.model,
    modelValue: state.AddVehicleReducer.modelValue,
    year: state.AddVehicleReducer.year,
    yearValue: state.AddVehicleReducer.yearValue,
    isLoadingComplete: state.AddVehicleReducer.isLoadingComplete
});

export default connect(mapStateToProps, {
    modifyResetFields,
    modifyBannerVisible,
    modifyBannerText,
    modifyAlertVisible,
    modifyAlertTitle,
    modifyAlertMessage,
    modifyAlertConfirmFunction,
    modifyAlertCancelFunction,
    modifyIsFetching,
    modifyIsLoadingComplete,
    modifyAlertInit,
    modifyAlertShowCancelButton,
    modifyAlertShowConfirmButton,
    modifyShowHomeNewVehicleTooltip
})(AddVehicleScreen);
