/* eslint-disable max-len */
import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { Card, Title, Paragraph, TextInput, DefaultTheme } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

import { tabBarHeight } from '../../utils/Constants';
import { modifyQuilometers } from '../../../actions/AddVehicleActions';

const paragraphOne = 'A quilometragem permite acompanhar o estado atual do seu veículo e avaliar todas as necessidades de manutenção que ele necessita com base no próprio manual.';
const paragraphTwo = 'Dessa forma é possível receber alertas de manutenções e dicas para fortalecer a parceria com o seu veículo.';

class FormKM extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            themecolor: DefaultTheme.colors.placeholder
        };
    }

    render = () => (
        <View style={styles.mainView}>
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: 10
                }}
            >
                <Card>
                    <Card.Content>
                        <Title>Hodômetro</Title>
                        <Paragraph>
                            <Text style={{ fontFamily: 'OpenSans-Regular' }}>{paragraphOne}</Text>
                        </Paragraph>
                        <Paragraph>
                            <Text style={{ fontFamily: 'OpenSans-Regular' }}>{paragraphTwo}</Text>
                        </Paragraph>
                        <View style={{ marginTop: 15 }}>
                            <TextInput
                                mode={'outlined'}
                                label='Quilometragem'
                                value={this.props.quilometers}
                                onChangeText={value => this.props.modifyQuilometers(value.replace(/\D/gm, ''))}
                                style={{
                                    backgroundColor: 'white',
                                    marginBottom: 5
                                }}
                                keyboardType={'numeric'}
                                maxLength={20}
                                onFocus={this.onFocusChangeTheme}
                                onBlur={this.onBlurChangeTheme}
                                render={props =>
                                    <RNTextInput
                                        {...props}
                                        style={[...props.style, { paddingRight: 80 }]}
                                    />
                                }
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 20,
                                    bottom: 0,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                pointerEvents='none'
                            >
                                <Text style={{ fontWeight: '400' }}>Km</Text>
                                <View style={{ marginHorizontal: 10 }} />
                                <Icon 
                                    name='keyboard-outline' 
                                    type='material-community' 
                                    color={this.state.themecolor} 
                                    size={28} 
                                />
                            </View>
                        </View>
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
    }
});

const mapStateToProps = state => ({
    quilometers: state.AddVehicleReducer.quilometers
});

export default connect(mapStateToProps, {
    modifyQuilometers
})(FormKM);
