/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { DataTable, ActivityIndicator } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TextMask } from 'react-native-masked-text';
import _ from 'lodash';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import CardAccordion from '../tools/CardAccordion';
import DataTableCell from '../tools/DataTableCell';
import { apiGetManut, apiUpdateUserVehiclesManut, apiUpdateUserVehiclesManutBatch } from '../utils/api/ApiManagerConsumer';
import { normalize } from '../utils/StringTextFormats';
import DataTableTitleHeader from '../tools/DataTableTitleHeader';
//import { modifyActionsRows, modifyIsLoadingComplete } from '../../actions/AddVehicleActions';
import { MANUT_ATRAS_TRIGGER_TYPE, colorAppPrimary, DESENV_EMAIL } from '../utils/Constants';
import FormCompleteActionsRow from '../home/drawer_vehicles/FormCompleteActionsRow';
import { store } from '../../App';
import { 
    modifyAlertInit,
    modifyAlertTitle,
    modifyAlertMessage,
    modifyAlertConfirmFunction,
    modifyAlertCancelFunction,
    modifyAlertVisible
} from '../../actions/ManutTabActions';

const maxAccordionSize = Dimensions.get('window').height / 2.5;

class ManutTabViewMain extends React.PureComponent {
    constructor(props) {
        super(props);

        this.renderItemManutProxPc = React.memo(this.renderItemManutProx);
        this.renderItemManutAtrasPc = React.memo(this.renderItemManutAtras);
        this.renderItemManutConfirmPc = React.memo(this.renderItemManutConfirm);
        this.renderSaveButtonConfirmPc = React.memo(this.renderSaveButtonConfirm);

        this.actionsRowsAtras = [];

        this.refAccordionProxManuts = React.createRef();
        this.refAccordionAtrasManuts = React.createRef();
        this.refAccordionConfirmManuts = React.createRef();

        this.state = {
            isLoading: false,
            itemsProx: [],
            itemsAtras: [],
            itemsConfirm: []
        };
    }

    componentDidMount = () => {
        if (this.props.vehicleSelected.uniqueId) {
            this.fetchManuts();
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.vehicleSelected.uniqueId) {
            if (prevProps.vehicleSelected.uniqueId !== this.props.vehicleSelected.uniqueId) {
                this.fetchManuts();
            }
        }
    }

    onChangeAtrasActionsRows = (index, action, itemIndexInRow) => {
        const rowFounded = !!(this.actionsRowsAtras[index] && this.actionsRowsAtras[index][itemIndexInRow]);

        if (rowFounded) {
            this.actionsRowsAtras[index][itemIndexInRow].action = action;
        }
    }

    onPressSaveActionsAtras = () => {
        if (this.refAccordionAtrasManuts.current) this.refAccordionAtrasManuts.current.showFooter();
        const mappedRows = _.map(this.actionsRowsAtras, ita => {
            for (let index = 0; index < ita.length; index++) {
                const element = ita[index];
                
                if (element.action === MANUT_ATRAS_TRIGGER_TYPE.LIKE || element.action === MANUT_ATRAS_TRIGGER_TYPE.UNLIKE) {
                    return { ...element };
                }

                return null;
            }
        });
        const filtredRows = _.filter(mappedRows, itb => !!itb);

        if (filtredRows.length) {
            const funExec = _.debounce(async () => {
                const userEmail = store.getState().UserReducer.userInfo.email;
                const {
                    manufacturer,
                    model,
                    year,
                    nickname
                } = this.props.vehicleSelected;

                const batch = [];

                for (let indexP = 0; indexP < filtredRows.length; indexP++) {
                    const elementP = filtredRows[indexP];

                    const {
                        itemabrev,
                        quilometros,
                        tipomanut,
                        action
                    } = elementP;

                    batch.push({
                        user_email: userEmail || DESENV_EMAIL,
                        manufacturer,
                        model,
                        year,
                        itemabrev,
                        quilometers_manut: quilometros,
                        type_manut: tipomanut,
                        nickname,
                        action
                    });
                }

                const ret = await apiUpdateUserVehiclesManutBatch({
                    batch
                });

                if (!ret.success && this.refAccordionConfirmManuts.current) {
                    this.refAccordionConfirmManuts.current.changeTextFooterWithError(ret.message);
                    this.setState({ isLoading: false });
                } else {
                    this.fetchManuts(false);
                }
            }, 1000);

            this.props.modifyAlertInit();
            this.props.modifyAlertTitle('Aviso');

            this.props.modifyAlertMessage('Aa manutenções realizadas e não realizadas serão confirmadas. Deseja continuar?');
            this.props.modifyAlertConfirmFunction((doHideAlert) => { 
                doHideAlert();
                if (this.refAccordionAtrasManuts.current) {
                    this.refAccordionAtrasManuts.current.changeTextFooter('Salvando...');
                    this.refAccordionAtrasManuts.current.showFooter();
                }
                this.setState({ isLoading: true }, () => funExec());
            });
            this.props.modifyAlertCancelFunction((doHideAlert) => { doHideAlert(); });
            this.props.modifyAlertVisible(true);
        }
    }

