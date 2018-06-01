function InputMatcherD2Service() {
  const matcherFns = [];
  const service = {
    addMatcherFn: addMatcherFn,
    getMatcherFns: getMatcherFns
  };
  return service;

  function addMatcherFn(name, description, testFn, runFn) {
    matcherFns.push({ name: name, description: description, testFn: testFn, runFn: runFn });
  }

  function getMatcherFns() {
    return matcherFns;
  }
}

export default InputMatcherD2Service;