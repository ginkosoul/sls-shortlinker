import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from "@aws-sdk/client-sqs";

const sesClient = new SESClient({});
const snsClient = new SNSClient({});
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
        Data: "Your Reminder!",
      },
    },
  };

  const command = new SendEmailCommand(params);

  const response = await sesClient.send(command);

  return response.MessageId;
};

// ----------------------------------------
export const sendSMS = async ({
  phoneNumber,
  reminderMessage,
}: {
  phoneNumber: string;
  reminderMessage: string;
}) => {
  const params: PublishCommandInput = {
    Message: reminderMessage,
    PhoneNumber: phoneNumber,
  };

  const command = new PublishCommand(params);

  const response = await snsClient.send(command);

  return response.MessageId;
};

export const sendMessage = async (message: string) => {
  const queueUrl = process.env.queueUrl as string;

  const input: SendMessageCommandInput = {
    QueueUrl: queueUrl,
    MessageBody: message,
  };
  const command = new SendMessageCommand(input);

  await sqsClient.send(command);
};