    onPressAtrasTouchCallback = () => {
        if (this.refAccordionAtrasManuts.current) this.refAccordionAtrasManuts.current.showFooter();
    }

    onPressConfirmTrashIcon = (index, itemIndexInRow) => {
        const rowFounded = !!(this.state.itemsConfirm[index] && this.state.itemsConfirm[index][itemIndexInRow]);

        if (rowFounded) {
            const funExec = _.debounce(async () => {
                const userEmail = store.getState().UserReducer.userInfo.email;
                const {
                    manufacturer,
                    model,
                    year,
                    nickname
                } = this.props.vehicleSelected;

                const {
                    itemabrev,
                    quilometros,
                    tipomanut
                } = this.state.itemsConfirm[index][itemIndexInRow];

                const ret = await apiUpdateUserVehiclesManut({
                    user_email: userEmail || DESENV_EMAIL,
                    manufacturer,
                    model,
                    year,
                    itemabrev,
                    quilometers_manut: quilometros,
                    type_manut: tipomanut,
                    nickname,
                    action: 3
                }, true);

                if (!ret.success && this.refAccordionConfirmManuts.current) {
                    this.refAccordionConfirmManuts.current.changeTextFooterWithError(ret.message);
                    this.setState({ isLoading: false });
                } else {
                    this.fetchManuts(false);
                }
            }, 1000);

            this.props.modifyAlertInit();
            this.props.modifyAlertTitle('Aviso');

            this.props.modifyAlertMessage('A manutenção confirmada retornará para a lista de manutenções atrasadas. Deseja continuar?');
            this.props.modifyAlertConfirmFunction((doHideAlert) => { 
                doHideAlert();
                if (this.refAccordionConfirmManuts.current) {
                    this.refAccordionConfirmManuts.current.changeTextFooter('Desfazendo a manutenção...');
                    this.refAccordionConfirmManuts.current.showFooter();
                }
                this.setState({ isLoading: true }, () => funExec());
            });
            this.props.modifyAlertCancelFunction((doHideAlert) => { doHideAlert(); });
            this.props.modifyAlertVisible(true);
        }
    }

    saveManutChanges = async (index, action, itemIndexInRow) => {
        const rowFounded = !!(this.state.itemsConfirm[index] && this.state.itemsConfirm[index][itemIndexInRow]);
    
        if (rowFounded) {
            const userEmail = store.getState().UserReducer.userInfo.email;
            const {
                manufacturer,
                model,
                year,
                nickname
            } = this.props.vehicleSelected;

            const {
                itemabrev,
                quilometros,
                tipomanut
            } = this.state.itemsConfirm[index][itemIndexInRow];

            const ret = await apiUpdateUserVehiclesManut({
                user_email: userEmail || DESENV_EMAIL,
                manufacturer,
                model,
                year,
                itemabrev,
                quilometers_manut: quilometros,
                type_manut: tipomanut,
                nickname,
                action
            });

            if (!ret.success && this.refAccordionConfirmManuts.current) {
                this.refAccordionConfirmManuts.current.changeTextFooterWithError(ret.message);
                return;
            }
        }

        if (this.refAccordionConfirmManuts.current) this.refAccordionConfirmManuts.current.hideFooter();
    }

