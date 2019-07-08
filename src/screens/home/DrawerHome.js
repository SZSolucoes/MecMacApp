/* eslint-disable max-len */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import { colorAppPrimary } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';

import Images from '../utils/AssetsManager';

const { imgLogo } = Images;

class DrawerHome extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeItemMenu: 'home'
        };
    }

    onPressAvatar = () => false

    render() {
        return (
            <React.Fragment>
                <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: colorAppPrimary }}>
                    <ListItem
                        leftAvatar={{ 
                            source: this.props.userInfo.photourl ? { uri: this.props.userInfo.photourl } : imgLogo,
                            activeOpacity: 1,
                            onPress: this.onPressAvatar
                        }}
                        title={this.props.userInfo.name || 'MecMac'}
                        titleStyle={[defaultTextHeader, { color: 'white' }]}
                        subtitle={this.props.userInfo.email || null}
                        subtitleStyle={{ color: 'white' }}
                        containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    />
                </View>
                <ScrollView>
                    <View style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                        <Drawer.Section title={'Principal'} style={styles.section}>
                            <ListItem
                                Component={(props) => <Ripple rippleColor={colorAppPrimary} {...props} style={styles.listItem} />}
                                leftIcon={{ 
                                    name: 'home-outline',
                                    type: 'material-community'
                                }}
                                title={'Home'}
                                titleStyle={styles.listItemTitle}
                                containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                            />
                        </Drawer.Section>
                    </View>
                </ScrollView>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    section: {
        padding: 5
    },
    listItem: {
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    listItemTitle: {
        fontFamily: 'OpenSans-SemiBold', 
        fontSize: 14, 
        color: 'black'
    }
});

const mapStateToProps = state => ({
    userInfo: state.UserReducer.userInfo
});

export default connect(mapStateToProps)(DrawerHome);

