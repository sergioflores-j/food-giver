/**
 * Returns an IAM policy document for a given user and resource.
 *
 * @method buildIAMPolicy
 * @param {object} param0
 * @param {string} param0.userId - user id
 * @param {string} param0.effect  - Allow / Deny
 * @param {string} param0.resource - resource ARN
 * @param {string} param0.context - response context
 * @returns {object} policyDocument
 */
const buildIAMPolicy = ({
  userId, effect, resource, context,
}) => {
  console.log(`buildIAMPolicy ${userId} ${effect} ${resource}`);
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  console.log(JSON.stringify(policy));
  return policy;
};

module.exports = {
  buildIAMPolicy,
};
