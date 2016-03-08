'use strict';

describe('Service: Embedder', function () {

  // load the service's module
  beforeEach(module('linkDumpApp'));

  // instantiate service
  var Embedder;
  beforeEach(inject(function (_Embedder_) {
    Embedder = _Embedder_;
  }));

  it('should do something', function () {
    expect(!!Embedder).toBe(true);
  });

});
