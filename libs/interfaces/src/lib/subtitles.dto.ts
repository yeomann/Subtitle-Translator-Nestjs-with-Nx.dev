import { ApiProperty } from '@nestjs/swagger';

export class Subtitles {
  @ApiProperty({
    description: 'Subtitle Attachments',
    type: 'array',
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  files: any[];
}
