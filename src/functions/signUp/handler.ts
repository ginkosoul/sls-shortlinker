import { APIGatewayEvent } from "aws-lambda";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

import { validateUser } from "@libs/validations";
import { createUser, getUsersByEmail } from "@libs/dynamo";
import { HttpError } from "@libs/httpError";
import { generateTokens } from "@libs/helpers";
import { formatJSONResponse } from "@libs/api-gateway";
import { AuthBody, User } from "@libs/types";

const SALT = Number(process.env.HASH_SALT);

export const handler = async (event: APIGatewayEvent) => {
  try {
    const body: AuthBody = JSON.parse(event.body as string);

    validateUser(body);

    const { email, password } = body;

    const records = await getUsersByEmail(email);

    if (records.length) {
      throw new HttpError(409, { message: "Email already in use" });
    }

    const id = nanoid();
    const hashPassword = await hash(password, SALT);
    const { accessToken, refreshToken } = generateTokens(id);

    const user: User = {
      id,
      email,
      hashPassword,
      refreshToken,
      accessToken,
    };

    await createUser(user);

    return formatJSONResponse({
      statusCode: 201,
      data: {
        id,
        email,
        refreshToken,
        accessToken,
      },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: error.statusCode || 500,
      data: error.message || "Internal Server Error",
    });
  }
};