    fetchManuts = async (openAccordions = true) => {
        const {
            manufacturer,
            model,
            year,
            quilometers,
            nickname
        } = this.props.vehicleSelected;

        const userEmail = store.getState().UserReducer.userInfo.email;

        this.actionsRowsAtras = [];

        let proxData = [];
        let atrasData = [];
        let confirmData = [];

        if (!(manufacturer && model && year && quilometers)) {
            this.setState(
                { isLoading: false },
                () => false
            );
            return false;
        }

        if (openAccordions) {
            if (this.refAccordionProxManuts.current) this.refAccordionProxManuts.current.openAccordion();
            if (this.refAccordionAtrasManuts.current) this.refAccordionAtrasManuts.current.openAccordion();
            if (this.refAccordionConfirmManuts.current) this.refAccordionConfirmManuts.current.openAccordion();
        }

        this.setState({ isLoading: true });

        try {
            const funExec = async () => {
                const ret = await apiGetManut({
                    manufacturer,
                    model,
                    year,
                    quilometers,
                    type: 'all_merged',
                    nickname,
                    user_email: userEmail || DESENV_EMAIL
                });

                const validRet = ret.data && ret.data.success && ret.data.data;
        
                if (validRet && ret.data.data.prox) proxData = [...ret.data.data.prox];

                if (validRet && ret.data.data.atras) {
                    atrasData = [...ret.data.data.atras];
                    atrasData = _.groupBy(atrasData, 'itemabrev');
                    atrasData = _.orderBy(atrasData, (itd) => _.maxBy(itd, 'quilometros').quilometros, ['desc']);

                    this.actionsRowsAtras = [...atrasData];

                    for (let indexB = 0; indexB < this.actionsRowsAtras.length; indexB++) {
                        const elementB = this.actionsRowsAtras[indexB];
                        for (let indexC = 0; indexC < elementB.length; indexC++) {
                            const elementC = elementB[indexC];
    
                            elementC.action = MANUT_ATRAS_TRIGGER_TYPE.WARNING;
                        }
                    }
                }

                if (validRet && ret.data.data.confirm) {
                    confirmData = [...ret.data.data.confirm];
                    confirmData = _.groupBy(confirmData, 'itemabrev');
                    confirmData = _.orderBy(confirmData, (itd) => _.maxBy(itd, 'quilometros').quilometros, ['desc']);
                }
                
                this.setState(
                    { isLoading: false, itemsProx: proxData, itemsAtras: atrasData, itemsConfirm: confirmData },
                    () => false
                );
            };
    
            funExec();
        } catch (e) {
            this.setState(
                { isLoading: false },
                () => false
            );
        }

        if (this.refAccordionConfirmManuts.current) {
            this.refAccordionConfirmManuts.current.hideFooter();
        }
    }

