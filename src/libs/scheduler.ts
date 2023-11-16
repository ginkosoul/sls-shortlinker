import {
  CreateScheduleCommand,
  CreateScheduleInput,
  SchedulerClient,
  Target,
} from "@aws-sdk/client-scheduler";
import { SendMessageCommandInput } from "@aws-sdk/client-sqs";
const client = new SchedulerClient();

// const arn = "arn:aws:scheduler:::aws-sdk:sqs:sendMessage";
// const role = "sls-shortlinker-dev-eu-central-1-lambdaRole";
const queueUrl = process.env.queueUrl as string;

const scheduleReminder = async ({
  id,
  scheduleTime,
}: {
  id: string;
  scheduleTime: string;
}) => {
  const input: SendMessageCommandInput = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ id, scheduleTime }),
  };
  const target: Target = {
    RoleArn: process.env.arnRole!,
    Arn: process.env.arnScheduler!,
    Input: JSON.stringify(input),
  };

  const schedulerInput: CreateScheduleInput = {
    Name: id,
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    ActionAfterCompletion: "DELETE",
    Target: target,
    ScheduleExpression: `at(${scheduleTime})`,
  };

  const command = new CreateScheduleCommand(schedulerInput);
  const response = await client.send(command);

  if (response.$metadata.httpStatusCode == 200) {
    return { status: "Success" };
  } else {
    return {
      status: "Error",
    };
  }
};

export { scheduleReminder };
