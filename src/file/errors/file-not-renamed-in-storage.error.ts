export class FileNotRenamedInStorageError extends Error {
  public readonly name: string = 'FileNotRenamedInStorage';

  public readonly message: string = 'File has not been renamed in the storage';
}
