import {
  CreateScheduleCommand,
  CreateScheduleInput,
  DeleteScheduleCommand,
  SchedulerClient,
  Target,
} from "@aws-sdk/client-scheduler";
import { SendMessageCommandInput } from "@aws-sdk/client-sqs";
import { Link, SQSMessageBody } from "../../types/types";
import { getScheduledDate, getScheduledNameById } from "./formatHelpers";

const client = new SchedulerClient();

const queueUrl = process.env.queueUrl as string;
const roleArn = process.env.arnRole as string;
const arn = process.env.arnScheduler as string;
const groupName = process.env.scheduleGroupName as string;

const scheduleSQSMessage = async (link: Link) => {
  const scheduleTime = getScheduledDate(link.lifetime)
    .toISOString()
    .split(".")[0];

  const messageBody: SQSMessageBody = {
    link,
    action: "DEACTIVATE",
    entity: "SCHEDULER",
  };

  const input: SendMessageCommandInput = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  };
  const target: Target = {
    RoleArn: roleArn,
    Arn: arn,
    Input: JSON.stringify(input),
  };

  const schedulerInput: CreateScheduleInput = {
    Name: getScheduledNameById(link.id),
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    ActionAfterCompletion: "DELETE",
    Target: target,
    ScheduleExpression: `at(${scheduleTime})`,
    GroupName: groupName,
  };

  const command = new CreateScheduleCommand(schedulerInput);
  await client.send(command);
};

const removeScheduledSQSMessage = async (id: string) => {
  const command = new DeleteScheduleCommand({
    Name: getScheduledNameById(id),
    GroupName: groupName,
  });
  await client.send(command);
};

export { scheduleSQSMessage, removeScheduledSQSMessage };
