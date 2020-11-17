export default function handler(lambda) {
    return function (event, context) {
        return Promise.resolve()
            // Run the Lambda
            .then(() => lambda(event, context))
            // On success
            .then((responseBody) => [responseBody])
            // On failure
            .catch((e) => {
                return [500, { error: e.message }];
            })
            // Return HTTP response
            .then(([body]) => ({
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: body,
            }))
            // On failure
            .catch((e) => {
                return [500, { error: e.message }];
            });
    };
}
