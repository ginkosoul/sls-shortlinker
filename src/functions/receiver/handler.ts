import { SQSHandler } from "aws-lambda";

import {
  deleteLink,
  getUserById,
  generateEmailMessage,
  sendEmail,
  sqsSendEmailNotification,
  removeScheduledSQSMessage,
} from "@libs/helpers";

import { SQSMessageBody, User } from "@t/types";

export const handler: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      console.log("Recocrd -->  ", record);
      const { action, link, entity } = JSON.parse(
        record.body
      ) as SQSMessageBody;

      if (action === "DEACTIVATE") {
        await deleteLink(link.id);
        await sqsSendEmailNotification(link, entity);
        if (entity === "USER" && link.lifetime !== "one-time") {
          await removeScheduledSQSMessage(link.id);
        }
      }
      if (action === "SEND_MESSAGE") {
        const user = (await getUserById(link.userId)) as User;
        if (user.email) {
          const res = await sendEmail({
            email: user.email,
            reminderMessage: generateEmailMessage(link, entity),
          });
          console.log("Email responce: ", res);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
