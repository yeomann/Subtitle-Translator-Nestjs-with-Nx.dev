import * as path from 'path';
import { File } from '@subtitles-translator/interfaces';

export const txtFileFilter = (
  req: any,
  file: File,
  callback: (error: Error | null, acceptFile: boolean) => void
): void => {
  const invalidMsg = 'Invalid file type, Only .txt accepted';
  const ext = path.extname(file.originalname);

  if (ext !== '.txt') {
    req.fileValidationError = invalidMsg;
    return callback(new Error(invalidMsg), false);
  }

  return callback(null, true);
};
