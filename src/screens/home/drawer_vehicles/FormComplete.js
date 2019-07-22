/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { DataTable } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';

import { store } from '../../../App';
import CardAccordion from '../../tools/CardAccordion';
import DataTableCell from '../../tools/DataTableCell';
import { apiGetManut } from '../../utils/api/ApiManagerConsumer';

class FormComplete extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.isFetching !== this.props.isFetching) {
            //this.fetchManuts();
        }
    }

    fetchManuts = async () => {
        const {
            manufacturer,
            model,
            year,
            quilometers
        } = store.getState().AddVehicleReducer;

        if (!(manufacturer && model && year && quilometers)) return false;

        this.setState({ isLoading: true });

        const retProx = await apiGetManut({
            manufacturer,
            model,
            year,
            quilometers,
            type: 'prox'
        });

        const retAtras = await apiGetManut({
            manufacturer,
            model,
            year,
            quilometers,
            type: 'atras'
        });
    }

    renderLoading = () => (
        <View
            style={{
                backgroundColor: 'blue',
                height: '100%',
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
                            <DataTable.Title>Dessert</DataTable.Title>
                            <DataTable.Title numeric>Calories</DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row>
                            <DataTableCell numberOfLines={2}>Frozen yogurt</DataTableCell>
                            <DataTableCell numberOfLines={2} numeric>159</DataTableCell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTableCell numberOfLines={3}>Ice cream sandwichhhhhhhhhhhdsddddddddd</DataTableCell>
                            <DataTableCell numberOfLines={3} numeric>237</DataTableCell>
                        </DataTable.Row>
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
                            <DataTable.Title>Dessert</DataTable.Title>
                            <DataTable.Title numeric>Calories</DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row>
                            <DataTableCell numberOfLines={2}>Frozen yogurt</DataTableCell>
                            <DataTableCell numberOfLines={2} numeric>159</DataTableCell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTableCell numberOfLines={3}>Ice cream sandwichhhhhhhhhhhdsddddddddd</DataTableCell>
                            <DataTableCell numberOfLines={3} numeric>237</DataTableCell>
                        </DataTable.Row>
                    </DataTable>
                </CardAccordion>
            </View>
            <View style={{ marginVertical: 100 }} />
        </ScrollView>
    )

    render = () => (
        <View styles={styles.mainView}>
            {this.renderLoading()}
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
