/* eslint-disable max-len */
import React from 'react';
import { Appbar } from 'react-native-paper';
import { 
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';

export default class ProfileScreenFragment extends React.PureComponent {
    onPressBack = () => this.props.backToProfile()

    renderHeader = (title = '') => (
        <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
            <Appbar.BackAction onPress={this.onPressBack} />
            <Appbar.Content title={title} titleStyle={{ fontFamily: 'OpenSans-Regular' }} />
        </Appbar.Header>
    )

    renderDefault = () => this.renderHeader()

    renderEditProfile = () => (
        <React.Fragment>
            {this.renderHeader('Editar Perfil')}
        </React.Fragment>
    )

    renderPrefs = () => (
        <React.Fragment>
            {this.renderHeader('Preferências')}
        </React.Fragment>
    )

    renderManager = (fragmentScreen) => {
        switch (fragmentScreen) {
            case 'editprofile':
                return this.renderEditProfile();
            case 'prefs':
                return this.renderPrefs();
            default:
                return this.renderDefault();
        }
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            {this.renderManager(this.props.fragmentScreen)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
});
