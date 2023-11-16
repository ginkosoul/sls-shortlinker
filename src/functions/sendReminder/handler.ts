import { DynamoDBStreamEvent } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { sendEmail } from "@libs/notification";

export const handler = async (event: DynamoDBStreamEvent) => {
  try {
    console.log("Trigered DynamoDBStreamEvent");
    const reminderPromises = event.Records.map(async (record) => {
      const data = unmarshall(
        record.dynamodb.OldImage as Record<string, AttributeValue>
      );
      await sendEmail({
        email: "ginkosoul@hotmail.com",
        reminderMessage: JSON.stringify(data),
      });
    });
    await Promise.allSettled(reminderPromises);
  } catch (error) {
    console.log("error", error);
  }
};
