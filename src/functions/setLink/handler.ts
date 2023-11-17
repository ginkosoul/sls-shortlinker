import { APIGatewayProxyEvent } from "aws-lambda";
import { nanoid } from "nanoid";

import { formatJSONResponse } from "@libs/api-gateway";
import { write } from "@libs/dynamo";
import { sendMessage } from "@libs/notification";
import { scheduleReminder } from "@libs/scheduler";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body);
    const tableName = process.env.urlTable;
    const baseUrl = process.env.baseUrl;

    const originalUrl = body.url;
    const code = nanoid(6);
    const shortUrl = `${baseUrl}/${code}`;
    const reminderDate = Math.floor(Date.now() / 1000) + 240;

    const data = {
      id: code,
      createdAt: new Date().toISOString().split(".")[0],
      userId: "newuser",
      shortUrl,
      originalUrl,
      visitCount: 0,
      TTL: reminderDate,
    };
    const scheduleTime = new Date(Date.now() + 5 * 60 * 1000);

    await scheduleReminder({
      id: code,
      scheduleTime: scheduleTime.toISOString().split(".")[0],
    });
    await write(data, tableName);
    const res = await sendMessage({ message: JSON.stringify(data) });
    console.log("Publish sqs result:", res);

    return formatJSONResponse({ data: { shortUrl, originalUrl } });
  } catch (error) {
    console.log("error", error);
    return formatJSONResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};
