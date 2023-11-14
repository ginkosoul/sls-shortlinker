export const formatJSONResponse = ({
  statusCode = 200,
  data,
  headers,
}: {
  statusCode?: number;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
}) => {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers,
  };
};
