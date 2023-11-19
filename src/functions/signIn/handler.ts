import { APIGatewayEvent } from "aws-lambda";
import { compare } from "bcryptjs";

import { errorHadlerWrapper } from "@libs/wrappers/apiErrorHandler";
import { formatJSONResponse } from "@libs/apiGateway";
import { validateUser } from "@libs/validations";
import { getUsersByEmail, updateUserToken } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { generateTokens } from "@libs/helpers";

import { AuthBody } from "@libs/types";

const _handler = async (event: APIGatewayEvent) => {
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
};

export const handler = errorHadlerWrapper(_handler);
