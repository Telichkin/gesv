var Schema = {
  any: function () { return Schema.for(undefined) },

  optional: function (aSchemaDescription) { return Schema.for(aSchemaDescription, true) },

  for: function (aSchemaDescription, optional) {
    if (aSchemaDescription === Number) { return NumberSchema(optional) }
    if (aSchemaDescription === String) { return StringSchema(optional) }
    if (aSchemaDescription === Boolean) { return BooleanSchema(optional) }
    if (aSchemaDescription === undefined) { return AnySchema(optional) }
    if (Array.isArray(aSchemaDescription)) { return ArraySchema(optional, aSchemaDescription) }
    if (aSchemaDescription.type === 'BaseSchema') { return aSchemaDescription }
    return ObjectSchema(optional, aSchemaDescription)
  }
}

function NumberSchema(optional) {
  return BaseSchema(optional, function (anObject) {
    return anObject.constructor === Number && !Number.isNaN(anObject)
  })
}

function StringSchema(optional) {
  return BaseSchema(optional, function (anObject) {
    return anObject.constructor === String
  })
}

function BooleanSchema(optional) {
  return BaseSchema(optional, function (anObject) {
    return anObject.constructor === Boolean
  })
}

function AnySchema() {
  return BaseSchema(true, function () { return true })
}

function ArraySchema(optional, aSchemaDescription) {
  var nestedSchema = Schema.for(aSchemaDescription[0])

  return BaseSchema(optional, function (anObject) {
    return Array.isArray(anObject) && anObject.every(function (el) { return nestedSchema.isValidFor(el) });
  })
}

function ObjectSchema(optional, aSchemaDescription) {
  var nestedSchemas = {}
  Object.entries(aSchemaDescription).forEach(function (keyValue) {
    nestedSchemas[keyValue[0]] = Schema.for(keyValue[1]);
  })

  return BaseSchema(optional, function (anObject) {
    return Object.entries(nestedSchemas).every(function (keyValue) {
      return keyValue[1].isValidFor(anObject[keyValue[0]])
    });
  })
}

function BaseSchema(optional, validation) {
  return {
    type: 'BaseSchema',
    isValidFor: function (anObject) {
      if (Boolean(optional) && (anObject === undefined || anObject === null)) { return true }
      return anObject !== undefined && anObject !== null && validation(anObject)
    }
  }
}

module.exports = Schema;