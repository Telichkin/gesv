function Schema(validator, optional) {
  this._validate = validator || function () { return false }
  this._optional = Boolean(optional)
}

Schema.any = function () { return Schema.optional(any) }

Schema.optional = function (schemaDescription) { return Schema.for(schemaDescription, true) }

Schema.for = function (schemaDescription, optional) {
  if (schemaDescription === Number) { return Schema.for(number, optional) }
  if (schemaDescription === String) { return Schema.for(string, optional) }
  if (schemaDescription === Boolean) { return Schema.for(boolean, optional) }
  if (Array.isArray(schemaDescription)) { return Schema.for(array(schemaDescription), optional) }
  if (typeof schemaDescription === 'function') { return new Schema(schemaDescription, optional) }
  if (schemaDescription.constructor === Schema) { return schemaDescription }
  return Schema.for(object(schemaDescription), optional)
}

Schema.prototype.isValidFor = function (anObject) {
  if (this._optional && (anObject === undefined || anObject === null)) { return true }
  return anObject !== undefined && anObject !== null && this._validate(anObject)
}

function number(anObject) { return anObject.constructor === Number && !Number.isNaN(anObject) }

function string(anObject) { return anObject.constructor === String }

function boolean(anObject) { return anObject.constructor === Boolean }

function any() { return true }

function array(aSchemaDescription) {
  var nestedSchema = Schema.for(aSchemaDescription[0])

  return function (anObject) {
    return Array.isArray(anObject) && anObject.every(function (el) { return nestedSchema.isValidFor(el) });
  }
}

function object(aSchemaDescription) {
  var nestedSchemas = {}
  Object.entries(aSchemaDescription).forEach(function (keyValue) {
    nestedSchemas[keyValue[0]] = Schema.for(keyValue[1]);
  })

  return function (anObject) {
    return Object.entries(nestedSchemas).every(function (keyValue) {
      return keyValue[1].isValidFor(anObject[keyValue[0]])
    });
  }
}

module.exports = Schema;
