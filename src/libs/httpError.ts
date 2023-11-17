const errorMessageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};

export class HttpError extends Error {
  statusCode: number;
  constructor(
    statusCode: number = 404,
    body: Record<string, unknown> = { message: errorMessageList[statusCode] }
  ) {
    super(JSON.stringify(body));
    this.statusCode = statusCode;
  }
}
