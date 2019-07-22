/* eslint-disable max-len */
import React from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import { List, Card, Checkbox, DefaultTheme } from 'react-native-paper';
import { SearchBar, Icon } from 'react-native-elements';
import _ from 'lodash';

import { DefaultScreenAndHeaderContainer } from '../../tools/Screens';
import { 
    modifyNickname,
    modifyManufacturer,
    modifyManufacturerValue, 
    modifyModel,
    modifyModelValue,
    modifyYear,
    modifyYearValue,
    modifyFuel,
    modifyNicknameHasUpdated
} from '../../../actions/AddVehicleActions';
import { colorAppPrimary } from '../../utils/Constants';
import { store } from '../../../App';

class AddVehicleFragmentScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.Manufacturer = React.memo(this.renderManufacturer);
        this.Model = React.memo(this.renderModel);
        this.Year = React.memo(this.renderYear);

        this.Gasoline = React.memo(this.renderGasoline);
        this.Etanol = React.memo(this.renderEtanol);
        this.Diesel = React.memo(this.renderDiesel);
        this.GNV = React.memo(this.renderGNV);
        this.Eletric = React.memo(this.renderEletric);

        this.state = {
            manufacturerSearchValue: '',
            modelSearchValue: '',
            yearSearchValue: ''
        };
    }

    componentDidMount = () => {
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        });
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();
        
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => {
        this.onPressBackButton();

        return true;
    }

    onPressBackButton = () => this.props.navigation.navigate('AddVehicle', { transition: 'TransitionFade' })

    onRenderDefaultScreen = () => (
        <DefaultScreenAndHeaderContainer 
            navigation={this.props.navigation}
            onPressBackButton={this.onPressBackButton}
        />
    )

    onRenderManufacturer = () => {
        const manufacturersFiltred = _.filter(
            this.props.manufacturers, 
            ita => this.searchMatchKeys(ita.label, this.state.manufacturerSearchValue)
        );
        
        return (
            <DefaultScreenAndHeaderContainer 
                navigation={this.props.navigation}
                onPressBackButton={this.onPressBackButton}
                title={'Marca'}
            >
                <SearchBar
                    placeholder="Buscar marca..."
                    onChangeText={(value) => this.setState({ manufacturerSearchValue: value })}
                    value={this.state.manufacturerSearchValue}
                    lightTheme
                />
                <FlatList
                    data={manufacturersFiltred}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(propItem) => <this.Manufacturer {...propItem} />}
                    removeClippedSubviews
                />
            </DefaultScreenAndHeaderContainer>
        );
    }

    onRenderModel = () => {
        const modelsFiltred = _.filter(
            this.props.models, 
            ita => this.searchMatchKeys(ita.label, this.state.modelSearchValue)
        );
        
        return (
            <DefaultScreenAndHeaderContainer 
                navigation={this.props.navigation}
                onPressBackButton={this.onPressBackButton}
                title={'Modelo'}
            >
                <SearchBar
                    placeholder="Buscar modelo..."
                    onChangeText={(value) => this.setState({ modelSearchValue: value })}
                    value={this.state.modelSearchValue}
                    lightTheme
                />
                <FlatList
                    data={modelsFiltred}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(propItem) => <this.Model {...propItem} />}
                    removeClippedSubviews
                />
            </DefaultScreenAndHeaderContainer>
        );
    }

    onRenderYear = () => {
        const yearsFiltred = _.filter(
            _.map(this.props.years, (ita) => ({
                label: ita.label.replace(/\D/gm, ''),
                value: ita.value
            })),
            itb => !itb.label.includes('32000') && this.searchMatchKeys(itb.label, this.state.yearSearchValue)
        );
        
        return (
            <DefaultScreenAndHeaderContainer 
                navigation={this.props.navigation}
                onPressBackButton={this.onPressBackButton}
                title={'Ano'}
            >
                <SearchBar
                    placeholder="Buscar ano..."
                    onChangeText={(value) => this.setState({ yearSearchValue: value })}
                    value={this.state.yearSearchValue}
                    lightTheme
                />
                <FlatList
                    data={yearsFiltred}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(propItem) => <this.Year {...propItem} />}
                    removeClippedSubviews
                />
            </DefaultScreenAndHeaderContainer>
        );
    }

    onRenderFuel = () => {
        const gasolineChecked = this.props.fuel.includes('GASOLINE') ? 'checked' : 'unchecked';
        const etanolChecked = this.props.fuel.includes('ETANOL') ? 'checked' : 'unchecked';
        const dieselChecked = this.props.fuel.includes('DIESEL') ? 'checked' : 'unchecked';
        const gnvChecked = this.props.fuel.includes('GNV') ? 'checked' : 'unchecked';
        const eletricChecked = this.props.fuel.includes('ELETRIC') ? 'checked' : 'unchecked';
        
        return (
            <DefaultScreenAndHeaderContainer 
                navigation={this.props.navigation}
                onPressBackButton={this.onPressBackButton}
                title={'Combustíveis'}
            >
                <this.Gasoline checked={gasolineChecked} />
                <this.Etanol checked={etanolChecked} />
                <this.Diesel checked={dieselChecked} />
                <this.GNV checked={gnvChecked} />
                <this.Eletric checked={eletricChecked} />
            </DefaultScreenAndHeaderContainer>
        );
    }

    onPressFuelType = (fuelType) => {
        const findedIndex = _.indexOf(this.props.fuel, fuelType);
        if (findedIndex === -1) {
            const newFuels = [...this.props.fuel, fuelType];
            this.props.modifyFuel(newFuels);
        } else {
            const newFuels = [...this.props.fuel];
            newFuels.splice(findedIndex, 1);
            this.props.modifyFuel(newFuels);
        }
    }

    getValueFromStore = (type) => {
        switch (type) {
            case 'manufacturer':
                return store.getState().AddVehicleReducer.manufacturer;
            case 'model':
                return store.getState().AddVehicleReducer.model;
            case 'year':
                return store.getState().AddVehicleReducer.year;
            default:
                break;
        }
    }

    searchMatchKeys = (valueItemList, valueInput) => {
        const parsedValueList = valueItemList.toLowerCase().trim();
        const keysInputed = valueInput.toLowerCase().trim().split(' ');

        for (let index = 0; index < keysInputed.length; index++) {
            const element = keysInputed[index];
            
            if (!parsedValueList.includes(element)) return false;
        }

        return true;
    }

    renderManufacturer = (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressBackButton();

                if (propsItem.item.label) {
                    this.props.modifyManufacturer(propsItem.item.label);
                    this.props.modifyManufacturerValue(propsItem.item.value);
    
                    if (this.getValueFromStore('manufacturer') !== propsItem.item.label) {
                        this.props.modifyModel('');
                        this.props.modifyModelValue('');
                        this.props.modifyYear('');
                        this.props.modifyYearValue('');
                    }
                }
            }}
        >
            <Card.Content>
                <List.Item
                    title={propsItem.item.label}
                    {
                        ...(this.getValueFromStore('manufacturer') === propsItem.item.label ? 
                        { right: () => (<Checkbox status={'checked'} color={colorAppPrimary} />) } : {})
                    }
                />
            </Card.Content>
        </Card>
    )

    renderModel= (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressBackButton();

                if (propsItem.item.label) {
                    const nickname = this.props.nickname.trim();
                    const firstLabel = propsItem.item.label.trim().split(' ')[0];
    
                    this.props.modifyModel(propsItem.item.label);
                    this.props.modifyModelValue(propsItem.item.value);

                    if (this.getValueFromStore('model') !== propsItem.item.label) {
                        this.props.modifyYear('');
                        this.props.modifyYearValue('');
                    }
    
                    if (!nickname || (nickname === firstLabel.trim()) || !this.props.nicknameHasUpdated) {
                        this.props.modifyNickname(propsItem.item.label.trim().split(' ')[0]);
                        this.props.modifyNicknameHasUpdated(false);
                    }
                }
            }}
        >
            <Card.Content>
                <View style={{ flexDirection: 'row', margin: 14 }}>
                    <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text 
                            style={{
                                fontSize: 16,
                                color: DefaultTheme.colors.text
                            }}
                        >
                            {propsItem.item.label}
                        </Text>
                    </View>
                    {
                        this.getValueFromStore('model') === propsItem.item.label && 
                        (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Checkbox status={'checked'} color={colorAppPrimary} />
                            </View>
                        )
                    }
                </View>
            </Card.Content>
        </Card>
    )

    renderYear= (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressBackButton();

                if (propsItem.item.label) {
                    this.props.modifyYear(propsItem.item.label);
                    this.props.modifyYearValue(propsItem.item.value);
                }
            }}
        >
            <Card.Content>
                <View style={{ flexDirection: 'row', margin: 14 }}>
                    <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text 
                            style={{
                                fontSize: 16,
                                color: DefaultTheme.colors.text
                            }}
                        >
                            {propsItem.item.label}
                        </Text>
                    </View>
                    {
                        this.getValueFromStore('year') === propsItem.item.label && 
                        (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Checkbox status={'checked'} color={colorAppPrimary} />
                            </View>
                        )
                    }
                </View>
            </Card.Content>
        </Card>
    )

    renderGasoline = (propsItem) => (
        <Card 
            style={{ marginTop: 5, marginBottom: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressFuelType('GASOLINE');
            }}
        >
            <Card.Content>
                <List.Item
                    title={'Gasolina'}
                    left={() => (<Icon name={'gas-station'} color={'#DA9200'} type={'material-community'} size={30} containerStyle={styles.iconContainer} />)}
                    right={() => (<Checkbox status={propsItem.checked} color={colorAppPrimary} />)}
                />
            </Card.Content>
        </Card>
    )

    renderEtanol = (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressFuelType('ETANOL');
            }}
        >
            <Card.Content>
                <List.Item
                    title={'Etanol'}
                    left={() => (<Icon name={'gas-station'} color={'#1E4495'} type={'material-community'} size={30} containerStyle={styles.iconContainer} />)}
                    right={() => (<Checkbox status={propsItem.checked} color={colorAppPrimary} />)}
                />
            </Card.Content>
        </Card>
    )

    renderDiesel = (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressFuelType('DIESEL');
            }}
        >
            <Card.Content>
                <List.Item
                    title={'Diesel'}
                    left={() => (<Icon name={'gas-station'} color={'#A81412'} type={'material-community'} size={30} containerStyle={styles.iconContainer} />)}
                    right={() => (<Checkbox status={propsItem.checked} color={colorAppPrimary} />)}
                />
            </Card.Content>
        </Card>
    )

    renderGNV = (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressFuelType('GNV');
            }}
        >
            <Card.Content>
                <List.Item
                    title={'GNV'}
                    left={() => (<Icon name={'gas-cylinder'} color={'#55A9CE'} type={'material-community'} size={32} containerStyle={[styles.iconContainer, { paddingRight: 5 }]} />)}
                    right={() => (<Checkbox status={propsItem.checked} color={colorAppPrimary} />)}
                />
            </Card.Content>
        </Card>
    )

    renderEletric = (propsItem) => (
        <Card 
            style={{ marginVertical: 2, marginHorizontal: 8 }}
            onPress={() => {
                this.onPressFuelType('ELETRIC');
            }}
        >
            <Card.Content>
                <List.Item
                    title={'Elétrico'}
                    left={() => (<Icon name={'ev-station'} type={'material-community'} size={30} containerStyle={styles.iconContainer} />)}
                    right={() => (<Checkbox status={propsItem.checked} color={colorAppPrimary} />)}
                />
            </Card.Content>
        </Card>
    )

    renderManager = (screen) => {
        switch (screen) {
            case 'manufacturer':
                return this.onRenderManufacturer();
            case 'model':
                return this.onRenderModel();
            case 'year':
                return this.onRenderYear();
            case 'fuel':
                return this.onRenderFuel();
            default:
                return this.onRenderDefaultScreen();
        }
    }

    render = () => this.renderManager(this.props.screenFragment);
}

const mapStateToProps = (state) => ({
    screenFragment: state.AddVehicleReducer.screenFragment,
    nickname: state.AddVehicleReducer.nickname,
    nicknameHasUpdated: state.AddVehicleReducer.nicknameHasUpdated,
    manufacturers: state.AddVehicleReducer.manufacturers,
    fuel: state.AddVehicleReducer.fuel,
    models: state.AddVehicleReducer.models,
    years: state.AddVehicleReducer.years,
    vehicleTypeSelected: state.AddVehicleReducer.vehicleTypeSelected
});

const styles = StyleSheet.create({
    iconContainer: {
        marginVertical: 0,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps, {
    modifyNickname,
    modifyManufacturer,
    modifyManufacturerValue,
    modifyModel,
    modifyModelValue,
    modifyYear,
    modifyYearValue,
    modifyFuel,
    modifyNicknameHasUpdated
})(AddVehicleFragmentScreen);
