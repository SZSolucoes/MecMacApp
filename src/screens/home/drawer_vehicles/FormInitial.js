/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, Text, TextInput as RNTextInput } from 'react-native';
import { connect } from 'react-redux';
import { Card, TextInput, DefaultTheme } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import Realm from 'realm';

import { tabBarHeight, colorAppPrimary, VEHICLES_TYPES } from '../../utils/Constants';
import { 
    modifyNickname, 
    modifyScreenFragment, 
    modifyManufacturers,
    modifyModels,
    modifyVehicleTypeSelected,
    modifyManufacturer, 
    modifyManufacturerValue, 
    modifyModel,
    modifyModelValue,
    modifyFuel,
    modifyFuelValue
} from '../../../actions/AddVehicleActions';
import { AllSchemasArray } from '../../../storage/RealmSchemas';
import { limitDotText } from '../../utils/StringTextFormats';

class FormInitial extends React.PureComponent {
    constructor(props) {
        super(props);

        this.history = {
            [VEHICLES_TYPES.car]: { 
                manufacturer: '', 
                manufacturerValue: '', 
                model: '', 
                modelValue: '', 
                fuel: []
            },
            [VEHICLES_TYPES.motorbike]: { 
                manufacturer: '', 
                manufacturerValue: '', 
                model: '', 
                modelValue: '', 
                fuel: []
            },
            [VEHICLES_TYPES.truck]: { 
                manufacturer: '', 
                manufacturerValue: '', 
                model: '', 
                modelValue: '', 
                fuel: []
            },
        };

        this.state = {
            themecolor: DefaultTheme.colors.placeholder
        };
    }

    componentDidMount = async () => {
        try {
            this.realmInstance = new Realm({
                schema: AllSchemasArray,
                schemaVersion: 1
            });
        } catch (e) {
            console.log(e);
        }

        this.props.modifyVehicleTypeSelected(VEHICLES_TYPES.car);
    }

    componentDidUpdate = async (prevProps) => {
        const {
            vehicleTypeSelected,
            manufacturer,
            manufacturerValue,
            model,
            modelValue,
            fuel
        } = this.props;

        if (vehicleTypeSelected && 
            (vehicleTypeSelected !== prevProps.vehicleTypeSelected)) { 
                this.mapManufacturesToProps(vehicleTypeSelected);
        }

        if (manufacturerValue && (manufacturerValue !== prevProps.manufacturerValue)) {
            this.mapModelsToProps(vehicleTypeSelected, manufacturerValue);
        }

        if (manufacturerValue) {
            this.history[vehicleTypeSelected].manufacturer = manufacturer;
            this.history[vehicleTypeSelected].manufacturerValue = manufacturerValue;
        }

        if (modelValue) {
            this.history[vehicleTypeSelected].model = model;
            this.history[vehicleTypeSelected].modelValue = modelValue;
        }

        if (fuel.length) {
            this.history[vehicleTypeSelected].fuel = [...fuel];
        }
    }

    componentWillUnmount = () => {
        this.closeRealm();
    }

    onPressManufacturer = () => {
        if (!this.props.vehicleTypeSelected) return false;

        this.props.modifyScreenFragment('manufacturer');
        this.props.navigation.navigate('AddVehicleFragment', { transition: 'TransitionFade' }); 
    }

    onPressModel = () => {
        if (!this.props.vehicleTypeSelected || !this.props.manufacturer) return false;

        this.props.modifyScreenFragment('model');
        this.props.navigation.navigate('AddVehicleFragment', { transition: 'TransitionFade' }); 
    }

    onPressFuel = () => {
        if (!this.props.vehicleTypeSelected) return false;

        this.props.modifyScreenFragment('fuel');
        this.props.navigation.navigate('AddVehicleFragment', { transition: 'TransitionFade' }); 
    }

    onFocusChangeTheme = () => this.setState({ themecolor: DefaultTheme.colors.primary })

    onBlurChangeTheme = () => this.setState({ themecolor: DefaultTheme.colors.placeholder })

    onPressCardCar = () => {
        if (this.props.vehicleTypeSelected !== VEHICLES_TYPES.car) {
            this.props.modifyVehicleTypeSelected(VEHICLES_TYPES.car);
            this.checkAndSetHistory(VEHICLES_TYPES.car);
        }
    }

