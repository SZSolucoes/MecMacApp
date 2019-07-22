/* eslint-disable max-len */
export const CarSchema = {
    name: 'Car',
    properties: {
        Label: 'string?',
        Value: 'string?'
    }
};

export const MotorbikeSchema = {
    name: 'Motorbike',
    properties: {
        Label: 'string?',
        Value: 'string?'
    }
};

export const TruckSchema = {
    name: 'Truck',
    properties: {
        Label: 'string?',
        Value: 'string?'
    }
};

export const ModelosSchema = {
    name: 'Modelos',
    properties: {
        Label: 'string?',
        Value: 'int?'
    }
};

export const AnosModeloSchema = {
    name: 'AnosModelo',
    properties: {
        Label: 'string?',
        Value: 'string?'
    }
};

export const FipeModeloSchema = {
    name: 'FipeModelo',
    properties: {
        fipeVHCType: 'int?',
        marcaLabel: 'string?',
        marcaValue: 'string?',
        marcaModelos: 'Modelos[]'
    }
};

export const FipeAnosModeloSchema = {
    name: 'FipeAnosModelo',
    properties: {
        fipeVHCType: 'int?',
        marcaLabel: 'string?',
        marcaValue: 'string?',
        modeloLabel: 'string?',
        modeloValue: 'int?',
        anosModelo: 'AnosModelo[]'
    }
};

export const FipeMarcasSchema = {
    name: 'FipeMarcas',
    properties: {
        carros: 'Car[]',
        motos: 'Motorbike[]',
        caminhoes: 'Truck[]'
    }
};

export const FipeModelosSchema = {
    name: 'FipeModelos',
    properties: {
        fipeModelos: 'FipeModelo[]'
    }
};

export const FipeAnosModelosSchema = {
    name: 'FipeAnosModelos',
    properties: {
        fipeAnoModelo: 'FipeAnosModelo[]'
    }
};

export const FipeFileVersionSchema = {
    name: 'FipeFileVersion',
    properties: {
        fileVersion: 'int?'
    }
};

export const AllSchemasArray = [
    CarSchema, 
    MotorbikeSchema, 
    TruckSchema, 
    ModelosSchema, 
    FipeModeloSchema, 
    FipeMarcasSchema, 
    FipeModelosSchema, 
    FipeFileVersionSchema,
    AnosModeloSchema,
    FipeAnosModeloSchema,
    FipeAnosModelosSchema
];
