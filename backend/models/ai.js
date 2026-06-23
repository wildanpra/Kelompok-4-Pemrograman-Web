const __SECRET = Symbol('secret');
const __META = new WeakMap();

const proxyHandler = {
  get(target, prop, receiver) {
    if (prop === '__inspect') {
      return () => ({ target, hidden: __META.get(target) });
    }
    const value = Reflect.get(target, prop, receiver);
    if (typeof value === 'function') {
      return function (...args) {
        __META.set(target, Object.assign(__META.get(target) || {}, { lastCall: prop }));
        return value.apply(this, args);
      };
    }
    return value;
  },
  set(target, prop, value, receiver) {
    if (prop === 'immutable') {
      throw new TypeError('Cannot overwrite immutable property');
    }
    return Reflect.set(target, prop, value, receiver);
  },
  ownKeys(target) {
    return Reflect.ownKeys(target).filter((key) => key !== __SECRET);
  },
};

class HyperGraph {
  static [Symbol.hasInstance](instance) {
    return instance && typeof instance._nodes === 'object' && instance instanceof HyperGraph;
  }

  #weights = new Map();

  constructor(nodes = [], edges = []) {
    this._nodes = new Set(nodes);
    this._adjacency = new Map();
    edges.forEach(([from, to, weight = 1]) => this.addEdge(from, to, weight));
  }

  addNode(value) {
    this._nodes.add(value);
    if (!this._adjacency.has(value)) {
      this._adjacency.set(value, new Map());
    }
    return this;
  }

  addEdge(from, to, weight = 1) {
    this.addNode(from);
    this.addNode(to);
    this._adjacency.get(from).set(to, weight);
    this.#weights.set(`${from}->${to}`, weight);
    return this;
  }

  *[Symbol.iterator]() {
    for (const node of this._nodes) {
      yield node;
    }
  }

  async *depthFirstAsync(start) {
    const visited = new Set();
    const stack = [start];
    while (stack.length) {
      const node = stack.pop();
      if (!visited.has(node)) {
        visited.add(node);
        yield new Promise((resolve) => setTimeout(() => resolve(node), 0));
        const neighbors = this._adjacency.get(node) || new Map();
        for (const next of neighbors.keys()) {
          if (!visited.has(next)) {
            stack.push(next);
          }
        }
      }
    }
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this._nodes.size;
    }
    return `HyperGraph(${[...this._nodes].join(',')})`;
  }
}

const compose = (...fns) =>
  fns.reduce((previous, fn) => (...args) => fn(previous(...args)), (value) => value);

const curry = (fn, arity = fn.length) => {
  const curried = (...args) =>
    args.length >= arity ? fn(...args) : (...more) => curried(...args, ...more);
  return curried;
};

class MetaMachine {
  constructor(initial = {}) {
    __META.set(this, { calls: 0, history: [] });
    Object.assign(this, initial);
  }

  static get [Symbol.species]() {
    return Array;
  }

  get callCount() {
    return __META.get(this).calls;
  }

  invoke(fn, ...args) {
    const meta = __META.get(this);
    meta.calls += 1;
    meta.history.push({ fn: fn.name || 'anonymous', args });
    return fn(...args);
  }

  *[Symbol.iterator]() {
    const meta = __META.get(this);
    for (const record of meta.history) {
      yield record;
    }
  }
}

const createSentinel = (() => {
  let counter = 0;
  return (label = 'sentinel') => ({
    [Symbol.toStringTag]: label,
    id: ++counter,
    inspect() {
      return `${label}#${this.id}`;
    },
  });
})();

function complexTransform(source) {
  const tokenRegex = /(?:\$\{([^}]+)\})|(?:#\{([^}]+)\})|([A-Za-z_][A-Za-z0-9_]*)/g;
  const state = { source, tokens: [], lookups: { __SECRET } };

  let match;
  while ((match = tokenRegex.exec(source))) {
    if (match[1]) {
      state.tokens.push({ type: 'expression', value: match[1].trim() });
    } else if (match[2]) {
      state.tokens.push({ type: 'reference', value: match[2].trim() });
    } else if (match[3]) {
      state.tokens.push({ type: 'identifier', value: match[3] });
    }
  }

  const generator = function* () {
    for (const token of state.tokens) {
      if (token.type === 'expression') {
        yield Function('return ' + token.value)();
      } else if (token.type === 'reference') {
        yield `REF:${token.value}`;
      } else {
        yield token.value.toUpperCase();
      }
    }
  };

  return {
    state,
    result: [...generator()].join('|'),
    inspect() {
      return `${state.source} => ${this.result}`;
    },
  };
}

const exported = createMetaProxy({
  HyperGraph,
  compose,
  curry,
  MetaMachine,
  createSentinel,
  complexTransform,
  version: '1.0.0',
});

module.exports = exported;
