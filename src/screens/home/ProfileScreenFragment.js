/* eslint-disable max-len */
import React from 'react';
import { 
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';
import HeaderDefault from '../tools/HeaderDefault';

export default class ProfileScreenFragment extends React.PureComponent {
    onPressBack = () => this.props.backToProfile()

    renderHeader = (title = '') => (
        <HeaderDefault backActionProps={{ onPress: this.onPressBack }} title={title} />
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
