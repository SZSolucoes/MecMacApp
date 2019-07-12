import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Card, TextInput, DefaultTheme } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { tabBarHeight } from '../../utils/Constants';
import { modifyNickname, modifyScreenFragment } from '../../../actions/AddVehicleActions';

class FormInitial extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            themecolor: DefaultTheme.colors.placeholder
        };
    }

    onPressManufacturer = () => {
        this.props.modifyScreenFragment('manufacturer');
        this.props.navigation.navigate('AddVehicleFragment', { transition: 'TransitionFade' }); 
    }

    onPressModel = () => {
        this.props.modifyScreenFragment('model');
        this.props.navigation.navigate('AddVehicleFragment', { transition: 'TransitionFade' }); 
    }

    onPressFuel = () => {
        this.props.modifyScreenFragment('fuel');
        this.props.navigation.navigate('AddVehicleFragment', { transition: 'TransitionFade' }); 
    }

    onFocusChangeTheme = () => this.setState({ themecolor: DefaultTheme.colors.primary })

    onBlurChangeTheme = () => this.setState({ themecolor: DefaultTheme.colors.placeholder })

    render = () => (
        <View style={styles.mainView}>
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: 10
                }}
            >
                <Card elevation={4}>
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
                                    value={this.props.manufacturer}
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
                                    mode={'outlined'}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    label='Modelo'
                                    value={this.props.model}
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
                            onPress={this.onPressFuel}
                            activeOpacity={0.6}
                        >
                            <View pointerEvents={'none'}>
                                <TextInput
                                    mode={'outlined'}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    label='Combustíveis'
                                    value={this.props.fuel}
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
                    </Card.Content>
                </Card>
                <View style={{ height: tabBarHeight }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    }
});

const mapStateToProps = state => ({
    nickname: state.AddVehicleReducer.nickname,
    manufacturer: state.AddVehicleReducer.manufacturer,
    model: state.AddVehicleReducer.model,
    fuel: state.AddVehicleReducer.fuel
});

export default connect(mapStateToProps, { 
    modifyNickname,
    modifyScreenFragment 
})(FormInitial);
