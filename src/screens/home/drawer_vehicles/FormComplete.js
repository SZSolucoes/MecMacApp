/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { DataTable } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { TextMask } from 'react-native-masked-text';
import _ from 'lodash';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { store } from '../../../App';
import CardAccordion from '../../tools/CardAccordion';
import DataTableCell from '../../tools/DataTableCell';
import { apiGetManut } from '../../utils/api/ApiManagerConsumer';
import { normalize } from '../../utils/StringTextFormats';
import FormCompleteActionsRow from './FormCompleteActionsRow';
import DataTableTitleHeader from '../../tools/DataTableTitleHeader';
import { modifyActionsRows, modifyIsLoadingComplete } from '../../../actions/AddVehicleActions';
import { MANUT_ATRAS_TRIGGER_TYPE } from '../../utils/Constants';

const maxAccordionSize = Dimensions.get('window').height / 3;

class FormComplete extends React.PureComponent {
    constructor(props) {
        super(props);

        this.renderItemManutProxPc = React.memo(this.renderItemManutProx);
        this.renderItemManutAtrasPc = React.memo(this.renderItemManutAtras);

        this.refAccordionProxManuts = React.createRef();
        this.refAccordionAtrasManuts = React.createRef();

        this.actionsRows = [];

        this.state = {
            isLoading: false,
            itemsProx: [],
            itemsAtras: []
        };
    }

    componentDidUpdate = (prevProps) => { 
        if (prevProps.isFetching !== this.props.isFetching) {
            this.fetchManuts();
        }
    }

    onChangeActionsRows = (index, action, itemIndexInRow) => {
        const findedIndex = _.findIndex(this.actionsRows, ita => (ita.index === index && ita.indexInRow === itemIndexInRow));
        const finded = findedIndex !== -1;

        if (finded) {
            this.actionsRows[findedIndex].action = action;
        } else {
            this.actionsRows.push({ 
                index, 
                action,
                manut: {
                    ...(this.state.itemsAtras[index][itemIndexInRow] || {})
                }
            });
        }

        this.props.modifyActionsRows(this.actionsRows);
    }

    fetchManuts = async () => {
        const {
            manufacturer,
            model,
            year,
            quilometers
        } = store.getState().AddVehicleReducer;

        this.actionsRows = [];
        this.props.modifyActionsRows([]);

        let proxData = [];
        let atrasData = [];

        if (!(manufacturer && model && year && quilometers)) {
            this.setState(
                { isLoading: false },
                () => this.props.modifyIsLoadingComplete(false)
            );
            return false;
        }

        if (this.refAccordionProxManuts.current) this.refAccordionProxManuts.current.openAccordion();
        if (this.refAccordionAtrasManuts.current) this.refAccordionAtrasManuts.current.openAccordion();

        this.setState({ isLoading: true });

        try {
            const funExec = async () => {
                const ret = await apiGetManut({
                    manufacturer,
                    model,
                    year,
                    quilometers,
                    type: 'all'
                });

                const validRed = ret.data && ret.data.success && ret.data.data;
        
                if (validRed && ret.data.data.prox) proxData = [...ret.data.data.prox];
                if (validRed && ret.data.data.atras) {
                    atrasData = [...ret.data.data.atras];
                    atrasData = _.groupBy(atrasData, 'itemabrev');
                    atrasData = _.orderBy(atrasData, (itd) => _.maxBy(itd, 'quilometros').quilometros, ['desc']);
                }
                
                for (let indexB = 0; indexB < atrasData.length; indexB++) {
                    const elementB = atrasData[indexB];

                    for (let indexC = 0; indexC < elementB.length; indexC++) {
                        const elementC = elementB[indexC];
                        
                        this.actionsRows.push({ 
                            index: indexB,
                            indexInRow: indexC,
                            action: MANUT_ATRAS_TRIGGER_TYPE.WARNING,
                            manut: {
                                ...elementC
                            }
                        });
                    }
                }

                this.props.modifyActionsRows(this.actionsRows);
        
                this.setState(
                    { isLoading: false, itemsProx: proxData, itemsAtras: atrasData },
                    () => this.props.modifyIsLoadingComplete(false)
                );
            };
    
            funExec();
        } catch (e) {
            this.setState(
                { isLoading: false },
                () => this.props.modifyIsLoadingComplete(false)
            );
        }
    }

    renderManutProx = () => {
        const { quilometers } = store.getState().AddVehicleReducer;

        if (this.state.isLoading || !this.props.isCurrentPage) {
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

        if (!quilometers) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Para visualizar as manutenções do veículo é necessario informar a quilometragem anteriormente.
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
        const { quilometers } = store.getState().AddVehicleReducer;

        if (this.state.isLoading || !this.props.isCurrentPage) {
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

        if (!quilometers) {
            return (
                <View
                    style={{ height: maxAccordionSize, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontWeight: '500' }} numberOfLines={6}>
                        Para visualizar as manutenções do veículo é necessario informar a quilometragem anteriormente.
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
                                <FormCompleteActionsRow itemIndex={index} itemIndexInRow={indexB} onChangeActionsRows={this.onChangeActionsRows} />
                            </View>
                        </View>
                    ))
                }
            </View>
        </DataTable.Row>
    ) 

    renderManager = () => this.renderScrollView()

    renderScrollView = () => (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
            <View style={{ flex: 1 }}>
                <CardAccordion
                    key={'manutproxformcomplete'}
                    ref={this.refAccordionProxManuts}
                    title={'Manutenções próximas'}
                    titleStyle={{ fontSize: normalize(14), fontFamily: 'OpenSans-SemiBold' }}
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
                    key={'manutproxatrasformcomplete'}
                    ref={this.refAccordionAtrasManuts}
                    title={'Manutenções atrasadas'}
                    titleStyle={{ fontSize: normalize(14), fontFamily: 'OpenSans-SemiBold' }}
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
    isFetching: state.AddVehicleReducer.isFetching
});

export default connect(mapStateToProps, {
    modifyActionsRows,
    modifyIsLoadingComplete
})(FormComplete);
