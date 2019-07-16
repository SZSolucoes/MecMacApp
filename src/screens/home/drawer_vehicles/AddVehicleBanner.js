import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Banner } from 'react-native-paper';
import { modifyBannerVisible } from '../../../actions/AddVehicleActions';

class AddVehicleBanner extends React.PureComponent {
    doHideBanner = () => this.props.modifyBannerVisible(false)

    render = () => (
        <Banner
            visible={this.props.bannerVisible}
            actions={[
                {
                    label: '  FECHAR  ',
                    onPress: this.doHideBanner,
                },
            ]}
            style={{ elevation: 10 }}
        >
            <Text
                style={{
                    fontFamily: 'OpenSans-Regular'
                }}
            >
                {this.props.bannerText}
            </Text>
        </Banner>
    )
}

const mapStateToProps = state => ({
    bannerVisible: state.AddVehicleReducer.bannerVisible,
    bannerText: state.AddVehicleReducer.bannerText
});

export default connect(mapStateToProps, {
    modifyBannerVisible
})(AddVehicleBanner);