    onPressCardMotorbike = () => {
        if (this.props.vehicleTypeSelected !== VEHICLES_TYPES.motorbike) {
            this.props.modifyVehicleTypeSelected(VEHICLES_TYPES.motorbike);
            this.checkAndSetHistory(VEHICLES_TYPES.motorbike);
        }
    }
    onPressCardTruck = () => {
        if (this.props.vehicleTypeSelected !== VEHICLES_TYPES.truck) {
            this.props.modifyVehicleTypeSelected(VEHICLES_TYPES.truck);
            this.checkAndSetHistory(VEHICLES_TYPES.truck);
        }
    }

    closeRealm = () => this.realmInstance && this.realmInstance.close();

    mapManufacturesToProps = (vehicleTypeSelected) => {
        try {
            const realmFipeMarcas = this.realmInstance.objects('FipeMarcas');
        
            if (realmFipeMarcas && realmFipeMarcas.length) {
                let manufacturers = null;
                if (vehicleTypeSelected === VEHICLES_TYPES.car) {
                    manufacturers = realmFipeMarcas[0].carros.map((obja) => ({ label: obja.Label, value: obja.Value }));
                } else if (vehicleTypeSelected === VEHICLES_TYPES.motorbike) {
                    manufacturers = realmFipeMarcas[0].motos.map((obja) => ({ label: obja.Label, value: obja.Value }));
                } else if (vehicleTypeSelected === VEHICLES_TYPES.truck) {
                    manufacturers = realmFipeMarcas[0].caminhoes.map((obja) => ({ label: obja.Label, value: obja.Value }));
                }
    
                if (manufacturers && manufacturers.length) this.props.modifyManufacturers(manufacturers);
            }
        } catch (e) {
            this.props.modifyManufacturers([]);
            console.log(e);
        }
    }

    checkAndSetHistory = (vehicleTypeSelected) => {
        const vehicleValues = this.history[vehicleTypeSelected];

        this.props.modifyManufacturer(vehicleValues.manufacturer);
        this.props.modifyManufacturerValue(vehicleValues.manufacturerValue);
        this.props.modifyModel(vehicleValues.model);
        this.props.modifyModelValue(vehicleValues.modelValue);
        this.props.modifyFuel(vehicleValues.fuel);
        this.props.modifyFuelValue(vehicleValues.fuelValue);
    }

    mapModelsToProps = (vehicleTypeSelected, manufacturerValue) => {
        try {
            const realmFipeModelos = this.realmInstance
            .objects('FipeModelo')
            .filtered(`fipeVHCType == ${vehicleTypeSelected} AND marcaValue == '${manufacturerValue}'`);
        
            if (realmFipeModelos && realmFipeModelos.length) {
                const modelos = realmFipeModelos[0].marcaModelos.map((obja) => ({ label: obja.Label, value: obja.Value }));
                
                if (modelos && modelos.length) this.props.modifyModels(modelos);
            }
        } catch (e) {
            this.props.modifyModels([]);
            console.log(e);
        }
    }

