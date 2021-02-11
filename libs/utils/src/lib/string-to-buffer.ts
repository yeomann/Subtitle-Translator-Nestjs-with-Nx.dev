// String to Buffer converstion
export function strToBuffer(str: string): Buffer {
  const bufferOfFileArr = Buffer.from(str, 'utf-8');
  return bufferOfFileArr;
}
