import { Readable } from 'node:stream';
import { MimeType } from './enums/mime-type.enum';
import { File } from './interfaces/file.interface';
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
  const resolvedFile = await data.file;

  const fileBuffer = await convertStreamToBuffer(
    resolvedFile.createReadStream(),
  );

  const file: File = {
    path: data.path,
    buffer: fileBuffer,
    name: resolvedFile.filename,
    extension: MimeType[resolvedFile.mimetype],
  };

  return file;
}
