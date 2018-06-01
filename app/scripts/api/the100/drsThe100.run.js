function run(InputMatcherService, InputMatcherD2Service, The100Matcher, The100D2Matcher) {
  'ngInject';

  const m = The100Matcher;
  InputMatcherService.addMatcherFn(m.name, m.description, m.testFn, m.runFn);

  const m2 = The100D2Matcher;
  InputMatcherD2Service.addMatcherFn(m2.name, m2.description, m2.testFn, m2.runFn);
}

export default run;