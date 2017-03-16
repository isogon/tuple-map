TupleMap
========

Have you ever wanted to store some value against a tuple? If yes, thos can help. If no, why are you even here?

I wanted to do this so I could easily cache differences between objects, so I did it. Hopefully someone else finds some use from it.

NB: Despite what I claim, this is not a map, but a trie/nested maps.

Usage
-----

```javascript
import TupleMap from '@isogon/tuple-map';

const tm = new TupleMap(3); // it takes the size of the tuple

const objTuple = [{}, {}, {}];

// `set` returns the instance so you can chain calls.
tm
  .set(objTuple, 1000000)
  .set([1, 2, 3], 4)

expect(tm.get(objTuple), 'retrieval works').equal(1000000);
expect(tm.get([{}, {}, {}]), 'follows standard map semantics').equal(undefined);

expect(tm.get([1, 2, 3]), 'primitives work as expected').equal(4);
```

Compatibility
-------------

It should work in any browser/runtime with native support for `Map` and `class`. (Recent browsers except Opera/IE, node >= 6).
