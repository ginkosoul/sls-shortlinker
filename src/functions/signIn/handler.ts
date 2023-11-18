import { APIGatewayEvent } from "aws-lambda";
import { compare } from "bcryptjs";

import { validateUser } from "@libs/validations";
import { getUsersByEmail, updateUserToken } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { generateTokens } from "@libs/helpers";
import { formatJSONResponse } from "@libs/apiGateway";
import { AuthBody } from "@libs/types";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const body: AuthBody = JSON.parse(event.body as string);

    validateUser(body);

    const { email, password } = body;

    const [user] = await getUsersByEmail(email);

    if (!user)
      throw new HttpError(409, { message: "Email or password incorect" });

    const isValid = await compare(password, user.hashPassword);

    if (!isValid)
      throw new HttpError(409, { message: "Email or password incorect" });

    const upateData = { ...generateTokens(user.id), id: user.id };

    await updateUserToken(upateData);

    return formatJSONResponse({
      statusCode: 200,
      data: {
        refreshToken: upateData.refreshToken,
        accessToken: upateData.accessToken,
      },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: error.statusCode || 500,
      data: error.message || "Internal Server Error",
    });
  }
};
