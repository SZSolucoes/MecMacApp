/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import { modifyAlertVisible } from '../../../actions/AddVehicleActions';

class AddVehicleAlert extends React.PureComponent {
    doHideAlert = () => this.props.modifyAlertVisible(false)

    render = () => (
        <AwesomeAlert
            show={this.props.alertVisible}
            showProgress={false}
            title={this.props.alertTitle || 'Aviso'}
            message={this.props.alertMessage || 'Ops. Ocorreu um erro inesperado.'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton
            showConfirmButton
            cancelText={'Cancelar'}
            confirmText={'Sim, continuar'}
            confirmButtonColor={'#DD6B55'}
            onCancelPressed={() => {
                if (this.props.alertCancelFunction) {
                    this.props.alertCancelFunction(this.doHideAlert);
                 } else {
                    this.doHideAlert();
                 }
            }}
            onConfirmPressed={() => {
                 if (this.props.alertConfirmFunction) {
                    this.props.alertConfirmFunction(this.doHideAlert);
                 } else {
                    this.doHideAlert();
                 }
            }}
            titleStyle={{ fontSize: 24, fontFamily: 'OpenSans-Regular' }}
            messageStyle={{ fontSize: 14, fontFamily: 'OpenSans-Regular' }}
            cancelButtonTextStyle={{ fontSize: 16, fontFamily: 'OpenSans-Regular' }}
            confirmButtonTextStyle={{ fontSize: 16, fontFamily: 'OpenSans-Regular' }}
        />
    )
}

const mapStateToProps = state => ({
    alertVisible: state.AddVehicleReducer.alertVisible,
    alertTitle: state.AddVehicleReducer.alertTitle,
    alertMessage: state.AddVehicleReducer.alertMessage,
    alertConfirmFunction: state.AddVehicleReducer.alertConfirmFunction,
    alertCancelFunction: state.AddVehicleReducer.alertCancelFunction
});

export default connect(mapStateToProps, {
    modifyAlertVisible
})(AddVehicleAlert);

