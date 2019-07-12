/* eslint-disable max-len */
import React from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler, Text, TouchableOpacity, Keyboard } from 'react-native';
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

const PAGEINITIAL = 0;
const PAGEKM = 1;
const PAGECOMPLETE = 2;

const BUTTON_HIDED = 0;
const BUTTON_VISIBLE = 1;

const MAXSCALE = 1.4;

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
            currentPage: 0
        };

        this.animProgressPage = new Value(-1);

        this.animPageInitialValue = new Value(0);
        this.animPageKMValue = new Value(-1);
        this.animPageCompleteValue = new Value(-1);

        this.animBtnTranslateYTrigger = new Value(1);
        this.animBtnTranslateY = new Value(0);

        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            Keyboard.addListener('keyboardDidShow', this.onKeyBoardEvent);
            Keyboard.addListener('keyboardDidHide', this.onKeyBoardEvent);
        });
    }
    
    componentDidMount = () => {
        SplashScreen.hide();
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            Keyboard.removeListener('keyboardDidShow', this.onKeyBoardEvent);
            Keyboard.removeListener('keyboardDidHide', this.onKeyBoardEvent);

            this.animBtnTranslateYTrigger.setValue(BUTTON_VISIBLE);
        });

        this.lockedSwitchPage = false;
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        Keyboard.removeListener('keyboardDidShow', this.onKeyBoardEvent);
        Keyboard.removeListener('keyboardDidHide', this.onKeyBoardEvent);
    }

    onKeyBoardEvent = (nativeEvent) => {
        if (nativeEvent) {
            this.animBtnTranslateYTrigger.setValue(BUTTON_HIDED);
        } else {
            this.animBtnTranslateYTrigger.setValue(BUTTON_VISIBLE);
        }
    }
    
    onBackButtonPressAndroid = () => {
        const drawer = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent();

        if (drawer.state.isDrawerOpen) {
            this.props.navigation.closeDrawer();
            return true;
        }

        return false;
    }

    onPressBackButton = () => this.props.navigation.goBack()

    onPressNextOrFinish = () => {
        const { currentPage } = this.state;

        if (!this.lockedSwitchPage && currentPage === PAGEINITIAL) {
            this.lockedSwitchPage = true;

            this.refPages.current.scrollToPage(PAGEKM);
            this.setState({ currentPage: PAGEKM });
        } else if (!this.lockedSwitchPage && currentPage === PAGEKM) {
            this.lockedSwitchPage = true;

            this.refPages.current.scrollToPage(PAGECOMPLETE);
            this.setState({ currentPage: PAGECOMPLETE });
        } else if (!this.lockedSwitchPage && currentPage === PAGECOMPLETE) {
            alert('finalizou');
        }
    }

    onManualPressNumbers = (pageNumber) => {
        const { currentPage } = this.state;

        if (!this.lockedSwitchPage && pageNumber === PAGEINITIAL) {
            this.lockedSwitchPage = true;

            this.refPages.current.scrollToPage(PAGEINITIAL);
            this.setState({ currentPage: PAGEINITIAL });
        } else if (!this.lockedSwitchPage && pageNumber === PAGEKM && currentPage === PAGECOMPLETE) {
            this.lockedSwitchPage = true;

            this.refPages.current.scrollToPage(PAGEKM);
            this.setState({ currentPage: PAGEKM });
        }
    }

    onScrollPageEnd = () => (this.lockedSwitchPage = false)

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
                            name={'numeric-1-circle'} 
                            type={'material-community'} 
                            color={'white'} 
                            size={28} 
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
                            name={'numeric-2-circle'} 
                            type={'material-community'} 
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
                </View>
            </SafeAreaView>
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

export default AddVehicleScreen;
