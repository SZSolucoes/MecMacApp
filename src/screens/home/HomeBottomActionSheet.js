/* eslint-disable max-len */
import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { ListItem } from 'react-native-elements';
import { Checkbox } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import _ from 'lodash';

import { modifyBacChangePosition, modifyFall, modifyGetPosition, modifyPosition } from '../../actions/HomeBottomActionSheetActions';
import { apiGetUserVehicles } from '../utils/api/ApiManagerConsumer';
import { DESENV_EMAIL, colorAppPrimary } from '../utils/Constants';
import { modifyVehicleSelected } from '../../actions/UserActions';

const { Value, block, cond, eq, call, ceil } = Animated;

class HomeBottomActionSheet extends React.PureComponent {
    constructor(props) {
        super(props);

        this.refBS = React.createRef();

        this.fall = new Value(1);
        this.position = 0;

        this.state = {
            vehicles: []
        };
    }

    componentDidMount = () => {
        if (this.props.modifyBacChangePosition) this.props.modifyBacChangePosition(this.bacChangePosition);
        if (this.props.modifyFall) this.props.modifyFall(this.fall);
        if (this.props.modifyGetPosition) this.props.modifyGetPosition(this.getPosition);
        if (this.props.modifyPosition) this.props.modifyPosition(this.position);

        this.fetchVehicles();
    }

    componentWillUnmount = () => {
        if (this.props.modifyFall) this.props.modifyFall(null);
    }

    onPressVehicle = (vehicle) => {
        if (vehicle.uniqueId !== this.props.vehicleSelected.uniqueId) {
            this.bacChangePosition(0);
            this.props.modifyVehicleSelected({ ...vehicle });
        }
    }

    getPosition = () => this.position

    checkPosition = ([value]) => {
        // close
        if (value === 1) {
            this.position = 0;
            if (this.props.onManualCloseAS) this.props.onManualCloseAS();
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

            this.setState({ vehicles: [...mappedVehicles] });
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
        <View style={styles.panel}>
            {
                this.state.vehicles.length ?
                    _.map(this.state.vehicles, (item, index) => (
                        <TouchableOpacity
                            onPress={() => this.onPressVehicle(item)}
                        >
                            <View key={index} style={styles.panelButton}>
                                <ListItem
                                    leftAvatar={item.image}
                                    {
                                        ...(this.props.vehicleSelected.uniqueId && (this.props.vehicleSelected.uniqueId === item.uniqueId)) ?
                                        { rightElement: (<Checkbox status={'checked'} color={colorAppPrimary} />) } : {}
                                    }
                                    title={item.name}
                                    subtitle={`Km: ${item.subtitle || '0'}`}
                                    titleStyle={styles.panelButtonTitle}
                                    subtitleStyle={styles.panelButtonSubTitle}
                                    containerStyle={{ padding: 0, paddingRight: 10, backgroundColor: 'transparent' }}
                                />
                            </View>
                        </TouchableOpacity>
                    ))
                :
                    (
                        <View style={{ height: '100%', width: '100%' }} />
                    )
            }
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
                snapPoints={[0, '70%']}
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
        padding: 20,
        backgroundColor: '#F5FCFF'
    },
    header: {
        backgroundColor: '#F5FCFF',
        shadowColor: '#000000',
        paddingTop: 20,
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
    vehicleSelected: state.UserReducer.vehicleSelected
});

export default connect(mapStateToProps, { 
    modifyBacChangePosition,
    modifyFall,
    modifyGetPosition,
    modifyPosition,
    modifyVehicleSelected
})(HomeBottomActionSheet);
