const mountProjectionExpression = ({ fields = [], options = {} } = {}) => {
  if (fields.length > 0) {
    const ProjectionExpression = fields.map((_, index) => `#Projection_${index}`).join(',');
    let { ExpressionAttributeNames } = options;
    if (!ExpressionAttributeNames) ExpressionAttributeNames = {};

    fields.forEach((i, index) => {
      ExpressionAttributeNames[`#Projection_${index}`] = i;
    });

    return { ProjectionExpression, ExpressionAttributeNames };
  }
  return {};
};

module.exports = {
  mountProjectionExpression,
};
