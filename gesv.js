function Schema() { }

Schema.any = function () { return Schema.for(undefined); };

Schema.optional = function (aSchemaDescription) { return Schema.for(aSchemaDescription, { optional: true }) };

Schema.for = function (aSchemaDescription, { optional: aBoolean = false } = {}) {
  if (aSchemaDescription === Number) { return NumberSchema.optional(aBoolean) }
  if (aSchemaDescription === String) { return StringSchema.optional(aBoolean) }
  if (aSchemaDescription === Boolean) { return BooleanSchema.optional(aBoolean) }
  if (aSchemaDescription === undefined) { return AnySchema.optional(aBoolean) }
  if (Array.isArray(aSchemaDescription)) { return ArraySchema.optional(aBoolean).description(aSchemaDescription) }
  if (aSchemaDescription instanceof BaseSchema) { return aSchemaDescription }
  return ObjectSchema.optional(aBoolean).description(aSchemaDescription);
};

class BaseSchema {
  static optional(aBoolean = false) { return new this(aBoolean) }

  constructor(optional) { this._optional = optional }

  isValidFor(anObject) {
    if (this._optional && (anObject === undefined || anObject === null)) { return true }
    return anObject !== undefined && anObject !== null && this.additionalIsValidFor(anObject);
  }

  additionalIsValidFor(anObject) { return false }

  description(aSchemaDescription) { return this }
}

class NumberSchema extends BaseSchema {
  additionalIsValidFor(anObject) {
    return anObject.constructor === Number && !Number.isNaN(anObject);
  }
}

class StringSchema extends BaseSchema {
  additionalIsValidFor(anObject) {
    return anObject.constructor === String;
  }
}

class BooleanSchema extends BaseSchema {
  additionalIsValidFor(anObject) {
    return anObject.constructor === Boolean;
  }
}

class AnySchema extends BaseSchema {
  constructor() { super(true); }
  additionalIsValidFor() { return true; }
}

class ArraySchema extends BaseSchema {
  description(aSchemaDescription) {
    this._nestedSchema = Schema.for(aSchemaDescription[0]);
    return this;
  }

  additionalIsValidFor(anObject) {
    return Array.isArray(anObject) && anObject.every(el => this._nestedSchema.isValidFor(el));
  }
}

class ObjectSchema extends BaseSchema {
  description(aSchemaDescription) {
    this._nestedSchemas = {};
    Object.entries(aSchemaDescription).forEach(([key, singleDescription]) => {
      this._nestedSchemas[key] = Schema.for(singleDescription);
    });
    return this;
  }

  additionalIsValidFor(anObject) {
    return Object.entries(this._nestedSchemas).every(([key, schema]) => schema.isValidFor(anObject[key]));
  }
}

module.exports = Schema;
