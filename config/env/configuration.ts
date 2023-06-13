export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  ENABLE_CORS: process.env.ENABLE_CORS || true,
  ENABLE_DOCS: process.env.ENABLE_CORS || true,
  NOSQL_CONNECTION_STRING: process.env.NOSQL_CONNECTION_STRING,
  JWT_KEY: process.env.JWT_KEY,
  JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '8h',
  JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  ENCRYPT_KEY: process.env.ENCRYPT_KEY,
  JWT_REFRESH_TOKEN_KEY: process.env.JWT_REFRESH_TOKEN_KEY,
  SMS_API_URL:process.env.SMS_API_URL,
  SMS_API_TOKEN:process.env.SMS_API_TOKEN
});
