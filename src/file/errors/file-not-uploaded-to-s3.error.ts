export class FileNotUploadedToS3Error extends Error {
  public readonly name: string = 'FileNotUploadedToS3';

  public readonly message: string = 'File has not been uploaded to S3';
}
