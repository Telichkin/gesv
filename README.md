# gesv

gesv (good enough schema validation) helps you to validate data types of any JavaScript object. It can 
be useful in validating of JSON-response from an API. 
gesp is extra-small (~250B minified and gzipped) and zero dependencies library.


## Installation

```
$ npm install --save gesv
```

## Usage

Usage of gesv is much more simpler that usage of any JSON Schema library.

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
    text: 'Such validation!'
  }]
})  // true
```

You also can split your schema:
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