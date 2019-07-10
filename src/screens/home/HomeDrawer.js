/* eslint-disable max-len */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'react-native-paper';
import { ListItem, Icon } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import { colorAppPrimary } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';

import Images from '../utils/AssetsManager';
import { modifyMenuChoosed } from '../../actions/HomeDrawerActions';
import ListAccordion from '../tools/ListAccordion';

const { imgLogo } = Images;

class HomeDrawer extends React.PureComponent {
    onPressAvatar = () => false

    onMenuChoosed = (value) => {
        this.props.navigation.closeDrawer();
        this.props.modifyMenuChoosed(value);
    }

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
                        <Drawer.Section title={'Menu Principal'} style={styles.section}>
                            <ListItem
                                Component={
                                    (props) => 
                                        <Ripple 
                                            {...props}
                                            rippleCentered
                                            rippleColor={colorAppPrimary}
                                            style={styles.listItem}
                                            onPress={() => this.onMenuChoosed('main')}
                                        />
                                }
                                leftIcon={{ 
                                    name: 'home',
                                    type: 'material-community',
                                    color: 'gray'
                                }}
                                title={'Principal'}
                                titleStyle={styles.listItemTitleDefault}
                                containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
                            />
                            <ListAccordion
                                title={'Veículos'}
                                style={{ paddingLeft: 15, height: 60 }}
                                titleStyle={styles.listItemTitle}
                                borderStyles={{
                                    borderWidth: 1,
                                    borderColor: colorAppPrimary,
                                    borderRadius: 6
                                }}
                                left={() => (
                                    <Icon name={'gauge'} type={'material-community'} color={'gray'} />
                                )}
                            >
                                <ListItem
                                    Component={
                                        (props) => 
                                            <Ripple 
                                                {...props}
                                                rippleCentered
                                                rippleColor={colorAppPrimary} 
                                                style={styles.listItem}
                                                onPress={() => this.props.navigation.navigate('AddVehicle')}
                                            />
                                    }
                                    leftIcon={{ 
                                        name: 'plus',
                                        type: 'material-community',
                                        color: 'gray'
                                    }}
                                    title={'Adicionar veículo'}
                                    titleStyle={styles.listItemTitleDefault}
                                    containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
                                />
                                <ListItem
                                    Component={
                                        (props) => 
                                            <Ripple 
                                                {...props}
                                                rippleCentered
                                                rippleColor={colorAppPrimary} 
                                                style={styles.listItem}
                                                onPress={() => this.onMenuChoosed('myvehicle')}
                                            />
                                    }
                                    leftIcon={{ 
                                        name: 'key-variant',
                                        type: 'material-community',
                                        color: 'gray'
                                    }}
                                    title={'Meu veículo'}
                                    titleStyle={styles.listItemTitleDefault}
                                    containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
                                />
                            </ListAccordion>
                            <View style={{ marginVertical: 5 }} />
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
        color: 'black',
        marginLeft: 16
    },
    listItemTitleDefault: {
        fontFamily: 'OpenSans-SemiBold', 
        fontSize: 14, 
        color: 'black'
    }
});

const mapStateToProps = state => ({
    userInfo: state.UserReducer.userInfo,
    menuChoosed: state.HomeDrawerReducer.menuChoosed
});

export default connect(mapStateToProps, { modifyMenuChoosed })(HomeDrawer);

