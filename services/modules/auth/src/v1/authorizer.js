import jwt from 'jsonwebtoken';
import { buildIAMPolicy } from '@shared/utils/aws';

function authorizeUser(userScopes, methodArn) {
  console.log(`authorizeUser ${JSON.stringify(userScopes)} ${methodArn}`);
  const hasValidScope = true;
  return hasValidScope;
}

/**
 * Be careful with multiple methods and paths on same API gateway instance
 * If the resource is cached in full there will be intermitent 403 errors for diferent requests with the same token
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

export async function handler(event) {
  try {
    const token = event.authorizationToken;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('user', JSON.stringify(user));

    // Checks if the user's scopes allow him to call the current endpoint ARN
    // const user = decoded.user;
    const isAllowed = authorizeUser(user.scopes, event.methodArn);

    // Return an IAM policy document for the current endpoint
    const effect = isAllowed ? 'Allow' : 'Deny';
    const { userId } = user;
    const authorizerContext = { user: JSON.stringify(user) };
    const methodArn = generalizeResource(event.methodArn);
    const policyDocument = buildIAMPolicy(
      userId,
      effect,
      methodArn,
      authorizerContext,
    );
    console.log('Returning IAM policy document');
    return { body: JSON.stringify(policyDocument) };
  } catch (e) {
    console.log(e.message);
    return { body: 'Unauthorized' };
  }
}

export default {
  handler,
};
