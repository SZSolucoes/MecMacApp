/* eslint-disable max-len */
import Realm from 'realm';
import { apiGetManufacturesAndModels } from '../screens/utils/api/ApiManagerConsumer';
import { AllSchemasArray } from './RealmSchemas';

export const realmFetchsInit = async () => {
    try {
        const realmInstance = new Realm({
            schema: AllSchemasArray,
            schemaVersion: 1,
            deleteRealmIfMigrationNeeded: true
        });

        const schemaFipeFileVersionObjs = realmInstance.objects('FipeFileVersion');
        const fileVersionObj = schemaFipeFileVersionObjs && schemaFipeFileVersionObjs.length 
        && schemaFipeFileVersionObjs[0].fileVersion ? schemaFipeFileVersionObjs[0].fileVersion : 0;

        const retManufacturesAndModels = await apiGetManufacturesAndModels({ fileVersion: fileVersionObj });
        const isValid = retManufacturesAndModels && retManufacturesAndModels.data && retManufacturesAndModels.data.success;

        if (isValid) {
            const { fipeMarcas, fipeModelos, fileVersion } = retManufacturesAndModels.data.data;
            if (fipeMarcas && fipeModelos) {
                    realmInstance.write(() => {
                        realmInstance.create('FipeMarcas', fipeMarcas, true);
                        realmInstance.create('FipeModelos', { fipeModelos }, true);
                        realmInstance.create('FipeFileVersion', { fileVersion }, true);
                    });
            } else {
                console.log('Falha ao receber dados');
            }
        }
        
        realmInstance.close();
    } catch (e) {
        console.log(e);
    }
};

