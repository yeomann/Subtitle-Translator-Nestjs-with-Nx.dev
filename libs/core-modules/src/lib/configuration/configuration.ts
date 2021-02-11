// eslint-disable-next-line
export const config = () => {
  const postgresHost = process.env.POSTGRES_HOST;
  const postgresPort = process.env.POSTGRES_PORT;
  const postgresUser = process.env.POSTGRES_USER;
  const postgresPass = process.env.POSTGRES_PASSWORD;
  const postgresDB = process.env.POSTGRES_DATABASE;
  const postgresSchema = process.env.POSTGRES_DATABASE_SCHEMA;

  return {
    port: parseInt(process.env.PORT, 10) || 8080,
    jwtSecret: process.env.JWT_SECRET,
    isProd: process.env.MODE.toLowerCase() === 'prod',
    database: {
      name: 'default',
      host: postgresHost,
      port: parseInt(postgresPort, 10) || 5432,
      username: postgresUser,
      password: postgresPass,
      database: postgresDB,
      scheme: postgresSchema || 'public',
      stringUrl: `postgresql://${postgresUser}:${postgresPass}@${postgresHost}/${postgresDB}`,
    },
  };
};
