export const formatJSONResponse = ({
  statusCode = 200,
  data,
  headers = {},
}: {
  statusCode?: number;
  data?: Record<string, unknown> | Array<unknown> | string;
  headers?: Record<string, string>;
}) => {
  if (data && typeof data !== "string") {
    headers["Content-Type"] = "application/json";
  }
  return {
    statusCode,
    body: JSON.stringify(data),
    headers,
  };
};
