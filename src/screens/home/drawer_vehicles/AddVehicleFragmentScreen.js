/* eslint-disable max-len */
import React from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import { List, Card, Checkbox } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';

import { DefaultScreenAndHeaderContainer } from '../../tools/Screens';
import { modifyManufacturer } from '../../../actions/AddVehicleActions';
import { colorAppPrimary } from '../../utils/Constants';

class AddVehicleFragmentScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            manufacturerSearchValue: ''
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

    onPressBackButton = () => this.props.navigation.navigate('AddVehicle', { transition: 'TransitionFade' });

    onRenderDefaultScreen = () => (
        <DefaultScreenAndHeaderContainer 
            navigation={this.props.navigation}
            onPressBackButton={this.onPressBackButton}
        />
    )

    onRenderManufacturer = () => {
        const CompItem = React.memo((propsItem) => (
            <Card 
                style={{ marginVertical: 2, marginHorizontal: 8 }}
                onPress={() => {
                    this.props.modifyManufacturer(propsItem.item.title);
                    this.onPressBackButton();
                }}
            >
                <Card.Content>
                    <List.Item
                        title={propsItem.item.title}
                        {
                            ...(this.props.manufacturer === propsItem.item.title ? 
                            { right: () => (<Checkbox status={'checked'} color={colorAppPrimary} />) } : {})
                        }
                    />
                </Card.Content>
            </Card>
        ));

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
                    data={[{ title: 'Acura' }, { title: 'GM - Chevrolet' }, { title: 'Acura' }, { title: 'GM - Chevrolet' }, { title: 'Acura' }, { title: 'GM - Chevrolet' }, { title: 'Acura' }, { title: 'GM - Chevrolet' }]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(propItem) => <CompItem {...propItem} />}
                />
            </DefaultScreenAndHeaderContainer>
        );
    }

    onRenderModel = () => (
        <DefaultScreenAndHeaderContainer 
            navigation={this.props.navigation}
            onPressBackButton={this.onPressBackButton}
            title={'Modelo'}
        />
    )

    onRenderFuel = () => (
        <DefaultScreenAndHeaderContainer 
            navigation={this.props.navigation}
            onPressBackButton={this.onPressBackButton}
            title={'Combustíveis'}
        />
    ) 

    renderManager = (screen) => {
        switch (screen) {
            case 'manufacturer':
                return this.onRenderManufacturer();
            case 'model':
                return this.onRenderModel();
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
    manufacturer: state.AddVehicleReducer.manufacturer,
    model: state.AddVehicleReducer.model,
    fuel: state.AddVehicleReducer.fuel
});

export default connect(mapStateToProps, {
    modifyManufacturer
})(AddVehicleFragmentScreen);
