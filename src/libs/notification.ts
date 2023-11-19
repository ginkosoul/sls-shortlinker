import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
  VerifyEmailIdentityCommand,
} from "@aws-sdk/client-ses";
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from "@aws-sdk/client-sqs";

import { Entity, Link, SQSMessageBody } from "./types";

const sesClient = new SESClient({});
const sqsClient = new SQSClient({});

export const sendEmail = async ({
  email,
  reminderMessage,
}: {
  email: string;
  reminderMessage: string;
}) => {
  const params: SendEmailCommandInput = {
    Source: "ginkosoul@gmail.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: reminderMessage,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Shortlink Notification",
      },
    },
  };

  const command = new SendEmailCommand(params);

  const response = await sesClient.send(command);

  return response;
};

export const verifyEmailIdentity = async (email: string) => {
  try {
    const command = new VerifyEmailIdentityCommand({
      EmailAddress: email,
    });
    await sesClient.send(command);
    return { statusCode: 200 };
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};

// ----------------------------------------

export const sendMessageSQS = async (message: string) => {
  const queueUrl = process.env.queueUrl as string;

  const input: SendMessageCommandInput = {
    QueueUrl: queueUrl,
    MessageBody: message,
  };
  const command = new SendMessageCommand(input);

  const res = await sqsClient.send(command);
  if (res.$metadata.httpStatusCode !== 200) {
    throw new Error("failed to add task to SQS");
  }
};

export const sqsDeactivateLink = async (link: Link, entity?: Entity) => {
  const message: SQSMessageBody = {
    link,
    action: "DEACTIVATE",
    entity: entity || "USER",
  };

  await sendMessageSQS(JSON.stringify(message));
};

export const sqsSendEmailNotification = async (link: Link, entity: Entity) => {
  const sqsMessage: SQSMessageBody = {
    link,
    action: "SEND_MESSAGE",
    entity: entity,
  };

  await sendMessageSQS(JSON.stringify(sqsMessage));
};
