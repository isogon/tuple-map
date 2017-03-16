const TupleMap = require('..');

const { expect } = require('chai');

describe('TupleMap', () => {
  it('can run the example code', () => {
    const tm = new TupleMap(3); // it takes the size of the tuple

    const objTuple = [{}, {}, {}];

    // `set` returns the instance so you can chain calls.
    tm
      .set(objTuple, 1000000)
      .set([1, 2, 3], 4);

    expect(tm.get(objTuple), 'retrieval works').equal(1000000);
    expect(tm.get([{}, {}, {}]), 'follows standard map semantics').equal(undefined);

    expect(tm.get([1, 2, 3]), 'primitives work as expected').equal(4);
  });

  describe('stores values against a tuple you can later retrieve', () => {
    it('works for 1-tuples', () => {
      const tm = new TupleMap(1);
      const o1 = {};
      const o2 = {};
      const value = Math.random();

      tm.set([o1], value);

      expect(tm.get([o1]), 'value retrieval works').to.equal(value);
      expect(tm.get([o2]), 'value retrieval is not broken').not.to.equal(value);
    });

    it('works for 3-tuples', () => {
      const tm = new TupleMap(3);
      const o1 = {};
      const o2 = {};
      const o3 = {};
      const o4 = {};
      const value = Math.random();

      tm.set([o1, o2, o3], value);

      expect(tm.get([o1, o2, o3]), 'value retrieval works').to.equal(value);
      expect(tm.get([o1, o2, o4]), 'value retrieval is not broken').not.to.equal(value);
      expect(tm.get([o4, o2, o3]), 'value retrieval is not broken').not.to.equal(value);
      expect(tm.get([o1, o4, o3]), 'value retrieval is not broken').not.to.equal(value);
    });
  });

  describe('#set', () => {
    it('returns the instance to allow chaining', () => {
      const tm = new TupleMap(1);
      expect(tm.set([1], 1)).equal(tm);
    });
  });

  describe('.setIn', () => {
    let map;
    let value;

    beforeEach(() => {
      map = new Map();
      value = Math.random();
    });

    describe('for 1-tuples', () => {
      let key;

      beforeEach(() => {
        map = new Map();
        key = Math.random();
      });

      it('stores the value in the map', () => {
        TupleMap.setIn([key], map, value);
        expect(map.get(key)).to.equal(value);
      });

      it('updates the value in the map if it already exists', () => {
        map.set(key, Math.random());
        TupleMap.setIn([key], map, value);
        expect(map.get(key)).to.equal(value);
      });

      it('returns the map it added the value to', () => {
        expect(TupleMap.setIn([key], map, value)).to.equal(map);
      });
    });

    describe('for 3-tuples', () => {
      let keys;

      beforeEach(() => {
        keys = [Math.random(), Math.random(), Math.random()];
      });

      it('creates the full tree if it does not exist', () => {
        TupleMap.setIn(keys, map, value);

        const l1 = map.get(keys[0]);
        expect(l1).instanceof(Map);

        const l2 = l1.get(keys[1]);
        expect(l2).instanceof(Map);

        const l3 = l2.get(keys[2]);
        expect(l3).to.equal(value);
      });

      it('returns the modified map', () => {
        expect(TupleMap.setIn(keys, map, value)).equal(map);
      });
    });
  });

  describe('.getIn', () => {
    describe('for 1-tuples', () => {
      const existingKey = Math.random();
      const existingValue = Math.random();
      const layers = new Map();
      layers.set(existingKey, existingValue);

      it('returns undefined when there is no value for the key', () => {
        expect(TupleMap.getIn([Math.random()], layers)).equal(undefined);
      });

      it('returns a value when it exists', () => {
        expect(TupleMap.getIn([existingKey], layers)).equal(existingValue);
      });
    });

    describe('for 3-tuples', () => {
      const existingValue = Math.random();
      const existingTuple = [Math.random(), Math.random(), Math.random()];
      const layers = new Map();

      const l2 = new Map();
      layers.set(existingTuple[0], l2);

      const l3 = new Map();
      l2.set(existingTuple[1], l3);

      l3.set(existingTuple[2], existingValue);

      it('returns a value when it exists', () => {
        expect(TupleMap.getIn(existingTuple, layers)).equal(existingValue);
      });

      it('returns undefined when there is no value at the first layer', () => {
        const nxTuple = [...existingTuple];
        nxTuple.splice(0, 1, Math.random());

        expect(TupleMap.getIn(nxTuple, layers)).equal(undefined);
      });

      it('returns undefined when there is no value at the second layer', () => {
        const nxTuple = [...existingTuple];
        nxTuple.splice(1, 1, Math.random());

        expect(TupleMap.getIn(nxTuple, layers)).equal(undefined);
      });

      it('returns undefined when there is no value at the final layer', () => {
        const nxTuple = [...existingTuple];
        nxTuple.splice(2, 1, Math.random());

        expect(TupleMap.getIn(nxTuple, layers)).equal(undefined);
      });
    });
  });
});
