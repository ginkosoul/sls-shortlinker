import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      sqs: {
        arn: { "Fn::GetAtt": ["receiverQueue", "Arn"] },
      },
    },
  ],
};
