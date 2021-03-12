console.log('Loading function');

exports.handler = async (event, context) => {
    return "Jason Schmitt says " + event.queryStringParameters.keyword
};