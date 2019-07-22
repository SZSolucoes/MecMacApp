/* eslint-disable max-len */
import Realm from 'realm';
import { apiGetManufacturesAndModels } from '../screens/utils/api/ApiManagerConsumer';
import { AllSchemasArray } from './RealmSchemas';

export const realmAllSchemesInstance = new Realm({
    schema: AllSchemasArray,
    schemaVersion: 1,
    deleteRealmIfMigrationNeeded: true
});

export const realmFetchsInit = async () => {
    try {
        const schemaFipeFileVersionObjs = realmAllSchemesInstance.objects('FipeFileVersion');
        const fileVersionObj = schemaFipeFileVersionObjs && schemaFipeFileVersionObjs.length 
        && schemaFipeFileVersionObjs[0].fileVersion ? schemaFipeFileVersionObjs[0].fileVersion : 0;

        const retManufacturesAndModels = await apiGetManufacturesAndModels({ fileVersion: fileVersionObj });

        const isValid = retManufacturesAndModels && retManufacturesAndModels.data && retManufacturesAndModels.data.success;

        if (isValid) {
            const { fipeMarcas, fipeModelos, fipeAnoModelo, fileVersion } = retManufacturesAndModels.data.data;
            if (fipeMarcas && fipeModelos && fipeAnoModelo) {
                    realmAllSchemesInstance.write(() => {
                        realmAllSchemesInstance.create('FipeMarcas', fipeMarcas, true);
                        realmAllSchemesInstance.create('FipeModelos', { fipeModelos }, true);
                        realmAllSchemesInstance.create('FipeAnosModelos', { fipeAnoModelo }, true);
                        realmAllSchemesInstance.create('FipeFileVersion', { fileVersion }, true);
                    });
            } else {
                console.log('Falha ao receber dados');
            }
        }
    } catch (e) {
        console.log(e);
    }
};

