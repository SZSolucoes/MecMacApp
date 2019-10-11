/* eslint-disable max-len */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { ListItem } from 'react-native-elements';
import { Checkbox, Card } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import _ from 'lodash';
import { TextMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-community/async-storage';

import { 
    modifyBacChangePosition, 
    modifyFall, 
    modifyGetPosition, 
    modifyPosition, 
    modifyFetchVehicles 
} from '../../actions/HomeBottomActionSheetActions';
import { apiGetUserVehicles } from '../utils/api/ApiManagerConsumer';
import { DESENV_EMAIL, colorAppPrimary, colorAppForeground } from '../utils/Constants';
import { modifyVehicleSelected, modifyClearVehicleSelected } from '../../actions/UserActions';

const { Value, block, cond, eq, call, ceil } = Animated;

const heightPoints = Dimensions.get('window').height * 0.70;

class HomeBottomActionSheet extends React.PureComponent {
    constructor(props) {
        super(props);

        this.refBS = React.createRef();

        this.fall = new Value(1);
        this.position = 0;

        this.state = {
            vehicles: [],
            refreshing: false
        };
    }

    componentDidMount = () => {
        if (this.props.modifyBacChangePosition) this.props.modifyBacChangePosition(this.bacChangePosition);
        if (this.props.modifyFall) this.props.modifyFall(this.fall);
        if (this.props.modifyGetPosition) this.props.modifyGetPosition(this.getPosition);
        if (this.props.modifyPosition) this.props.modifyPosition(this.position);
        if (this.props.modifyFetchVehicles) this.props.modifyFetchVehicles(this.fetchVehicles);

        this.fetchVehicles();
    }

    componentWillUnmount = () => {
        if (this.props.modifyFall) this.props.modifyFall(null);
    }

    onPressVehicle = (vehicle) => {
        if (vehicle.uniqueId !== this.props.vehicleSelected.uniqueId) {
            this.bacChangePosition(0);
            this.props.modifyVehicleSelected({ ...vehicle });
           
            try {
                AsyncStorage.setItem('@userVehicleSelected', JSON.stringify(vehicle));
            } catch (e) {
                console.log(e);
            }
        }
    }

    onManualCloseAS = () => {
        if (this.props.animatedVisible) this.props.animatedVisible('visible', 200);
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchVehicles();
    }

    getPosition = () => this.position

    checkPosition = ([value]) => {
        // close
        if (value === 1) {
            this.position = 0;
            if (this.props.onManualCloseAS) { 
                this.props.onManualCloseAS();
            } else {
                this.onManualCloseAS();
            }
        // open
        } else {
            this.position = 1;
        }

        if (this.props.modifyPosition) this.props.modifyPosition(this.position);
    }

    bacChangePosition = (position) => {
        if (!(position === 0 || position === 1)) return false;

        this.refBS.current.snapTo(position);
        this.position = position;
        
        if (this.props.modifyPosition) this.props.modifyPosition(this.position);
    }

    fetchVehicles = async () => {
        const email = this.props.userInfo.email || DESENV_EMAIL;
        const ret = await apiGetUserVehicles({ user_email: email });
        const valid = ret && ret.data && ret.data.data && ret.data.data.length;

        if (valid) {
            const vehicles = ret.data.data;
            const mappedVehicles = _.map(vehicles, (item) => ({
                image: { source: null, size: 'medium' },
                name: item.nickname,
                subtitle: item.quilometers,
                ...item
            }));

            this.setState({ vehicles: [...mappedVehicles], refreshing: false });
        } else {
            this.setState({ vehicles: [], refreshing: false });
            this.props.modifyClearVehicleSelected();
        }
    }

    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.panelTitle}>Super Máquinas</Text>
                <Text style={styles.panelSubtitle}>
                    Aqui estão os meus veículos para toda a vida
                </Text>
            </View>
        </View>
    )

    renderInner = () => (
        <View style={[styles.panel, { height: Dimensions.get('window').height * 0.55 }]}>
            <ScrollView
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                {
                    this.state.vehicles.length ?
                        _.map(this.state.vehicles, (item, index) => (
                            <TouchableOpacity
                                onPress={() => this.onPressVehicle(item)}
                                activeOpacity={1}
                            >
                                <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                                    <Card elevation={2}>
                                        <View key={index} style={styles.panelButton}>
                                            <ListItem
                                                leftAvatar={item.image}
                                                {
                                                    ...(this.props.vehicleSelected.uniqueId && (this.props.vehicleSelected.uniqueId === item.uniqueId)) ?
                                                    { rightElement: (<Checkbox status={'checked'} color={colorAppPrimary} />) } : {}
                                                }
                                                title={item.name}
                                                subtitle={(
                                                    <Text 
                                                        style={{ fontFamily: 'OpenSans-Regular', fontSize: 12 }}
                                                    >
                                                        {'Km: '}
                                                        <TextMask
                                                            type={'money'}
                                                            style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 14 }}
                                                            options={{
                                                                precision: 0,
                                                                separator: '.',
                                                                delimiter: '',
                                                                unit: '',
                                                                suffixUnit: ''
                                                            }}
                                                            value={item.subtitle || '0'}
                                                        />
                                                    </Text>
                                                )}
                                                titleStyle={styles.panelButtonTitle}
                                                subtitleStyle={styles.panelButtonSubTitle}
                                                containerStyle={{ padding: 0, paddingRight: 10, backgroundColor: 'transparent' }}
                                            />
                                            <View>
                                                <View style={{ marginLeft: 5, marginTop: 15, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1.2 }}>
                                                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 12 }}>
                                                            {'Marca: '}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flex: 4 }}>
                                                        <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 14 }}>
                                                            {item.manufacturer || 'Não disponível'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginLeft: 5, marginTop: 5, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1.2 }}>
                                                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 12 }}>
                                                            {'Ano: '}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flex: 4 }}>
                                                        <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 14 }}>
                                                            {item.year || 'Não disponível'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginLeft: 5, marginTop: 5, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1.2 }}>
                                                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 12 }}>
                                                            {'Modelo: '}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flex: 4 }}>
                                                        <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 14 }}>
                                                            {item.model || 'Não disponível'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </Card>
                                </View>
                            </TouchableOpacity>
                        ))
                    :
                        (
                            <View style={{ height: heightPoints, width: '100%' }} />
                        )
                }
                <View style={{ height: (heightPoints) / (this.state.vehicles.length + 1), width: '100%' }} />
            </ScrollView>
        </View>
    )

    render = () => (
        <React.Fragment>
            {
                this.props.getAnimTabBarTranslateY() &&
                (
                    <Animated.Code>
                        { () =>
                            block([
                                cond(eq(this.fall, 1), call([this.fall], this.checkPosition)),
                                cond(eq(ceil(this.fall), 0), call([this.fall], this.checkPosition))
                            ])
                        }
                    </Animated.Code>
                )
            }
            <BottomSheet
                ref={this.refBS}
                enabledInnerScrolling={false}
                enabledGestureInteraction={false}
                enabledContentGestureInteraction={false}
                snapPoints={[0, heightPoints]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={0}
                callbackNode={this.fall}
            />
        </React.Fragment>
    )
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
    box: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    panel: {
        backgroundColor: colorAppForeground
    },
    header: {
        backgroundColor: '#F5FCFF',
        shadowColor: '#000000',
        paddingTop: 20,
        paddingBottom: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    panelHeader: {
        alignItems: 'center'
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10
    },
    panelTitle: {
        fontSize: 27,
        height: 35
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5
    },
    panelButton: {
        padding: 10,
        marginVertical: 10
    },
    panelButtonTitle: {
        fontSize: 17,
        fontFamily: 'OpenSans-SemiBold',
        color: 'black'
    },
    panelButtonSubTitle: {
        color: 'black',
        fontWeight: '500'
    },
    photo: {
        width: '100%',
        height: 225,
        marginTop: 30
    },
    map: {
        height: '100%',
        width: '100%'
    },
});

const mapStateToProps = (state) => ({
    userInfo: state.UserReducer.userInfo,
    vehicleSelected: state.UserReducer.vehicleSelected,
    getAnimTabBarTranslateY: state.CustomHomeTabBarReducer.getAnimTabBarTranslateY,
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible
});

export default connect(mapStateToProps, { 
    modifyBacChangePosition,
    modifyFall,
    modifyGetPosition,
    modifyPosition,
    modifyVehicleSelected,
    modifyFetchVehicles,
    modifyClearVehicleSelected
})(HomeBottomActionSheet);
