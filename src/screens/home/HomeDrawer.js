/* eslint-disable max-len */
import React from 'react';
import { View, ScrollView, StyleSheet, findNodeHandle, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'react-native-paper';
import { ListItem, Icon } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import AsyncStorage from '@react-native-community/async-storage';

import { colorAppPrimary, HOMEDRAWERMENU } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';

import Images from '../utils/AssetsManager';
import { modifyMenuChoosed, modifyResetDefault } from '../../actions/HomeDrawerActions';
import ListAccordion from '../tools/ListAccordion';

const { imgLogo } = Images;

class HomeDrawer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.scrollViewRef = React.createRef();

        this.state = {
            resetExpandedSwitch: false
        };
    }

    componentWillUnmount = () => this.props.modifyResetDefault()

    onPressAvatar = () => false

    onMenuChooseMain = () => {
        this.closeDrawer();
        this.props.modifyMenuChoosed(HOMEDRAWERMENU.MAIN);
    }

    onMenuChooseMainAddVehicle = () => {
        this.closeDrawer();
        this.props.navigation.navigate('AddVehicle');
    }

    onMenuChooseMyVehicle = () => {
        this.closeDrawer();
        this.props.modifyMenuChoosed(HOMEDRAWERMENU.MYVEHICLE);
    }

    onMenuChooseManut = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChooseExpensesFuel = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChooseExpensesTaxs = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChooseExpensesToll = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChooseExpensesFinancing = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChoosePromotions = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChooseBlog = () => {
        Alert.alert('Aviso', 'Em desenvolvimento.');
    }

    onMenuChoosePerfil = () => {
        this.props.navigation.navigate('Profile');
    }

    onMenuChooseLogout = () => {
        try {
            Alert.alert(
                'Aviso', 
                'Desejar encerrar a sessão e sair para a tela de login ?',
                [
                    { text: 'Cancelar', onPress: () => false },
                    { 
                        text: 'Sim', 
                        onPress: async () => {
                            await AsyncStorage.removeItem('@isFirstOpened');
                            await AsyncStorage.removeItem('@isUserLogged');
                            await AsyncStorage.removeItem('@userProfileJson');

                            /* await this.props.handleFacebookLogout();
                            await this.props.handleGoogleLogout(); */

                            this.props.navigation.navigate('Auth');
                        }
                    }
                ],
                { cancelable: true }
            );
        } catch (e) {
            console.log('AsyncStorage error');
        }
    }

    doScrollTo = (childRef) => childRef && childRef.current && this.scrollViewRef.current && childRef.current.measureLayout(
        findNodeHandle(this.scrollViewRef.current),
        (x, y) => this.scrollViewRef.current && this.scrollViewRef.current.scrollTo({ x: 0, y: y / 2, animated: true })
    ) 
    
    closeDrawer = () => { 
        this.props.navigation.closeDrawer();
        setTimeout(() => {
            if (this.scrollViewRef.current) this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
            this.setState({ resetExpandedSwitch: !this.state.resetExpandedSwitch });
        }, 1000);
    }

    renderHome = () => (
        <ListItem
            Component={
                (props) => 
                    <Ripple 
                        {...props}
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        style={styles.listItem}
                        onPress={this.onMenuChooseMain}
                    />
            }
            leftIcon={{ 
                name: 'home',
                type: 'material-community',
                color: 'gray'
            }}
            title={'Início'}
            titleStyle={styles.listItemTitleDefault}
            containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
        />
    )

    renderManut = () => (
        <ListItem
            Component={
                (props) => 
                    <Ripple 
                        {...props}
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        style={styles.listItem}
                        onPress={this.onMenuChooseManut}
                    />
            }
            leftIcon={{ 
                name: 'toolbox-outline',
                type: 'material-community',
                color: 'gray'
            }}
            title={'Manutenções'}
            titleStyle={styles.listItemTitleDefault}
            containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
        />
    )

    renderVehicles = () => (
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
            doScrollTo={this.doScrollTo}
            resetExpandedSwitch={this.state.resetExpandedSwitch}
        >
            <ListItem
                Component={
                    (props) => 
                        <Ripple 
                            {...props}
                            rippleCentered
                            rippleColor={colorAppPrimary} 
                            style={styles.listItem}
                            onPress={this.onMenuChooseMainAddVehicle}
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
                            onPress={this.onMenuChooseMyVehicle}
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
    )

    renderExpenses = () => (
        <ListAccordion
            title={'Despesas'}
            style={{ paddingLeft: 15, height: 60 }}
            titleStyle={styles.listItemTitle}
            borderStyles={{
                borderWidth: 1,
                borderColor: colorAppPrimary,
                borderRadius: 6
            }}
            left={() => (
                <Icon name={'cash-multiple'} type={'material-community'} color={'gray'} />
            )}
            doScrollTo={this.doScrollTo}
            resetExpandedSwitch={this.state.resetExpandedSwitch}
        >
            <ListItem
                Component={
                    (props) => 
                        <Ripple 
                            {...props}
                            rippleCentered
                            rippleColor={colorAppPrimary} 
                            style={styles.listItem}
                            onPress={this.onMenuChooseExpensesFuel}
                        />
                }
                leftIcon={{ 
                    name: 'fuel',
                    type: 'material-community',
                    color: 'gray'
                }}
                title={'Combustível'}
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
                            onPress={this.onMenuChooseExpensesTaxs}
                        />
                }
                leftIcon={{ 
                    name: 'receipt',
                    type: 'material-community',
                    color: 'gray'
                }}
                title={'Impostos'}
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
                            onPress={this.onMenuChooseExpensesToll}
                        />
                }
                leftIcon={{ 
                    name: 'coins',
                    type: 'material-community',
                    color: 'gray'
                }}
                title={'Pedágio'}
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
                            onPress={this.onMenuChooseExpensesFinancing}
                        />
                }
                leftIcon={{ 
                    name: 'bank',
                    type: 'material-community',
                    color: 'gray'
                }}
                title={'Financiamento'}
                titleStyle={styles.listItemTitleDefault}
                containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
            />
        </ListAccordion>
    )

    renderPromotions = () => (
        <ListItem
            Component={
                (props) => 
                    <Ripple 
                        {...props}
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        style={styles.listItem}
                        onPress={this.onMenuChoosePromotions}
                    />
            }
            leftIcon={{ 
                name: 'sale',
                type: 'material-community',
                color: 'gray'
            }}
            title={'Promoções'}
            titleStyle={styles.listItemTitleDefault}
            containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
        />
    )

    renderBlog = () => (
        <ListItem
            Component={
                (props) => 
                    <Ripple 
                        {...props}
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        style={styles.listItem}
                        onPress={this.onMenuChooseBlog}
                    />
            }
            leftIcon={{ 
                name: 'blogger',
                type: 'material-community',
                color: 'gray'
            }}
            title={'Blog'}
            titleStyle={styles.listItemTitleDefault}
            containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
        />
    )

    renderPerfil = () => (
        <ListItem
            Component={
                (props) => 
                    <Ripple 
                        {...props}
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        style={styles.listItem}
                        onPress={this.onMenuChoosePerfil}
                    />
            }
            leftIcon={{ 
                name: 'account',
                type: 'material-community',
                color: 'gray'
            }}
            title={'Perfil'}
            titleStyle={styles.listItemTitleDefault}
            containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent' }}
        />
    )

    renderLogout = () => (
        <ListItem
            Component={
                (props) => 
                    <Ripple 
                        {...props}
                        rippleCentered
                        rippleColor={colorAppPrimary}
                        style={styles.listItem}
                        onPress={this.onMenuChooseLogout}
                    />
            }
            leftIcon={{ 
                name: 'ios-log-out', 
                type: 'ionicon',
                color: 'gray'
            }}
            title={'Sair'}
            titleStyle={[styles.listItemTitleDefault, { color: 'red' }]}
            containerStyle={{ padding: 0, height: 40, backgroundColor: 'transparent', marginLeft: 4 }}
        />
    )

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
                <ScrollView ref={this.scrollViewRef}>
                    <View style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                        <Drawer.Section title={'Menu Principal'} style={styles.section}>
                            {this.renderHome()}
                            {/* this.renderManut() */}
                            {this.renderVehicles()}
                            {/* this.renderExpenses() */}
                            {/* this.renderPromotions() */}
                            {/* this.renderBlog() */}
                            <View style={{ marginVertical: 5 }} />
                        </Drawer.Section>
                        {this.renderPerfil()}
                        {this.renderLogout()}
                    </View>
                    <View style={{ marginVertical: 50 }} />
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

export default connect(mapStateToProps, { 
    modifyMenuChoosed,
    modifyResetDefault
})(HomeDrawer);

