import {
  CreateScheduleCommand,
  CreateScheduleInput,
  // DeleteScheduleCommand,
  SchedulerClient,
  Target,
} from "@aws-sdk/client-scheduler";
import { SendMessageCommandInput } from "@aws-sdk/client-sqs";
import { Link } from "./types";
import { getScheduledDate } from "./helpers";
const client = new SchedulerClient();

const queueUrl = process.env.queueUrl as string;
const roleArn = process.env.arnRole as string;
const arn = process.env.arnScheduler as string;

const scheduleSQSMessage = async (link: Link) => {
  const scheduleTime = getScheduledDate(link.lifetime)
    .toISOString()
    .split(".")[0];

  const input: SendMessageCommandInput = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ ...link, message: "Link expiered" }),
  };
  const target: Target = {
    RoleArn: roleArn,
    Arn: arn,
    Input: JSON.stringify(input),
  };

  const schedulerInput: CreateScheduleInput = {
    Name: link.id,
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

// const removeScheduledSQSMessage = (id: string) => {
//   const command = new DeleteScheduleCommand({
//     Name: id,
//     GroupName: "deleteLink",
//   })
// }

export { scheduleSQSMessage };