    renderManutProx = () => {
        const { quilometers, uniqueId } = this.props.vehicleSelected;

        if (this.state.isLoading) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <ShimmerPlaceHolder autoRun visible={false}>
                        <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                            Carregando...
                        </Text>
                    </ShimmerPlaceHolder>
                </View>
            );
        }

        if (!uniqueId) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Selecione um veículo para visualizar as manutenções próximas.
                    </Text>
                </View>
            );
        } 

        if (!quilometers) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Para visualizar as manutenções é necessário que o veículo possua a quilometragem informada.
                    </Text>
                </View>
            );
        } 
        
        if (this.state.itemsProx.length) {
            return (
                <View
                    style={{ height: maxAccordionSize }}
                >
                    <FlatList
                        bounces={false}
                        data={this.state.itemsProx}
                        renderItem={(propsItem) => <this.renderItemManutProxPc {...propsItem} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }

        return (
            <View
                style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                    Não há manutenções próximas para o veículo.
                </Text>
            </View>
        );
    }

    renderItemManutProx = ({ item, index }) => (
        <DataTable.Row key={index} style={{ paddingVertical: 5 }}>
            <DataTableCell numberOfLines={6} style={{ flex: 2 }}>{item.itemabrev}</DataTableCell>
            <DataTableCell numberOfLines={6} numeric style={{ flex: 1 }}>
                <TextMask
                    type={'money'}
                    options={{
                        precision: 0,
                        separator: '.',
                        delimiter: '',
                        unit: '',
                        suffixUnit: ''
                    }}
                    value={item.quilometros}
                />
            </DataTableCell>
        </DataTable.Row>
    ) 

    renderManutAtras = () => {
        const { quilometers, uniqueId } = this.props.vehicleSelected;

        if (this.state.isLoading) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <ShimmerPlaceHolder autoRun visible={false}>
                        <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                            Carregando...
                        </Text>
                    </ShimmerPlaceHolder>
                </View>
            );
        }

        if (!uniqueId) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Selecione um veículo para visualizar as manutenções atrasadas.
                    </Text>
                </View>
            );
        } 
        
        if (!quilometers) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Para visualizar as manutenções é necessário que o veículo possua a quilometragem informada.
                    </Text>
                </View>
            );
        } 
        
        if (this.state.itemsAtras.length) {
            return (
                <View
                    style={{ height: maxAccordionSize }}
                >
                    <FlatList
                        bounces={false}
                        data={this.state.itemsAtras}
                        renderItem={(propsItem) => <this.renderItemManutAtrasPc {...propsItem} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }

        return (
            <View
                style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                    Não há manutenções atrasadas para o veículo.
                </Text>
            </View>
        );
    }

    renderItemManutAtras = ({ item, index }) => (
        <DataTable.Row key={index} style={{ paddingVertical: 5 }}>
            <View style={{ flex: 1 }}>
                {
                    _.map(item, (ita, indexB) => (
                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
                            <DataTableCell numberOfLines={6} style={{ flex: 1.5 }}>{ita.itemabrev}</DataTableCell>
                            <DataTableCell numberOfLines={6} numeric style={{ flex: 1 }}>
                                <TextMask
                                    type={'money'}
                                    options={{
                                        precision: 0,
                                        separator: '.',
                                        delimiter: '',
                                        unit: '',
                                        suffixUnit: ''
                                    }}
                                    value={ita.quilometros}
                                />
                            </DataTableCell>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <FormCompleteActionsRow 
                                    itemIndex={index}
                                    itemIndexInRow={indexB}
                                    onChangeActionsRows={this.onChangeAtrasActionsRows} 
                                    onPressTouchCallback={this.onPressAtrasTouchCallback} 
                                />
                            </View>
                        </View>
                    ))
                }
            </View>
        </DataTable.Row>
    )

    renderManutConfirm = () => {
        const { quilometers, uniqueId } = this.props.vehicleSelected;

        if (this.state.isLoading) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <ShimmerPlaceHolder autoRun visible={false}>
                        <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                            Carregando...
                        </Text>
                    </ShimmerPlaceHolder>
                </View>
            );
        }

        if (!uniqueId) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Selecione um veículo para visualizar as manutenções confirmadas.
                    </Text>
                </View>
            );
        } 
        
        if (!quilometers) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Para visualizar as manutenções é necessário que o veículo possua a quilometragem informada.
                    </Text>
                </View>
            );
        } 
        
        if (this.state.itemsConfirm.length) {
            return (
                <View
                    style={{ height: maxAccordionSize }}
                >
                    <FlatList
                        bounces={false}
                        data={this.state.itemsConfirm}
                        renderItem={(propsItem) => <this.renderItemManutConfirmPc {...propsItem} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }

        return (
            <View
                style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                    Não há manutenções confirmadas para o veículo.
                </Text>
            </View>
        );
    }

    renderItemManutConfirm = ({ item, index }) => (
        <DataTable.Row key={index} style={{ paddingVertical: 5 }}>
            <View style={{ flex: 1 }}>
                {
                    _.map(item, (ita, indexB) => {
                        const debouncedSaveManutChanges = _.debounce(this.saveManutChanges, 1000);
                        return (
                            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
                                <DataTableCell numberOfLines={6} style={{ flex: 1.5 }}>{ita.itemabrev}</DataTableCell>
                                <DataTableCell numberOfLines={6} numeric style={{ flex: 1 }}>
                                    <TextMask
                                        type={'money'}
                                        options={{
                                            precision: 0,
                                            separator: '.',
                                            delimiter: '',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
                                        value={ita.quilometros}
                                    />
                                </DataTableCell>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <FormCompleteActionsRow 
                                        itemIndex={index}
                                        itemIndexInRow={indexB}
                                        showTypes={['thumbsup', 'thumbsdown']}
                                        initialIcon={ita.action === 1 ? 'thumbsup' : 'thumbsdown'}
                                        enableTrash
                                        onPressTouchTrashCallback={this.onPressConfirmTrashIcon}
                                        onChangeActionsRows={(indexZ, action, itemIndexInRowZ) => {
                                            if (this.refAccordionConfirmManuts.current) {
                                                this.refAccordionConfirmManuts.current.changeTextFooter('Salvando...');
                                                this.refAccordionConfirmManuts.current.showFooter();
                                            }
                                    
                                            debouncedSaveManutChanges(indexZ, action, itemIndexInRowZ);
                                        }} 
                                    />
                                </View>
                            </View>
                        );
                    })
                }
            </View>
        </DataTable.Row>
    ) 

    renderManager = () => this.renderScrollView()

    renderSaveButtonAtras = () => (
        <View style={{ width: '100%', height: 60, paddingHorizontal: 15 }}>
            <View style={{ width: '100%', height: 50, alignItems: 'flex-end', justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={this.onPressSaveActionsAtras}
                >
                    <View 
                        style={{
                            backgroundColor: colorAppPrimary,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 4,
                            padding: 8
                        }}
                    >
                        <Icon name={'content-save'} type={'material-community'} color={'white'} size={18} containerStyle={{ marginRight: 5 }} />
                        <Text style={{ fontFamily: 'OpenSans-SemiBold', color: 'white', fontSize: 12 }}>Salvar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )

    renderSaveButtonConfirm = (props) => (
        <View style={{ width: '100%', height: 60, paddingHorizontal: 15 }}>
            <View style={{ width: '100%', height: 50, alignItems: 'flex-end', justifyContent: 'center' }}>
                <View 
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 8
                    }}
                >
                    {
                        !props.hasError && (
                            <ActivityIndicator style={{ marginRight: 10 }} size={16} />
                        )
                    }
                    <Text style={{ fontFamily: 'OpenSans-SemiBold', color: props.hasError ? 'red' : 'black', fontSize: 12 }}>{props.text}</Text>
                </View>
            </View>
        </View>
    )

    renderScrollView = () => (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
            <View style={{ flex: 1 }}>
                <CardAccordion
                    keyCard={'manutprox'}
                    ref={this.refAccordionProxManuts}
                    title={'Próximas'}
                    titleStyle={{ fontSize: normalize(16), fontFamily: 'OpenSans-SemiBold' }}
                    titleLeftComponent={() =>
                        <Icon 
                            name={'toolbox-outline'}
                            type={'material-community'}
                            color={'gray'}
                        />
                    }
                >
                    <DataTable>
                        <DataTable.Header>
                            <DataTableTitleHeader style={{ flex: 2 }}>Manutenção</DataTableTitleHeader>
                            <DataTableTitleHeader numeric style={{ flex: 1 }}>Km</DataTableTitleHeader>
                        </DataTable.Header>
                        {this.renderManutProx()}
                    </DataTable>
                </CardAccordion>
                <CardAccordion
                    keyCard={'manutatras'}
                    ref={this.refAccordionAtrasManuts}
                    title={'Atrasadas'}
                    titleStyle={{ fontSize: normalize(16), fontFamily: 'OpenSans-SemiBold' }}
                    titleLeftComponent={() =>
                        <Icon 
                            name={'toolbox-outline'}
                            type={'material-community'}
                            color={'gray'}
                        />
                    }
                    renderFooter={this.renderSaveButtonAtras}
                    footerHeight={60}
                >
                    <DataTable>
                        <DataTable.Header>
                            <DataTableTitleHeader style={{ flex: 1.5 }}>Manutenção</DataTableTitleHeader>
                            <DataTableTitleHeader numeric style={{ flex: 1 }}>Km</DataTableTitleHeader>
                            <DataTableTitleHeader 
                                style={{ flex: 1, justifyContent: 'flex-end' }}
                                iconRight={(textColor, containerStyles) => (
                                    <Icon 
                                        name={'information-outline'} 
                                        type={'material-community'} 
                                        color={textColor} 
                                        size={18}
                                        containerStyle={[containerStyles, { marginLeft: 2 }]}
                                    />
                                )}
                                tooltipCompContent={(
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', color: 'white' }}>
                                                As seguintes ações estão disponíveis para cada manutenção.
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1.6, alignItens: 'flex-start', justifyContent: 'space-around' }}>
                                            <View style={{ flexDirection: 'row', alignItens: 'center', justifyContent: 'flex-start' }}>
                                                <Icon name={'alert'} type={'material-community'} color={'orange'} containerStyle={{ marginRight: 8 }} />
                                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}>
                                                    Manutenção planejada
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItens: 'center', justifyContent: 'flex-start' }}>
                                                <Icon name={'thumb-up'} type={'material-community'} color={'green'} containerStyle={{ marginRight: 8 }} />
                                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}>
                                                    Manutenção realizada
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItens: 'center', justifyContent: 'flex-start' }}>
                                                <Icon name={'thumb-down'} type={'material-community'} color={'red'} containerStyle={{ marginRight: 8 }} />
                                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}>
                                                    Manutenção não realizada
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                tooltipProps={{
                                    height: 200,
                                    width: 300,
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    containerStyle: {
                                        padding: 15
                                    }
                                }}
                            >
                                Ação
                            </DataTableTitleHeader>
                        </DataTable.Header>
                        {this.renderManutAtras()}
                    </DataTable>
                </CardAccordion>
                <CardAccordion
                    keyCard={'manutconfirm'}
                    ref={this.refAccordionConfirmManuts}
                    title={'Confirmadas'}
                    titleStyle={{ fontSize: normalize(16), fontFamily: 'OpenSans-SemiBold' }}
                    titleLeftComponent={() =>
                        <Icon 
                            name={'toolbox-outline'}
                            type={'material-community'}
                            color={'gray'}
                        />
                    }
                    renderFooter={this.renderSaveButtonConfirmPc}
                    footerHeight={60}
                    enableFooterAnim
                >
                    <DataTable>
                        <DataTable.Header>
                            <DataTableTitleHeader style={{ flex: 1.5 }}>Manutenção</DataTableTitleHeader>
                            <DataTableTitleHeader numeric style={{ flex: 1 }}>Km</DataTableTitleHeader>
                            <DataTableTitleHeader 
                                style={{ flex: 1, justifyContent: 'flex-end' }}
                                iconRight={(textColor, containerStyles) => (
                                    <Icon 
                                        name={'information-outline'} 
                                        type={'material-community'} 
                                        color={textColor} 
                                        size={18}
                                        containerStyle={[containerStyles, { marginLeft: 2 }]}
                                    />
                                )}
                                tooltipCompContent={(
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', color: 'white' }}>
                                                As seguintes ações estão disponíveis para cada manutenção.
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1.6, alignItens: 'flex-start', justifyContent: 'space-around' }}>
                                            <View style={{ flexDirection: 'row', alignItens: 'center', justifyContent: 'flex-start' }}>
                                                <Icon name={'thumb-up'} type={'material-community'} color={'green'} containerStyle={{ marginRight: 8 }} />
                                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}>
                                                    Manutenção realizada
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItens: 'center', justifyContent: 'flex-start' }}>
                                                <Icon name={'thumb-down'} type={'material-community'} color={'red'} containerStyle={{ marginRight: 8 }} />
                                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}>
                                                    Manutenção não realizada
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                tooltipProps={{
                                    height: 200,
                                    width: 300,
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    containerStyle: {
                                        padding: 15
                                    }
                                }}
                            >
                                Ação
                            </DataTableTitleHeader>
                        </DataTable.Header>
                        {this.renderManutConfirm()}
                    </DataTable>
                </CardAccordion>
            </View>
            <View style={{ marginVertical: 100 }} />
        </ScrollView>
    )

    render = () => (
        <View style={styles.mainView}>
            {this.renderManager()}
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    }
});

const mapStateToProps = (state) => ({
    vehicleSelected: state.UserReducer.vehicleSelected
});

export default connect(mapStateToProps, {
    modifyAlertInit,
    modifyAlertTitle,
    modifyAlertMessage,
    modifyAlertConfirmFunction,
    modifyAlertCancelFunction,
    modifyAlertVisible
})(ManutTabViewMain);
