import { ApiBody } from '@nestjs/swagger';

// custom decorator to allow multiple upload in the swagger
// https://github.com/nestjs/swagger/issues/417#issuecomment-590988354
export const ApiMultiFile = (fileName: string): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })(target, propertyKey, descriptor);
};
