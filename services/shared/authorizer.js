const jwt = require('jsonwebtoken');
const { buildIAMPolicy } = require('./utils/aws');

function authorizeUser(userScopes, methodArn) {
  console.log(`authorizeUser ${JSON.stringify(userScopes)} ${methodArn}`);
  // TODO: validate
  const hasValidScope = true;
  return hasValidScope;
}

/**
 * Be careful with multiple methods and paths on same API gateway instance
 * If the resource is cached in full there will be intermittent 403 errors for different requests with the same token
 * Turns arn:aws:execute-api:sa-east-1:account:apigatewayhash/dev/POST/v1/whatever
 * Into  arn:aws:execute-api:sa-east-1:account:apigatewayhash/dev/*
 * @param {*} resource
 */
function generalizeResource(resource) {
  return resource
    .split('/', 2)
    .concat('*')
    .join('/');
}

module.exports.run = async function run(event) {
  try {
    console.log('event', event);
    const tokenContext = jwt.verify(event.authorizationToken, process.env.JWT_SECRET);

    // Checks if the user's scopes allow him to call the current endpoint ARN
    // const user = decoded.user;
    const isAllowed = authorizeUser(tokenContext.scopes, event.methodArn);

    // Return an IAM policy document for the current endpoint
    const effect = isAllowed ? 'Allow' : 'Deny';
    const authorizerContext = { tokenContext: JSON.stringify(tokenContext) };
    const methodArn = generalizeResource(event.methodArn);

    if (!tokenContext.user.email) throw new Error('Invalid token');

    const policyDocument = buildIAMPolicy({
      userId: tokenContext.user.email,
      effect,
      resource: methodArn,
      context: authorizerContext,
    });

    return policyDocument;
  } catch (e) {
    console.log('Error authorizer', e.message);
    return { body: 'Unauthorized' };
  }
};
