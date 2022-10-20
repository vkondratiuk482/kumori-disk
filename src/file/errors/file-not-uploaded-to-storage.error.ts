export class FileNotUploadedToStorageError extends Error {
  public readonly name: string = 'FileNotUploadedToStorage';

  public readonly message: string = 'File has not been uploaded to the storage';
}
