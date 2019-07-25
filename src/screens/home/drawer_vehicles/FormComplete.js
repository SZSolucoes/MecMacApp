/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { DataTable } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import { FlatList } from 'react-native-gesture-handler';
import { TextMask } from 'react-native-masked-text';
import _ from 'lodash';

import { store } from '../../../App';
import CardAccordion from '../../tools/CardAccordion';
import DataTableCell from '../../tools/DataTableCell';
import { apiGetManut } from '../../utils/api/ApiManagerConsumer';
import { normalize } from '../../utils/StringTextFormats';
import FormCompleteActionsRow from './FormCompleteActionsRow';
import DataTableTitleHeader from '../../tools/DataTableTitleHeader';
import { modifyActionsRows } from '../../../actions/AddVehicleActions';
import { MANUT_ATRAS_TRIGGER_TYPE } from '../../utils/Constants';

class FormComplete extends React.PureComponent {
    constructor(props) {
        super(props);

        this.renderItemManutProxPc = React.memo(this.renderItemManutProx);
        this.renderItemManutAtrasPc = React.memo(this.renderItemManutAtras);

        this.actionsRows = [];

        this.state = {
            isLoading: false,
            itemsProx: [],
            itemsAtras: []
        };
    }

    componentDidMount = () => this.fetchManuts()

    componentDidUpdate = (prevProps) => {
        /* if (prevProps.isFetching !== this.props.isFetching) {
            this.fetchManuts();
        } */
    }

    fetchManuts = async () => {
        /* const {
            manufacturer,
            model,
            year,
            quilometers
        } = store.getState().AddVehicleReducer; */

        const manufacturer = 'Fiat';
        const model = 'ARGO DRIVE 1.0 6V Flex';
        const year = '2019';
        const quilometers = '11000';

        let proxData = [];
        let atrasData = [];

        if (!(manufacturer && model && year && quilometers)) {
            this.setState({ isLoading: false });
            return false;
        }

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
                if (validRed && ret.data.data.atras) atrasData = [...ret.data.data.atras];
        
                this.setState({ isLoading: false, itemsProx: proxData, itemsAtras: atrasData });
            };
    
            funExec();
        } catch (e) {
            this.setState({ isLoading: false });
        }
    }

    onChangeActionsRows = (index, action) => {
        const findedIndex = _.findIndex(this.actionsRows, ita => ita.index === index);
        const finded = findedIndex !== -1;

        if (finded && action === MANUT_ATRAS_TRIGGER_TYPE.WARNING) {
            this.actionsRows.splice(findedIndex, 1);
        } else if (finded && action !== MANUT_ATRAS_TRIGGER_TYPE.WARNING) {
            this.actionsRows[findedIndex].action = action;
        } else if (!finded && action !== MANUT_ATRAS_TRIGGER_TYPE.WARNING) {
            this.actionsRows.push({ index, action });
        }

        this.props.modifyActionsRows(this.actionsRows);
    }

    renderLoading = () => (
        <View
            style={{
                height: '90%',
                width: '100%'
            }}
        >
            <AwesomeAlert
                show
                showProgress
                title={'Carregando...'}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
            />
        </View>
    )

    renderManutProx = () => (
        <View
            style={{ height: 200 }}
        >
            <FlatList
                bounces={false}
                data={this.state.itemsProx}
                renderItem={(propsItem) => <this.renderItemManutProxPc {...propsItem} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )

    renderItemManutProx = ({ item, index }) => (
        <DataTable.Row key={index}>
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

    renderManutAtras = () => (
        <View
            style={{ height: 200 }}
        >
            <FlatList
                bounces={false}
                data={this.state.itemsAtras}
                renderItem={(propsItem) => <this.renderItemManutAtrasPc {...propsItem} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )

    renderItemManutAtras = ({ item, index }) => (
        <DataTable.Row key={index}>
            <DataTableCell numberOfLines={6} style={{ flex: 1.5 }}>{item.itemabrev}</DataTableCell>
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
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <FormCompleteActionsRow itemIndex={index} onChangeActionsRows={this.onChangeActionsRows} />
            </View>
        </DataTable.Row>
    ) 

    renderManager = () => {
        const { isLoading, itemsProx, itemsAtras } = this.state;
        if (isLoading) return this.renderLoading();
        if (!(itemsProx.length && itemsAtras.length)) return <View />;

        return this.renderScrollView();
    }

    renderScrollView = () => (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
            <View style={{ flex: 1 }}>
                <CardAccordion
                    title={'Manutenções próximas'}
                    titleStyle={{ fontSize: normalize(16) }}
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
                    title={'Manutenções atrasadas'}
                    titleStyle={{ fontSize: normalize(16) }}
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
        <View styles={styles.mainView}>
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
    modifyActionsRows
})(FormComplete);
