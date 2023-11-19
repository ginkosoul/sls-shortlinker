import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      sqs: {
        arn: { "Fn::GetAtt": ["receiverQueue", "Arn"] },
        batchSize: 10,
      },
    },
  ],
};
