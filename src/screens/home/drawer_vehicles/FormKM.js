/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { Card, Title, Paragraph, TextInput, DefaultTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInputMask } from 'react-native-masked-text';

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

    onChangeQuilometers = (value) => this.props.modifyQuilometers(value.replace(/\D/gm, ''))

    render = () => (
        <View style={styles.mainView}>
            <KeyboardAwareScrollView
                extraScrollHeight={8}
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
                                keyboardType={'numeric'}
                                value={this.props.quilometers}
                                onChangeText={this.onChangeQuilometers}
                                style={{
                                    backgroundColor: 'white',
                                    marginBottom: 5
                                }}
                                maxLength={9}
                                render={props =>
                                    <TextInputMask
                                        {...props}
                                        style={[...props.style, { paddingRight: 80 }]}
                                        type={'money'}
                                        options={{
                                            precision: 0,
                                            separator: '.',
                                            delimiter: '',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
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
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    }
});

const mapStateToProps = (state) => ({
    quilometers: state.AddVehicleReducer.quilometers
});

export default connect(mapStateToProps, {
    modifyQuilometers
})(FormKM);
