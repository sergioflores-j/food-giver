/* eslint-disable no-template-curly-in-string */
import { expect } from 'chai';
import YAML from 'yamljs';

// TODO: implementar o teste final após acertar todas as configurações do serverless.yml 

describe('config/yml/serverles.yml', () => {
  const DEFAULT_SERVICE = 'food-giver-auth';
  const DEFAULT_PROVIDER_NAME = 'aws';
  const DEFAULT_PROVIDER_RUNTIME = 'nodejs12.x';
  const DEFAULT_PROVIDER_REGION = 'us-east-1';
  const DEFAULT_PROVIDER_STAGE = 'api';
  const DEFAULT_PROVIDER_TIMEOUT = 30;
  const DEFAULT_PROVIDER_LOG_RETENTION_DAYS = 7;
  const DEFAULT_PLUGINS = ['serverless-webpack', 'serverless-offline', 'serverless-prune-plugin'];

  let yml;

  before(() => {
    yml = YAML.load('serverless.yml');
  });

  it('service', () => {
    expect(yml.service).to.equal(DEFAULT_SERVICE);
  });
  it('provider - name', () => {
    expect(yml.provider.name).to.equal(DEFAULT_PROVIDER_NAME);
  });
  it('provider - runtime', () => {
    expect(yml.provider.runtime).to.equal(DEFAULT_PROVIDER_RUNTIME);
  });
  it('provider - region', () => {
    expect(yml.provider.region).to.equal(DEFAULT_PROVIDER_REGION);
  });
  it('provider - stage', () => {
    expect(yml.provider.stage).to.equal(DEFAULT_PROVIDER_STAGE);
  });
  it('provider - timeout', () => {
    expect(yml.provider.timeout).to.equal(DEFAULT_PROVIDER_TIMEOUT);
  });
  it('provider - logRetentionInDays', () => {
    expect(yml.provider.logRetentionInDays).to.equal(DEFAULT_PROVIDER_LOG_RETENTION_DAYS);
  });
  it('plugins', () => {
    expect(yml.plugins).to.deep.equal(DEFAULT_PLUGINS);
  });
  it('environment - apikey', () => {
    expect(yml.provider.environment.apikey)
      .to.equal('l1o2c3a4l5k6e7y'); // TODO: criar apikeys ou usar somente JWT
  });
});
