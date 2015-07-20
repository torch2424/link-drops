'use strict';

describe('Service: Dumps', function () {

  // load the service's module
  beforeEach(module('linkDumpApp'));

  // instantiate service
  var Dumps;
  beforeEach(inject(function (_Dumps_) {
    Dumps = _Dumps_;
  }));

  it('should do something', function () {
    expect(!!Dumps).toBe(true);
  });

});
