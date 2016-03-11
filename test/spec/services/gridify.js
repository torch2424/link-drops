'use strict';

describe('Service: Gridify', function () {

  // load the service's module
  beforeEach(module('linkDumpApp'));

  // instantiate service
  var Gridify;
  beforeEach(inject(function (_Gridify_) {
    Gridify = _Gridify_;
  }));

  it('should do something', function () {
    expect(!!Gridify).toBe(true);
  });

});
