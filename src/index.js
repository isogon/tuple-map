export default class TupleMap {
  constructor(depth = 2) {
    this.depth = depth;
    this.internalMap = new Map();
  }
  set(tuple, value) {
    if (tuple.length !== this.depth) {
      throw new Error(`invalid path of depth ${tuple.length}`);
    }

    TupleMap.setIn(tuple, this.internalMap, value);
    return this;
  }
  get(tuple) {
    if (tuple.length !== this.depth) {
      throw new Error(`invalid path of depth ${tuple.length}`);
    }

    return TupleMap.getIn(tuple, this.internalMap);
  }
  static getIn([current, ...deeper], layer) {
    const next = layer.get(current);

    if (deeper.length === 0) {
      return next;
    }

    if (!next) {
      return undefined;
    }

    return TupleMap.getIn(deeper, next);
  }
  static setIn([current, ...deeper], layer, value) {
    if (deeper.length === 0) {
      return layer.set(current, value);
    }

    const next = layer.get(current) || new Map();
    return layer.set(current, TupleMap.setIn(deeper, next, value));
  }
}
