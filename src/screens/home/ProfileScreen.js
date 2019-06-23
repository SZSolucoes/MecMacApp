/* eslint-disable max-len */
import React from 'react';
import { 
    View,
    StyleSheet,
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import { Pages } from 'react-native-pages';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { colorAppForeground } from '../utils/Constants';
import ProfileScreenFragment from './ProfileScreenFragment';

class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    onPressItemList = async (itemName) => {
        if (itemName === 'profile_exit') {
            try {
                await AsyncStorage.removeItem('@isFirstOpened');
                await AsyncStorage.removeItem('@isUserLogged');
                this.props.navigation.navigate('Auth');
            } catch (e) {
                console.log('AsyncStorage error');
            }
        } else if (itemName === 'profile_next') {
            if (this.swiperRef) this.swiperRef.scrollToPage(1);
            if (this.props.animatedVisible) {
                this.props.animatedVisible('hide', 200);
            }
        }
    }

    backToProfile = () => {
        if (this.swiperRef) {
            this.swiperRef.scrollToPage(0);
            if (this.props.animatedVisible) {
                this.props.animatedVisible('visible', 200);
            }
        }
    }

    render = () => (
        <View style={styles.mainView}>
            <Pages
                ref={ref => (this.swiperRef = ref)}
                scrollEnabled={false}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                indicatorPosition={'none'}
            >
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <List.Section>
                        <List.Subheader>Título</List.Subheader>
                        <List.Item
                            title="Item 1"
                            onPress={() => this.onPressItemList('profile_next')}
                            left={() => <List.Icon icon="folder" />}
                            right={() => <Icon size={20} color="gray" name="ios-arrow-forward" type={'ionicon'} containerStyle={styles.iconContainer} />}
                        />
                        <Divider />
                        <List.Item
                            title="Item 2"
                            onPress={() => this.onPressItemList('profile_next')}
                            titleStyle={{ color: 'black' }}
                            left={() => <List.Icon color="#000" icon="folder" />}
                            right={() => <Icon size={20} color="gray" name="ios-arrow-forward" type={'ionicon'} containerStyle={styles.iconContainer} />}
                        />
                        <Divider />
                        <List.Item
                            title="Sair"
                            onPress={() => this.onPressItemList('profile_exit')}
                            titleStyle={{ color: 'red' }}
                            left={() => <Icon size={26} name="ios-log-out" type={'ionicon'} containerStyle={styles.iconContainer} />}
                        />
                    </List.Section>
                </View>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <ProfileScreenFragment backToProfile={this.backToProfile} />
                </View>
            </Pages>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colorAppForeground
    },
    iconContainer: {
        margin: 8,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = (state) => ({
    animatedVisible: state.CustomHomeTabBarReducer.animatedVisible
});

export default connect(mapStateToProps)(ProfileScreen);
