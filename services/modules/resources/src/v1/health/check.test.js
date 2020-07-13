import { expect } from 'chai';
import { run } from './check';

describe('function/health/check', () => {
  it('return success', done => {
    const success = {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        data: {},
      }),
    };
    run({}, {}, (err, data) => {
      expect(err).to.be.null;
      expect(data).to.deep.equal(success);
      done();
    });
  });
});
