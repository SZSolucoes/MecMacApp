/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    Text,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextMask } from 'react-native-masked-text';

import HomeBottomActionSheet from './HomeBottomActionSheet';
import { colorAppForeground } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';
import HomeOverlayTouchable from './HomeOverlayTouchable';
import HomeAppHeader from './HomeAppHeader';
import { modifyShowHomeNewVehicleTooltip } from '../../actions/CustomHomeTabBarActions';

class MainHomeScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.toggleAsTooltip = React.createRef();

        this.enabledVHC = true;

        this.state = {
            enabledRenderBS: false
        };
    }
    
    componentDidMount = () => {
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            this.enabledVHC = true; // Libera toque no botao de troca de veiculo durante transicao de tela
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            
            if (this.props.animatedVisible) this.props.animatedVisible('visible', 200);

            if (this.props.fetchVehicles) this.props.fetchVehicles();

            if (this.props.showHomeNewVehicleTooltip && this.toggleAsTooltip.current && !this.toggleAsTooltip.current.state.isVisible) {
                this.toggleAsTooltip.current.toggleTooltip();
            }
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            this.enabledVHC = false; // Bloqueia toque no botao de troca de veiculo durante transicao de tela
            if (this.props.bacChangePosition) this.props.bacChangePosition(0);
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });

        setTimeout(() => this.setState({ enabledRenderBS: true }), 1000);
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);

        this.onManualCloseAS();
    }

    onPressActionChooseVHC = () => {
        if (this.enabledVHC) {
            if (this.props.bacChangePosition && this.props.getPositionHomeBottomActionSheet) {
                if (this.props.getPositionHomeBottomActionSheet() === 0) {
                    if (this.props.animatedVisible) {
                        this.props.animatedVisible('hide', 120);
                    }
                    this.props.bacChangePosition(1);
                } else {
                    if (this.props.animatedVisible) {
                        this.props.animatedVisible('visible', 200);
                    }
                    this.props.bacChangePosition(0);
                }
            }
        }
    }

    onManualCloseAS = () => {
        if (this.props.animatedVisible) this.props.animatedVisible('visible', 200);
    }

    onBackButtonPressAndroid = () => {
        const routeName = this.props.navigation.state.routeName;
        const drawer = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent();

        if (this.toggleAsTooltip.current && this.toggleAsTooltip.current.state.isVisible) {
            this.toggleAsTooltip.current.toggleTooltip();
            this.props.modifyShowHomeNewVehicleTooltip(false);

            return true;
        }

        if (drawer.state.isDrawerOpen) {
            this.props.navigation.closeDrawer();
            return true;
        }

        if (routeName === 'HomeTab') {
            if (this.props.getPositionHomeBottomActionSheet() !== 0) this.props.bacChangePosition(0); 
            return true;
        }

        return false;
    }

    onCloseTooltip = () => this.props.modifyShowHomeNewVehicleTooltip(false)

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <HomeAppHeader
                navigation={this.props.navigation}
                rightIcon={() => 
                    (
                        <Tooltip
                            ref={this.toggleAsTooltip}
                            popover={(
                                <Text style={{ fontFamily: 'OpenSans-SemiBold', color: 'white' }}>
                                    Seu veículo foi adicionado e está agora disponível para seleção.
                                </Text>
                            )}
                            toggleOnPress={false}
                            onClose={this.onCloseTooltip}
                            height={100}
                            width={260}
                            backgroundColor={'rgba(0, 0, 0, 0.9)'}
                            containerStyle={{
                                padding: 15
                            }}
                        >
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
                        </Tooltip>
                    )
                }
                title={this.props.vehicleSelected.nickname || 'Meu incrível veículo'}
                subtitle={(
                    this.props.vehicleSelected.quilometers ? (
                        <Text 
                            style={{ fontFamily: 'OpenSans-Regular' }}
                        >
                            {'Km: '}
                            <TextMask
                                type={'money'}
                                style={{ fontFamily: 'OpenSans-SemiBold' }}
                                options={{
                                    precision: 0,
                                    separator: '.',
                                    delimiter: '',
                                    unit: '',
                                    suffixUnit: ''
                                }}
                                value={this.props.vehicleSelected.quilometers || '0'}
                            />
                        </Text>
                    ) : null) || 'Zero KM'}
                titleStyle={StyleSheet.flatten([defaultTextHeader, styles.titleVehicle])}
                containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
            />
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Início
                    </Text>
                </View>
                <HomeOverlayTouchable onPressActionChooseVHC={this.onPressActionChooseVHC} />
                {this.state.enabledRenderBS && (
                    <HomeBottomActionSheet getAnimTabBarTranslateY={this.props.getAnimTabBarTranslateY} onManualCloseAS={this.onManualCloseAS} />
                )}
            </View>
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
    getAnimTabBarTranslateY: state.CustomHomeTabBarReducer.getAnimTabBarTranslateY,
    showHomeNewVehicleTooltip: state.CustomHomeTabBarReducer.showHomeNewVehicleTooltip,
    bacChangePosition: state.HomeBottomActionSheetReducer.bacChangePosition,
    getPositionHomeBottomActionSheet: state.HomeBottomActionSheetReducer.getPosition,
    fetchVehicles: state.HomeBottomActionSheetReducer.fetchVehicles,
    vehicleSelected: state.UserReducer.vehicleSelected
});

export default connect(mapStateToProps, {
    modifyShowHomeNewVehicleTooltip
})(MainHomeScreen);
