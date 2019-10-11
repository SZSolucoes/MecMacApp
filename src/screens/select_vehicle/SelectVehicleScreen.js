/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Animated from 'react-native-reanimated';
import { Card } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

import { renderStatusBar } from '../utils/Screen';
import { runTiming } from '../utils/ReanimatedUtils';
import { colorAppPrimary } from '../utils/Constants';
import { modifyVehicleSelected } from '../../actions/UserActions';

const { Value, block, cond, eq } = Animated;

const maxAnimValue = 100;
const animTiming = 600;
const { width: screenWidth } = Dimensions.get('window');

class SelectVehicleScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        
        this.animTransition = new Value(maxAnimValue);
        this.animTriggerType = new Value(-1);

        this.refCarousel = React.createRef();

        this.pcRenderItemCard = React.memo(this.renderItemCard);

        this.state = {
            activeSlide: 0,
            sliderRef: null,
            vehicles: []
        };
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);

        const vehicles = this.props.navigation.getParam('vehiclesData', []);

        if (vehicles.length) {
            const userVehicleSelected = await AsyncStorage.getItem('@userVehicleSelected');
            let indexFinded = 0;

            if (userVehicleSelected) {
                const vehicle = JSON.parse(userVehicleSelected);

                if (vehicle) {
                    const indexFd = _.findIndex(vehicles, (item) => 
                        item.user_email === userVehicleSelected.user_email &&
                        item.manufacturer === userVehicleSelected.manufacturer &&
                        item.model === userVehicleSelected.model &&
                        item.year === userVehicleSelected.year
                    );

                    indexFinded = indexFd > -1 ? indexFd : 0;
                }
            }

            this.setState({ vehicles: [...vehicles], activeSlide: indexFinded }, this.onHideSplashScreen);
        } else {
            this.onHideSplashScreen();
        }
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => true

    onSnapToItem = (index) => this.setState({ activeSlide: index })

    onChooseVehicle = (index) => () => {
        const vehicle = this.state.vehicles[index];

        this.props.modifyVehicleSelected({
            uniqueId: `${vehicle.manufacturer}${vehicle.model}${vehicle.year}${vehicle.nickname}`,
            ...vehicle
        });

        this.props.navigation.navigate('Home');
    }

    onHideSplashScreen = () => { 
        SplashScreen.hide();

        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            setTimeout(() => this.runTransitionAnim(true), 1000);
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            this.runTransitionAnim(false);
        });

        setTimeout(() => this.runTransitionAnim(true), 1000);
    }

    runTransitionAnim = (switchOn) => {
        if (switchOn) {
            this.animTriggerType.setValue(1);
        } else {
            this.animTriggerType.setValue(0);
        }
    }

    renderItemCard = ({ item, index }) => (
        <Card 
            elevation={10}
            style={{
                width: Dimensions.get('window').width * 0.80,
                height: Dimensions.get('window').height * 0.50
            }}
            onPress={this.onChooseVehicle(index)}
        >
            <View 
                style={{
                    flex: 1,
                    alignItems: 'center', 
                    justifyContent: 'center'
                }}
            >
                <Text>{JSON.stringify(item, null, 4)}</Text>
            </View>
        </Card>
    )

    renderPcItemCard = (props) => <this.pcRenderItemCard {...props} />

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
            {renderStatusBar(colorAppPrimary, 'dark-content')}
            <SafeAreaView style={styles.mainView}>
                <Animated.Code>
                    {
                        () => 
                            block([
                                cond(eq(this.animTriggerType, 1), runTiming(this.animTransition, 0, animTiming)),
                                cond(eq(this.animTriggerType, 0), runTiming(this.animTransition, maxAnimValue, animTiming))
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
                        <Text style={styles.headerText}>
                            Qual vamos pilotar hoje ?
                        </Text>
                    </View>
                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                        <Carousel
                            layout={'default'}
                            ref={(c) => { if (!this.state.sliderRef) { this.setState({ sliderRef: c }); } }}
                            data={this.state.vehicles}
                            renderItem={this.renderPcItemCard}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth - 60}
                            onSnapToItem={this.onSnapToItem}
                            contentContainerCustomStyle={{ alignItems: 'center' }}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        { this.renderPagination() }
                    </View>
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
