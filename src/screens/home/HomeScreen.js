/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { Appbar } from 'react-native-paper';
import { ListItem, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { colorAppForeground } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';

class HomeScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            
            if (this.props.animatedVisible) {
                this.props.animatedVisible('visible', 200);
            }
        });
    }
    
    componentDidMount = () => {
        SplashScreen.hide();
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
          BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onPressDrawerIcon = () => {
        this.props.navigation.openDrawer();
    }

    onPressActionChooseVHC = () => {
        if (this.props.bacChangePosition && this.props.getPositionHomeBottomActionSheet) {
            if (this.props.getPositionHomeBottomActionSheet() === 0) {
                this.props.bacChangePosition(1);
            } else {
                this.props.bacChangePosition(0);
            }
        }
    }

    onBackButtonPressAndroid = () => {
        const routeName = this.props.navigation.state.routeName;

        if (routeName === 'HomeTab') {
            return true;
        }

        return false;
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
                <View style={{ width: '100%', justifyContent: 'center', paddingLeft: 10 }}>
                    <ListItem
                        leftAvatar={{ 
                            icon: {
                                name: 'ios-car',
                                type: 'ionicon',
                                size: 34,
                                color: 'black'
                            },
                            overlayContainerStyle: {
                                backgroundColor: 'white',
                                borderWidth: 0.8
                            },
                            editButton: {
                                size: 14,
                                color: 'black',
                                name: 'ios-menu',
                                type: 'ionicon',
                                style: styles.iconDrawer,
                                underlayColor: 'white'
                            },
                            showEditButton: true,
                            activeOpacity: 1,
                            onPress: this.onPressDrawerIcon,
                            onEditPress: this.onPressDrawerIcon
                        }}
                        rightIcon={() => 
                            (
                                <TouchableOpacity onPress={() => this.onPressActionChooseVHC()}>
                                    <View style={{ width: 60, height: '100%', justifyContent: 'center' }}>
                                        <Icon
                                            name={'ios-arrow-down'}
                                            type={'ionicon'}
                                            size={20}
                                            color={'black'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        title={'Meu incrível veículo'}
                        subtitle={'Ano 2019'}
                        titleStyle={StyleSheet.flatten([defaultTextHeader, styles.titleVehicle])}
                        containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    />
                </View>
            </Appbar.Header>
            <Animated.View 
                style={{ 
                    flex: 1,
                    backgroundColor: this.props.fallHomeBottomActionSheet ?
                    Animated.color(0, 0, 0, 
                        Animated.interpolate(
                            this.props.fallHomeBottomActionSheet, {
                                inputRange: [0, 1],
                                outputRange: [0.6, 0],
                                extrapolate: Animated.Extrapolate.CLAMP
                            }
                        )
                    ) 
                    : 
                    'transparent'
                }} 
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
    iconDrawer: {
        backgroundColor: 'white', 
        borderColor: 'grey', 
        borderWidth: 0.5, 
        width: 18, 
        height: 18, 
        borderRadius: 9
    },
    titleVehicle: {
        fontSize: 16
    }
});

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible,
    bacChangePosition: state.HomeBottomActionSheetReducer.bacChangePosition,
    fallHomeBottomActionSheet: state.HomeBottomActionSheetReducer.fall,
    getPositionHomeBottomActionSheet: state.HomeBottomActionSheetReducer.getPosition,
});

export default connect(mapStateToProps)(HomeScreen);
