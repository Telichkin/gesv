const Schema = require('./gesv');

const schema = (aSchemaDescription) => ({
  validArray: [],
  invalidArray: [],
  isValidFor(aValidArray) {
    this.validArray = aValidArray
    return this
  },
  isInvalidFor(anInvalidArray) {
    this.invalidArray = anInvalidArray
    return this
  },
  test(aName = '') {
    const s = Schema.for(aSchemaDescription)
    this.validArray.forEach(v => test(aName + ' ' + String(v), () => expect(s.isValidFor(v)).toBeTruthy()))
    this.invalidArray.forEach(inv => test(aName + ' ' + String(inv), () => expect(s.isValidFor(inv)).toBeFalsy()))
  }
});

describe('All tests', () => {
  schema(Number)
    .isValidFor([0, 1, 24, 999])
    .isInvalidFor(['5', NaN, {}, [], undefined, true, false, null])
    .test('Number')

  schema(String)
    .isValidFor(['', 'Wow', 'So Cool!?'])
    .isInvalidFor([0, 5, NaN, {}, [], undefined, true, false, null])
    .test('String')

  schema(Boolean)
    .isValidFor([true, false])
    .isInvalidFor([0, 1, 'true', 'false', NaN, undefined, {}, [], null])
    .test('Boolean')

  schema(Schema.optional(Number))
    .isValidFor([0, 1, 24, 999, undefined, null])
    .isInvalidFor(['5', NaN, {}, [], true, false])
    .test('Optional Number')

  schema(Schema.optional(String))
    .isValidFor([undefined, null, '', 'String'])
    .isInvalidFor([0, 5, NaN, {}, [], true, false])
    .test('Optional String');

  schema(Schema.optional(Boolean))
    .isValidFor([true, false, null, undefined])
    .isInvalidFor([0, 1, 'true', 'false', NaN, {}, []])
    .test('Optional Boolean')

  schema(Schema.any())
    .isValidFor([null, undefined, true, false, NaN, 'String', 178, {}, []])
    .test('Any')

  schema([Number])
    .isValidFor([[1], [0, 9, 100, 999]])
    .isInvalidFor(['0'], [NaN], [undefined], [null], [true], [false], [{}], [[]])
    .test('Array with Number')

  schema([String])
    .isValidFor([[''], ['Foo', 'Bar']])
    .isInvalidFor([0], [1], [NaN], [undefined], [null], [true], [false], [{}], [[]])
    .test('Array with String')

  schema([Boolean])
    .isValidFor([[true], [false], [true, false]])
    .isInvalidFor([null, undefined, NaN, 0, 1, true, false, 'String', {}])
    .test('Array with Boolean')

  schema([Schema.any()])
    .isValidFor([[null, undefined, NaN, 0, 1, true, false, 'String', [], {}]])
    .test('Array with Any')

  schema({ foo: String })
    .isValidFor([{ foo: '' }, { foo: 'bar' }, { foo: 'bar', wow: 'such' }])
    .isInvalidFor([{ foo: null }, {}, { foo: 0 }, { foo: NaN }, { foo: true }])
    .test('Object with String')

  schema({
    string: String,
    number: Number,
    boolean: Boolean,
    array: [ Boolean ],
    optionalNumber: Schema.optional(Number),
    object: {
      object: {
        string: String
      }
    }
  }).isValidFor([{
    string: 'Some String',
    number: 42,
    boolean: false,
    array: [ true ],
    object: {
      object: {
        string: 'Nested Object'
      }
    }
  }])
    .test('Nested Object')
});
