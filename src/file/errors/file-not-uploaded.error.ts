export class FileNotUploadedError extends Error {
  public readonly name: string = 'FileNotUploaded';

  public readonly message: string = 'File has not been uploaded';
}
