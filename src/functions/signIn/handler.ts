import { APIGatewayEvent } from "aws-lambda";
import { compare } from "bcryptjs";

import { User, validateUser } from "@libs/validations";
import { getUserByEmail, updateUserToken } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { generateTokens } from "@libs/jwtHelper";
import { formatJSONResponse } from "@libs/api-gateway";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const body: User = JSON.parse(event.body as string);
    const { email, error, password } = validateUser(body);

    if (error) throw error;

    const record = await getUserByEmail(email);

    if (!record)
      throw new HttpError(409, { message: "Email or password incorect" });

    const isValid = await compare(password, record.hashPassword);

    if (!isValid)
      throw new HttpError(409, { message: "Email or password incorect" });

    const upateData = { ...generateTokens(record.id), id: record.id };

    await updateUserToken(upateData);

    return formatJSONResponse({
      statusCode: 200,
      data: {
        refreshToken: upateData.refreshToken,
        accessToken: upateData.refreshToken,
      },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: error.statusCode || 500,
      data: error.message || "Internal Server Error",
    });
  }
};
