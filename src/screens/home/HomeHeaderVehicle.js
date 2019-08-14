/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tooltip, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextMask } from 'react-native-masked-text';
import { connect } from 'react-redux';

import HomeAppHeader from './HomeAppHeader';
import { defaultTextHeader } from '../utils/Styles';

class HomeHeaderVehicle extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.toggleTooltip = React.createRef();
    }

    render = () => (
        <HomeAppHeader
            navigation={this.props.navigation}
            onBeforeOpenDrawer={this.props.onBeforeOpenDrawer}
            rightIcon={() => 
                (
                    <Tooltip
                        ref={this.props.refTooltip || this.toggleTooltip}
                        popover={(
                            <Text style={{ fontFamily: 'OpenSans-SemiBold', color: 'white' }}>
                                Seu veículo foi adicionado e está agora disponível para seleção.
                            </Text>
                        )}
                        toggleOnPress={false}
                        onClose={this.props.onCloseTooltip || (() => false)}
                        height={100}
                        width={260}
                        backgroundColor={'rgba(0, 0, 0, 0.9)'}
                        containerStyle={{
                            padding: 15
                        }}
                    >
                        <TouchableOpacity onPress={() => this.props.onPressActionChooseVHC() || (() => false)}>
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
    )
}

const styles = StyleSheet.create({
    titleVehicle: {
        fontSize: 16
    }
});

const mapStateToProps = (state) => ({
    vehicleSelected: state.UserReducer.vehicleSelected
});

export default connect(mapStateToProps)(HomeHeaderVehicle);
