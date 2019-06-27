/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    Text,
    StyleSheet,
    BackHandler,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { Appbar } from 'react-native-paper';
import { ListItem } from 'react-native-elements';

import { colorAppForeground } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';

class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.didFocusSubscription = props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
            
            if (this.props.animatedVisible) {
                this.props.animatedVisible('visible', 200);
            }
        });
    }
    
    componentDidMount = () => {
        SplashScreen.hide();
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
          BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentWillUnmount = () => {
        if (this.didFocusSubscription) this.didFocusSubscription.remove();
        if (this.willBlurSubscription) this.willBlurSubscription.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onPressDrawerIcon = () => {
        this.props.navigation.openDrawer();
    }

    onBackButtonPressAndroid = () => {
        const routeName = this.props.navigation.state.routeName;

        if (routeName === 'HomeTab') {
            return true;
        }

        return false;
    }

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
                <View style={{ width: '100%', justifyContent: 'center', paddingLeft: 10 }}>
                    <ListItem
                        leftAvatar={{ 
                            source: { uri: null },
                            editButton: {
                                size: 14,
                                color: 'black',
                                name: 'ios-menu',
                                type: 'ionicon',
                                style: styles.iconDrawer,
                                underlayColor: 'white'
                            },
                            showEditButton: true,
                            activeOpacity: 1,
                            onPress: () => this.onPressDrawerIcon(),
                            onEditPress: () => this.onPressDrawerIcon()
                        }}
                        title={'Home'}
                        titleStyle={defaultTextHeader}
                        containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    />
                </View>
            </Appbar.Header>
            <Text>Início</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
    iconDrawer: {
        backgroundColor: 'white', 
        borderColor: 'grey', 
        borderWidth: 0.5, 
        width: 18, 
        height: 18, 
        borderRadius: 9
    }
});

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible
});

export default connect(mapStateToProps)(HomeScreen);
