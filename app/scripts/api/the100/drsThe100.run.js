function run(InputMatcherService, The100Matcher) {
  'ngInject';

  const m = The100Matcher;
  InputMatcherService.addMatcherFn(m.name, m.description, m.testFn, m.runFn);
}

export default run;