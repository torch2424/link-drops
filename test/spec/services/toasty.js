'use strict';

describe('Service: Toasty', function () {

  // load the service's module
  beforeEach(module('linkDumpApp'));

  // instantiate service
  var Toasty;
  beforeEach(inject(function (_Toasty_) {
    Toasty = _Toasty_;
  }));

  it('should do something', function () {
    expect(!!Toasty).toBe(true);
  });

});