    renderFuelIcons = () => {
        const gasolineChecked = this.props.fuel.includes('GASOLINE');
        const etanolChecked = this.props.fuel.includes('ETANOL');
        const dieselChecked = this.props.fuel.includes('DIESEL');
        const gnvChecked = this.props.fuel.includes('GNV');
        const eletricChecked = this.props.fuel.includes('ELETRIC');

        return (
            <React.Fragment>
                {gasolineChecked && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Icon name={'gas-station'} color={'#DA9200'} type={'material-community'} size={24} />
                        <Text style={{ color: '#DA9200', fontWeight: '500', fontSize: 16 }}>G</Text>
                    </View>
                )}
                {etanolChecked && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Icon name={'gas-station'} color={'#1E4495'} type={'material-community'} size={24} />
                        <Text style={{ color: '#1E4495', fontWeight: '500', fontSize: 16 }}>E</Text>
                    </View>
                )}
                {dieselChecked && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Icon name={'gas-station'} color={'#A81412'} type={'material-community'} size={24} />
                        <Text style={{ color: '#A81412', fontWeight: '500', fontSize: 16 }}>D</Text>
                    </View>
                )}
                {gnvChecked && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                        <Icon name={'gas-cylinder'} color={'#55A9CE'} type={'material-community'} size={24} containerStyle={{ width: 20 }} />
                        <Text style={{ color: '#55A9CE', fontWeight: '500', fontSize: 16 }}>N</Text>
                    </View>
                )}
                {eletricChecked && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Icon name={'ev-station'} type={'material-community'} size={24} />
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>EV</Text>
                    </View>
                )}
            </React.Fragment>
        );
    }

    render = () => (
        <View style={styles.mainView}>
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: 10
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 10 }}>
                    <Card 
                        elevation={2} 
                        style={{ 
                            flex: 1,
                            marginLeft: 5, 
                            flexDirection: 'row',
                            paddingVertical: 5,
                            ...(this.props.vehicleTypeSelected === VEHICLES_TYPES.car ? { borderWidth: 1.5, borderColor: colorAppPrimary } : { borderWidth: 1.5, borderColor: 'transparent' }) 
                        }}
                        onPress={this.onPressCardCar}
                    >
                        <View 
                            style={{
                                flex: 1,
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}
                        >
                            <Icon 
                                name={'car-sports'} 
                                type={'material-community'} 
                                size={36} 
                                color={this.props.vehicleTypeSelected === VEHICLES_TYPES.car ? colorAppPrimary : DefaultTheme.colors.placeholder} 
                            />
                            <Text 
                                numberOfLines={1} 
                                style={{ 
                                    textAlign: 'center', 
                                    ...(
                                        this.props.vehicleTypeSelected === VEHICLES_TYPES.car ? 
                                        {
                                            color: colorAppPrimary,
                                            fontWeight: '400'
                                        } : 
                                        { color: DefaultTheme.colors.placeholder }
                                    )
                                }}
                            >
                                Carro
                            </Text>
                        </View>
                    </Card>
                    <Card 
                        elevation={2} 
                        style={{ 
                            flex: 1, 
                            marginLeft: 5, 
                            flexDirection: 'row',
                            paddingVertical: 5,
                            ...(this.props.vehicleTypeSelected === VEHICLES_TYPES.motorbike ? { borderWidth: 1.5, borderColor: colorAppPrimary } : { borderWidth: 1.5, borderColor: 'transparent' }) 
                        }}
                        onPress={this.onPressCardMotorbike}
                    >
                        <View 
                            style={{
                                flex: 1,
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}
                        >
                            <Icon 
                                name={'motorbike'} 
                                type={'material-community'} 
                                size={36} 
                                color={this.props.vehicleTypeSelected === VEHICLES_TYPES.motorbike ? colorAppPrimary : DefaultTheme.colors.placeholder} 
                            />
                            <Text 
                                numberOfLines={1} 
                                style={{ 
                                    textAlign: 'center', 
                                    ...(
                                        this.props.vehicleTypeSelected === VEHICLES_TYPES.motorbike ? 
                                        {
                                            color: colorAppPrimary,
                                            fontWeight: '400'
                                        } : 
                                        { color: DefaultTheme.colors.placeholder }
                                    )
                                }}
                            >
                                Moto
                            </Text>
                        </View>
                    </Card>
                    <Card 
                        elevation={2} 
                        style={{ 
                            flex: 1, 
                            marginLeft: 5, 
                            marginRight: 5, 
                            flexDirection: 'row',
                            paddingVertical: 5,
                            ...(this.props.vehicleTypeSelected === VEHICLES_TYPES.truck ? { borderWidth: 1.5, borderColor: colorAppPrimary } : { borderWidth: 1.5, borderColor: 'transparent' }) 
                        }}
                        onPress={this.onPressCardTruck}
                    >
                        <View 
                            style={{
                                flex: 1,
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}
                        >
                            <Icon 
                                name={'truck'} 
                                type={'material-community'} 
                                size={34} 
                                color={this.props.vehicleTypeSelected === VEHICLES_TYPES.truck ? colorAppPrimary : DefaultTheme.colors.placeholder} 
                            />
                            <Text 
                                numberOfLines={3} 
                                style={{ 
                                    textAlign: 'center', 
                                    ...(
                                        this.props.vehicleTypeSelected === VEHICLES_TYPES.truck ? 
                                        {
                                            color: colorAppPrimary,
                                            fontWeight: '400'
                                        } : 
                                        { color: DefaultTheme.colors.placeholder }
                                    )
                                }}
                            >
                                Caminhão e Micro-Ônibus
                            </Text>
                        </View>
                    </Card>
                </View>
                <Card elevation={2}>
                    <Card.Content>
                        <View>
                            <TextInput
                                mode={'outlined'}
                                label='Apelido'
                                value={this.props.nickname}
                                onChangeText={value => this.props.modifyNickname(value)}
                                style={{
                                    backgroundColor: 'white',
                                    marginBottom: 5
                                }}
                                maxLength={20}
                                onFocus={this.onFocusChangeTheme}
                                onBlur={this.onBlurChangeTheme}
                                render={props =>
                                    <RNTextInput
                                        {...props}
                                        style={[...props.style, { paddingRight: 60 }]}
                                    />
                                }
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 20,
                                    bottom: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                pointerEvents='none'
                            >
                                <Icon 
                                    name='keyboard-outline' 
                                    type='material-community' 
                                    color={this.state.themecolor} 
                                    size={28} 
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={this.onPressManufacturer}
                            activeOpacity={0.6}
                        >
                            <View pointerEvents={'none'}>
                                <TextInput
                                    mode={'outlined'}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    label='Marca'
                                    value={limitDotText(this.props.manufacturer, 30)}
                                    style={{
                                        backgroundColor: 'white',
                                        marginBottom: 5
                                    }}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 20,
                                        bottom: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon 
                                        name='feature-search-outline' 
                                        type='material-community' 
                                        color={DefaultTheme.colors.placeholder} 
                                        size={26} 
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onPressModel}
                            activeOpacity={0.6}
                        >
                            <View pointerEvents={'none'}>
                                <TextInput
                                    numberOfLines={1}
                                    mode={'outlined'}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    label='Modelo'
                                    value={limitDotText(this.props.model, 30)}
                                    style={{
                                        backgroundColor: 'white',
                                        marginBottom: 5,
                                        textAlign: 'left'
                                    }}
                                    render={props =>
                                        <RNTextInput
                                            {...props}
                                            style={[...props.style, { paddingRight: 60 }]}
                                        />
                                    }
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 20,
                                        bottom: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon 
                                        name='feature-search-outline' 
                                        type='material-community' 
                                        color={DefaultTheme.colors.placeholder} 
                                        size={26} 
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onPressFuel}
                            activeOpacity={0.6}
                        >
                            <View pointerEvents={'none'}>
                                <TextInput
                                    mode={'outlined'}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    label={'Combustíveis'}
                                    value={this.props.fuel.length ? ' ' : ''}
                                    style={{
                                        backgroundColor: 'white',
                                        marginBottom: 5
                                    }}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 60,
                                        bottom: 0,
                                        left: 0,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    {this.renderFuelIcons()}
                                </View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 20,
                                        bottom: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon 
                                        name='feature-search-outline' 
                                        type='material-community' 
                                        color={DefaultTheme.colors.placeholder} 
                                        size={26} 
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
                <View style={{ height: tabBarHeight + 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    iconContainer: {
        marginVertical: 0,
        marginHorizontal: 0,
        marginLeft: 0,
        height: 40,
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = state => ({
    nickname: state.AddVehicleReducer.nickname,
    manufacturer: state.AddVehicleReducer.manufacturer,
    manufacturerValue: state.AddVehicleReducer.manufacturerValue,
    model: state.AddVehicleReducer.model,
    modelValue: state.AddVehicleReducer.modelValue,
    fuel: state.AddVehicleReducer.fuel,
    vehicleTypeSelected: state.AddVehicleReducer.vehicleTypeSelected
});

export default connect(mapStateToProps, { 
    modifyNickname,
    modifyScreenFragment,
    modifyManufacturers,
    modifyModels,
    modifyVehicleTypeSelected,
    modifyManufacturer, 
    modifyManufacturerValue, 
    modifyModel,
    modifyModelValue,
    modifyFuel,
    modifyFuelValue
})(FormInitial);
