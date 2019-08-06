/* eslint-disable max-len */
import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';

class AddVehicleProgress extends React.PureComponent {
    render = () => (
        <Modal
            isVisible={this.props.alertProgressVisible}
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={400}
            backdropTransitionOutTiming={400}
            onModalHide={() => {
                if (this.props.alertProgressSuccess && this.props.onSuccessDoAction) this.props.onSuccessDoAction();
                if (this.props.alertProgressError && this.props.onErrorDoAction) this.props.onErrorDoAction();
            }}
        >
            <View 
                style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    padding: 22,
                    borderRadius: 4,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
            >
                <View style={{ flex: 3 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular' }}>
                        Adicionando Veículo
                    </Text>
                    <View style={{ marginVertical: 5 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Regular' }}>
                        Por favor aguarde, enquanto adicionamos o veículo...
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <ActivityIndicator style={{ marginTop: 15 }} size={26} />
                </View>
            </View>
        </Modal>
    )
}

export default AddVehicleProgress;

