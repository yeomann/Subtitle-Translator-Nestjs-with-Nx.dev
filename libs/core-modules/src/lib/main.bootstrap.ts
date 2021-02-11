import { AppConsts } from '@subtitles-translator/constants';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { middleware } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export async function bootstrap(
  app: INestApplication,
  title: string,
  description: string,
  swaggerDocumentOptions?: SwaggerDocumentOptions
): Promise<void> {
  app.enableCors();
  app
    .use(middleware)
    .use(compression())
    .use(
      helmet({
        contentSecurityPolicy: false,
      })
    )
    .use(
      rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 100, // limit each IP to 100 requests per windowMs
      })
    )
    // .use(statusMonitor(statusMonitorConfig))
    .use(
      helmet.permittedCrossDomainPolicies({
        permittedPolicies: 'all',
      })
    )
    .use(helmet.hidePoweredBy())
    .setGlobalPrefix(AppConsts.globalPrefix)
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        // forbidNonWhitelisted: true,
        // skipMissingProperties: false,
        // forbidUnknownValues: true
        // validationError: { target: true, value: true },
        // disableErrorMessages: false
      })
    );

  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    options,
    swaggerDocumentOptions
  );
  SwaggerModule.setup(`${AppConsts.globalPrefix}/swagger`, app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);

  const swaggerUrl = `http://localhost:${port}/${AppConsts.globalPrefix}/swagger`;

  console.log(`Listening to Rest APIs at ${swaggerUrl} 🚀`);
}
