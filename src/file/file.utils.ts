import { Readable } from 'node:stream';
import { MimeType } from './enums/mime-type.enum';
import { File } from './interfaces/file.interface';
import { UploadFile } from './interfaces/upload-file.interface';
import { UploadGraphQLFile } from './interfaces/upload-graphql-file.interface';

export async function convertStreamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const buffer: Buffer = Buffer.concat(chunks);

  return buffer;
}

export async function convertGraphQLFileToFile(
  data: UploadGraphQLFile,
): Promise<File> {
  const fileBuffer = await convertStreamToBuffer(data.file.createReadStream());

  const file: File = {
    path: data.path,
    buffer: fileBuffer,
    name: data.file.filename,
    extension: MimeType[data.file.mimetype],
  };

  return file;
}
