import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => {
  const appConfig = process.env.APP_CONFIG.split('|');
  const name = appConfig[0];
  const gsuitAdmin = appConfig[1];
  return {
    appName: name,
    appEmail: gsuitAdmin,
    // port: +process.env.PORT || 5000,
    // appUrl: process.env.APP_URL,
    // shouldSendWelcomeEmail: false,
    // security: {
    //   minPasswordScore: 2
    // }
  };
});
