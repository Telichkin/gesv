# gesv

gesv (good enough schema validation) helps you to validate data types of any JavaScript object. It can 
be useful in validating of JSON-response from an API. 
gesp is extra-small (~250B minified and gzipped) and zero dependencies library.


## Installation

```
$ npm install --save gesv
```

## Features
- [simple API](#simple-api)
- [schema splitting](#schema-splitting)
- [custom validators](#custom-validators)
- zero dependencies
- extra-small size

## Usage

### Simple API
Usage of gesv is much more straightforward that usage of any 
JSON Schema library. All API and built-in validators are presented 
in the example below:

```js
const Schema = require('gesv')

Schema.for(Number).isValidFor(5)  // true
Schema.for(Number).isValidFor(NaN)  // false
Schema.for(String).isValidFor('Str')  // true
Schema.for(String).isValidFor('')  // true
Schema.for(Boolean).isValidFor(true)  // true

Schema.for(Schema.optional(Number)).isValidFor(undefined)  // true
Schema.for(Schema.optional(Number)).isValidFor(null)  // true 
Schema.for(Schema.optional(Number)).isValidFor(42)  // true

Schema.for([ Boolean ]).isValidFor([ true, false ])  // true
Schema.for([ String ]).isValidFor([])  // true
Schema.for([ Number ]).isValidFor([ 1, 2, true ])  // false
Schema.for([ Schema.any() ]).isValidFor([ null, undefined, 42, 'foo', [], {} ])  // true

Schema.for({
  id: Number,
  name: String,
  comments: [{
    id: Number,
    text: String,
  }]
}).isValidFor({
  id: 42,
  name: 'Doge',
  comments: [{
    id: 24,
    text: 'Wow!'
  }, {
    id: 25,
    text: 'Such validation!'
  }]
})  // true
```

### Schema splitting

With gesv you can also split your schema in separate reusable parts:
```js
const Schema = require('gesv')

const commentSchema = Schema.for({
  id: Number,
  text: String,
})

const postSchema = Schema.for({
  id: Number,
  name: String,
  comments: [ commentSchema ]
})

postSchema.isValidFor({
  id: 42,
  comments: [{
    id: 24,
    text: 'Such validation!'
  }]
})  // false

postSchema.isValidFor({
  id: 42,
  name: 'Name',
  comments: [{
    id: 24,
    text: 'Such validation!'
  }]
})  // true
```

### Custom validators

If built-in validators can not solve your specific problem,
you can write your own custom validators:

```js
const Schema = require('gesv')

const gender = anObject => [ 'male', 'female' ].includes(anObject)

const userSchema = Schema.for({
  id: Number,
  gender: gender,
  age: Schema.optional(Number),
})

userSchema.isValidFor({
  id: 10,
  gender: 'male',
})  // true

userSchema.isValidFor({
  id: 11,
  gender: 'bar',
  age: 43,
})  // false
```
