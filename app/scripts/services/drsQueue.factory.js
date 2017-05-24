// a copied and modified DIM's ActionQueue
function QueueService($q) {
  'ngInject';

  const _queue = [];
  const service = {
    enqueue: enqueue,
    wrap: wrap
  };
  return service;

  // fn is either a blocking function or a function that returns a promise
  function enqueue(fn) {
    let promise = (_queue.length) ? _queue[_queue.length - 1] : $q.when();
    // Execute fn regardless of the result of the existing promise. We
    // don't use finally here because finally can't modify the return value.
    promise = promise.then(function() {
      return fn();
    }, function() {
      return fn();
    }).finally(function() {
      _queue.shift();
    });
    _queue.push(promise);
    return promise;
  }

  // Wrap a function to produce a function that will be queued
  function wrap(fn, context) {
    const self = this;
    return function(...args) {
      return self.enqueue(function() {
        return fn.apply(context, args);
      });
    };
  }
}

export default QueueService;