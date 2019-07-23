/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { DataTable } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import { FlatList } from 'react-native-gesture-handler';

import { store } from '../../../App';
import CardAccordion from '../../tools/CardAccordion';
import DataTableCell from '../../tools/DataTableCell';
import { apiGetManut } from '../../utils/api/ApiManagerConsumer';

class FormComplete extends React.PureComponent {
    constructor(props) {
        super(props);

        this.renderItemManutProxPc = React.memo(this.renderItemManutProx);
        this.renderItemManutAtrasPc = React.memo(this.renderItemManutAtras);

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

    fetchManuts = async () => {
        const {
            manufacturer,
            model,
            year,
            quilometers
        } = store.getState().AddVehicleReducer;

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
                data={this.state.itemsProx}
                renderItem={(propsItem) => <this.renderItemManutProxPc {...propsItem} />}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews
            />
        </View>
    )

    renderItemManutProx = ({ item, index }) => (
        <DataTable.Row key={index}>
            <DataTableCell numberOfLines={6}>{item.itemabrev}</DataTableCell>
            <DataTableCell numberOfLines={6} numeric>{item.quilometros}</DataTableCell>
        </DataTable.Row>
    ) 

    renderManutAtras = () => (
        <View
            style={{ height: 200 }}
        >
            <FlatList
                data={this.state.itemsAtras}
                renderItem={(propsItem) => <this.renderItemManutAtrasPc {...propsItem} />}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews
            />
        </View>
    )

    renderItemManutAtras = ({ item, index }) => (
        <DataTable.Row key={index}>
            <DataTableCell numberOfLines={6}>{item.itemabrev}</DataTableCell>
            <DataTableCell numberOfLines={6} numeric>{item.quilometros}</DataTableCell>
        </DataTable.Row>
    ) 

    renderManager = () => {
        const { isLoading, itemsProx, itemsAtras } = this.state;
        if (isLoading) return this.renderLoading();
        if (!(itemsProx.length && itemsAtras.length)) return <View />;

        return this.renderScrollView();
    }

    renderScrollView = () => (
        <ScrollView>
            <View style={{ flex: 1 }}>
                <CardAccordion
                    title={'Manutenções próximas'}
                    titleStyle={{ fontSize: 16 }}
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
                            <DataTable.Title>Manutenção</DataTable.Title>
                            <DataTable.Title numeric>Km</DataTable.Title>
                        </DataTable.Header>
                        {this.renderManutProx()}
                    </DataTable>
                </CardAccordion>
                <CardAccordion
                    title={'Manutenções atrasadas'}
                    titleStyle={{ fontSize: 16 }}
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
                            <DataTable.Title>Manutenção</DataTable.Title>
                            <DataTable.Title numeric>Km</DataTable.Title>
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

})(FormComplete);
