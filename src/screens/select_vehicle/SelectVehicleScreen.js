/* eslint-disable max-len */
import React from 'react';
import { 
    View, 
    Text,
    Image,
    Platform,
    StyleSheet, 
    Dimensions, 
    BackHandler,
    SafeAreaView, 
} from 'react-native';
import { connect } from 'react-redux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Animated from 'react-native-reanimated';
import { TextInput, DefaultTheme, Button } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { Icon } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

import imgCarRoad from '../../assets/images/carroad.jpg';

import { renderOpacityStatusBar } from '../utils/Screen';
import { runTiming } from '../utils/ReanimatedUtils';
import { colorAppPrimary, DESENV_EMAIL } from '../utils/Constants';
import { modifyVehicleSelected } from '../../actions/UserActions';
import { writeVehicles } from '../../storage/RealmManager';
import { apiUpdateUserVehicles } from '../utils/api/ApiManagerConsumer';
import { store } from '../../App';
import { initDefaultTheme } from '../utils/InitConfigs';

const { Value, block, cond, eq, or, neq } = Animated;

const maxAnimValue = 100;
const animTiming = 600;
const timingAnimChoosedVehicle = 800;
const { width: screenWidth } = Dimensions.get('window');

class SelectVehicleScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.choosedIndex = -1;
        
        this.animTransition = new Value(maxAnimValue);
        this.animTriggerType = new Value(-1);

        this.animOpacity = new Value(1);
        this.animTriggerVehicleChoosed = new Value(-1);
        this.animTriggerVehicleIndex = new Value(-1);

        this.refCarousel = React.createRef();

        this.pcRenderItemCard = React.memo(this.renderItemCard);

        this.state = {
            activeSlide: 0,
            sliderRef: null,
            vehicles: [],
            kmIdxs: {},
            loadingBtn: false,
            updateTheme: true
        };
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);

        const vehicles = this.props.navigation.getParam('vehiclesData', []);

        if (vehicles.length) {
            const activeSlide = await this.getItemPosition(vehicles);

            this.setState({ vehicles: [...vehicles], activeSlide }, this.onHideSplashScreen);
        } else {
            this.onHideSplashScreen();
        }
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);

        initDefaultTheme();
    }

    onBackButtonPressAndroid = () => true

    onSnapToItem = (index) => this.setState({ activeSlide: index })

    onChooseVehicle = (index, firstClick = true) => () => {
        if (!this.state.loadingBtn) {
            const funAsync = async () => {
                try {
                    const vehicle = this.state.vehicles[index];
                    const kmIdxs = this.state.kmIdxs[index] ? parseInt(this.state.kmIdxs[index].toString().replace(/[^0-9]+/g, ''), 10) : null;
            
                    if (kmIdxs && vehicle.quilometers !== kmIdxs) {
                        const vehicleN = { ...vehicle, quilometers: kmIdxs };
                        const userInfo = store.getState().UserReducer.userInfo;
            
                        const ret = await apiUpdateUserVehicles({ 
                            user_email: userInfo.email || DESENV_EMAIL,
                            manufacturer: vehicleN.manufacturer,
                            model: vehicleN.model,
                            year: vehicleN.year,
                            nickname: vehicleN.nickname,
                            quilometers: vehicleN.quilometers
                        });

                        if (ret.success) {
                            const vehicleSelected = {
                                uniqueId: `${vehicleN.manufacturer}${vehicleN.model}${vehicleN.year}${vehicleN.nickname}`,
                                ...vehicleN
                            };

                            this.props.modifyVehicleSelected(vehicleSelected);

                            try {
                                AsyncStorage.setItem('@userVehicleSelected', JSON.stringify(vehicleSelected));
                            } catch (e) {
                                console.log(e);
                            }

                            writeVehicles([vehicleN]);
            
                            this.props.navigation.navigate('Home');
                            return;
                        }
    
                        alert('erro');
                        return;
                    }

                    if (firstClick) {
                        this.choosedIndex = index;
                        this.runAnimChoosedVehicle(true, index);
                    } else {
                        const vehicleSelectedUnique = {
                            uniqueId: `${vehicle.manufacturer}${vehicle.model}${vehicle.year}${vehicle.nickname}`,
                            ...vehicle
                        };
            
                        this.props.modifyVehicleSelected(vehicleSelectedUnique);
    
                        try {
                            AsyncStorage.setItem('@userVehicleSelected', JSON.stringify(vehicleSelectedUnique));
                        } catch (e) {
                            console.log(e);
                        }
            
                        this.props.navigation.navigate('Home');
                    }

                    return;
                } catch (e) {
                    console.log(e);
                }
        
                this.setState({ loadingBtn: false });
            };
            
            this.setState({ loadingBtn: true }, funAsync);
        }
    }

    onChangeQuilometers = (index) => (value) => {
        const newKmIdxs = { ...this.state.kmIdxs };
        newKmIdxs[index] = value || '';

        this.setState({ kmIdxs: newKmIdxs });
    }

    onBlurQuilometers = (index) => () => {
        if (this.state.kmIdxs[index] !== undefined) {
            if (this.state.kmIdxs[index] === '' || this.state.kmIdxs[index].match(/^[0]+$/g)) {
                this.onChangeQuilometers(index)(this.state.vehicles[index].quilometers);
            }
        }
    }

    onHideSplashScreen = () => {
        this.updateWhiteTheme();

        this.checkActiveSlide();

        SplashScreen.hide();

        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            this.updateWhiteTheme();
            
            this.checkActiveSlide();

            setTimeout(() => this.runTransitionAnim(true), 600);
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            this.runTransitionAnim(false);

            initDefaultTheme();

            setTimeout(() => this.setState({ loadingBtn: false }), 2000);
        });

        setTimeout(() => this.runTransitionAnim(true), 600);
    }

    getItemPosition = async (vehicles) => {
        const userVehicleSelected = await AsyncStorage.getItem('@userVehicleSelected');
        let indexFinded = 0;

        if (userVehicleSelected) {
            const vehicle = JSON.parse(userVehicleSelected);

            if (vehicle) {
                const indexFd = _.findIndex(vehicles, (item) => 
                    item.user_email === vehicle.user_email &&
                    item.manufacturer === vehicle.manufacturer &&
                    item.model === vehicle.model &&
                    item.year === vehicle.year &&
                    item.nickname === vehicle.nickname
                );

                indexFinded = indexFd > -1 ? indexFd : 0;
            }
        }

        return indexFinded;
    }

    checkActiveSlide = async () => {
        if (this.state.vehicles.length) {
            const activeSlide = await this.getItemPosition(this.state.vehicles);

            this.setState({ activeSlide }, this.goToActiveSlide);
        }
    }

    goToActiveSlide = () => {
        if (this.state.sliderRef) this.state.sliderRef.snapToItem(this.state.activeSlide);
    }

    updateWhiteTheme = () => {
        DefaultTheme.colors.text = 'white';
        DefaultTheme.colors.primary = 'white';
        DefaultTheme.colors.placeholder = 'white';

        this.setState({ updateTheme: !this.state.updateTheme });
    }

    runTransitionAnim = (switchOn) => {
        if (switchOn) {
            this.animTriggerType.setValue(1);
        } else {
            this.animTriggerType.setValue(0);
        }
    }

    runAnimChoosedVehicle = (switchOn, index) => {
        if (switchOn) {
            this.animTriggerVehicleIndex.setValue(index);
            this.animTriggerVehicleChoosed.setValue(0);
        } else {
            this.animTriggerVehicleIndex.setValue(index);
            this.animTriggerVehicleChoosed.setValue(1);
        }
    }

    renderItemCard = ({ item, index, kmIdxs, loadingBtn }) => (
        <KeyboardAwareScrollView
            extraScrollHeight={8}
            contentContainerStyle={{
                paddingVertical: 0,
                width: Dimensions.get('window').width * 0.80,
                height: Dimensions.get('window').height * 0.50,
            }}
        >
                <View style={{ ...StyleSheet.absoluteFillObject }}>
                    <Image source={imgCarRoad} resizeMode={'stretch'} style={{ width: '100%' }} />
                    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
                </View>
                <View 
                    style={{
                        flex: 2,
                        padding: 10,
                        justifyContent: 'space-around'
                    }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'OpenSans-SemiBold', fontSize: 22 }}>{item.nickname}</Text>
                    {/* <Text style={{ color: 'white' }}>{JSON.stringify(item, null, 4)}</Text> */}
                    <View style={{ marginTop: 10 }} pointerEvents={loadingBtn ? 'none' : 'auto'}>
                        <TextInput
                            theme={{ colors: { text: 'white' } }}
                            mode={'flat'}
                            label='Quilometragem (Atual)'
                            keyboardType={'numeric'}
                            value={(kmIdxs[index] || kmIdxs[index] === '') && !loadingBtn ? kmIdxs[index] : item.quilometers}
                                onChangeText={loadingBtn ? null : this.onChangeQuilometers(index)}
                            style={{
                                backgroundColor: 'transparent',
                                marginBottom: 5
                            }}
                            maxLength={9}
                            onBlur={this.onBlurQuilometers(index)}
                            render={props =>
                                <TextInputMask
                                    {...props}
                                    style={[...props.style, { paddingRight: 80 }]}
                                    type={'money'}
                                    options={{
                                        precision: 0,
                                        separator: '.',
                                        delimiter: '',
                                        unit: '',
                                        suffixUnit: ''
                                    }}
                                />
                            }
                        />
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 20,
                                bottom: 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: this.animOpacity
                            }}
                            pointerEvents='none'
                        >
                            <View style={{ marginHorizontal: 10 }} />
                            <Icon 
                                name='keyboard-outline' 
                                type='material-community' 
                                color={'#1B1915'} 
                                size={28} 
                            />
                        </Animated.View>
                    </View>
                    <Animated.View
                        style={{
                            opacity: Animated.interpolate(
                                this.animOpacity, {
                                    inputRange: [0, 0.4, 1],
                                    outputRange: [0, 0.2, 1],
                                    extrapolate: Animated.Extrapolate.CLAMP
                                }
                            )
                        }}
                    >
                        <Button icon={this.renderIcon} mode="contained" onPress={this.onChooseVehicle(index)} loading={loadingBtn}>
                            Selecionar
                        </Button>
                    </Animated.View>
                    <Animated.View
                        pointerEvents={loadingBtn ? 'auto' : 'none'}
                        style={{
                            position: 'absolute',
                            padding: 10,
                            left: 0,
                            right: 0,
                            bottom: Animated.interpolate(
                                this.animOpacity, {
                                    inputRange: [0, 1],
                                    outputRange: [40, 0],
                                    extrapolate: Animated.Extrapolate.CLAMP
                                }
                            ),
                            opacity: Animated.interpolate(
                                this.animOpacity, {
                                    inputRange: [0, 1],
                                    outputRange: [1, 0],
                                    extrapolate: Animated.Extrapolate.CLAMP
                                }
                            )
                        }}
                    >
                        <View style={{ marginTop: 10 }}>
                            <TextInput
                                theme={{ colors: { text: 'white' } }}
                                mode={'flat'}
                                label='Nova Quilometragem'
                                keyboardType={'numeric'}
                                value={kmIdxs[index] || kmIdxs[index] === '' ? kmIdxs[index] : item.quilometers}
                                onChangeText={this.onChangeQuilometers(index)}
                                style={{
                                    backgroundColor: 'transparent',
                                    marginBottom: 5
                                }}
                                maxLength={9}
                                onBlur={this.onBlurQuilometers(index)}
                                render={props =>
                                    <TextInputMask
                                        {...props}
                                        style={[...props.style, { paddingRight: 80 }]}
                                        type={'money'}
                                        options={{
                                            precision: 0,
                                            separator: '.',
                                            delimiter: '',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
                                    />
                                }
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 20,
                                    bottom: 0,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                pointerEvents='none'
                            >
                                <View style={{ marginHorizontal: 10 }} />
                                <Icon 
                                    name='keyboard-outline' 
                                    type='material-community' 
                                    color={'#1B1915'} 
                                    size={28} 
                                />
                            </View>
                        </View>
                    </Animated.View>
                </View>
        </KeyboardAwareScrollView>
    )

    renderPcItemCard = (props) => (
        <Animated.View
            style={{
                borderRadius: 6,
                overflow: 'hidden',
                opacity: cond(
                        or(
                            eq(this.animTriggerVehicleIndex, -1), neq(this.animTriggerVehicleIndex, props.index)
                        ), 
                        this.animOpacity,
                        1
                    )
            }}
        >
            <this.pcRenderItemCard 
                {...props} 
                kmIdxs={this.state.kmIdxs} 
                loadingBtn={this.state.loadingBtn} 
                updateTheme={this.state.updateTheme} 
            />
        </Animated.View>
    )

    renderIcon = (color, size, direction) => <Icon 
        name='steering' 
        type='material-community' 
        color={color} 
        size={size}
        containerStyle={[
            {
              transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
              width: 22
            }
        ]}
        pointerEvents={'none'}
    />

    renderPagination = () => (
        <Pagination
            carouselRef={this.state.sliderRef || null}
            dotsLength={this.state.vehicles.length}
            activeDotIndex={this.state.activeSlide}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots
        />
    )

    render = () => (
        <View style={{ flex: 1, backgroundColor: colorAppPrimary }}>
            { renderOpacityStatusBar(0.0, Platform.OS === 'ios' ? 'light-content' : 'default') }
            <SafeAreaView style={styles.mainView}>
                <Animated.Code
                    key={'animTriggerType'}
                >
                    {
                        () => 
                            block([
                                cond(eq(this.animTriggerType, 1), runTiming(this.animTransition, 0, animTiming)),
                                cond(eq(this.animTriggerType, 0), runTiming(this.animTransition, maxAnimValue, animTiming))
                            ])
                    }
                </Animated.Code>
                <Animated.Code
                    key={'animTriggerVehicleChoosed'}
                >
                    {
                        () => 
                            block([
                                cond(eq(this.animTriggerVehicleChoosed, 1), runTiming(this.animOpacity, 1, timingAnimChoosedVehicle)),
                                cond(eq(this.animTriggerVehicleChoosed, 0), runTiming(this.animOpacity, 0, timingAnimChoosedVehicle))
                            ])
                    }
                </Animated.Code>
                <Animated.View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: Animated.interpolate(
                            this.animTransition, {
                                inputRange: [0, maxAnimValue],
                                outputRange: [1, 0],
                                extrapolate: Animated.Extrapolate.CLAMP
                            }
                        )
                    }}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.View 
                            style={{ 
                                top: Animated.interpolate(
                                    this.animOpacity, {
                                        inputRange: [0, 1],
                                        outputRange: [-100, 0],
                                        extrapolate: Animated.Extrapolate.CLAMP
                                    }
                                ),
                                opacity: this.animOpacity
                            }}
                        >
                            <Text style={styles.headerText}>
                                Qual vamos pilotar hoje ?
                            </Text>
                        </Animated.View>
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: Animated.interpolate(
                                    this.animOpacity, {
                                        inputRange: [0, 1],
                                        outputRange: [40, 100],
                                        extrapolate: Animated.Extrapolate.CLAMP
                                    }
                                ),
                                opacity: Animated.interpolate(
                                    this.animOpacity, {
                                        inputRange: [0, 1],
                                        outputRange: [1, 0],
                                        extrapolate: Animated.Extrapolate.CLAMP
                                    }
                                )
                            }}
                        >
                            <Text style={styles.headerText}>
                                Deseja atualizar a quilometragem ?
                            </Text>
                        </Animated.View>
                    </View>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <Carousel
                            scrollEnabled={!this.state.loadingBtn}
                            layout={'default'}
                            ref={(c) => { if (!this.state.sliderRef) { this.setState({ sliderRef: c }); } }}
                            data={this.state.vehicles}
                            renderItem={this.renderPcItemCard}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth - (screenWidth * 0.20)}
                            onSnapToItem={this.onSnapToItem}
                            contentContainerCustomStyle={{ alignItems: 'center' }}
                        />
                    </View>
                    <Animated.View 
                        pointerEvents={this.state.loadingBtn ? 'none' : 'auto'}
                        style={{ 
                            flex: 1, 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            opacity: this.animOpacity 
                        }}
                    >
                        { this.renderPagination() }
                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppPrimary
    },
    headerText: {
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
        fontSize: 22,
        color: 'white'
    }
});

export default connect(null, {
    modifyVehicleSelected
})(SelectVehicleScreen);
