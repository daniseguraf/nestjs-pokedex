export const EnvConfig = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongoURI: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: process.env.DEFAULT_LIMIT || 7,
});
