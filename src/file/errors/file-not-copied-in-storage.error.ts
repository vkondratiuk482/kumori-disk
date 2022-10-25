export class FileNotCopiedInStorageError extends Error {
  public readonly name: string = 'FileNotCopiedInStorage';

  public readonly message: string = 'File has not been copied in the storage';
}
