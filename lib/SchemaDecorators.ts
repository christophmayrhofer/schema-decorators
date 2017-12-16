export interface Schema {
    identifier: Function
    schema ?: Function
    raw: object
}

export default abstract class SchemaDecorators {
    static schemas: Schema[] = []
    static schemaClass: Function

    static extendSchema(key: string, value: any) {
        return function(target: any, propertyKey: string) {
            let identifier = target.constructor
            let schema = SchemaDecorators.schemas.find((schema: Schema) => schema.identifier === identifier)
            if(!schema) {
                schema = {identifier, raw: {}}
                SchemaDecorators.schemas.push(schema)
            }
            schema.raw[propertyKey] = schema.raw[propertyKey] || {}
            schema.raw[propertyKey][key] = value
            if(SchemaDecorators.schemaClass) {
                schema.schema = SchemaDecorators.schemaClass.constructor(schema.raw)
            }
        }
    }

    static attachSchema(constructor: any, schema: Schema) {
        constructor.$schema = schema.schema
        constructor.$schemaRaw = schema.raw
    }

    static getSchema(constructor: Function) {
        let schema: Schema | undefined = SchemaDecorators.schemas.find(schema => schema.identifier === constructor)
        if(!schema) return undefined
        return schema.schema
    }

    static getRawSchema(constructor: Function) {
        let schema: Schema | undefined = SchemaDecorators.schemas.find(schema => schema.identifier === constructor)
        if(!schema) return undefined
        return schema.raw
    }
}
