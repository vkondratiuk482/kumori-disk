export class FileNotFoundError extends Error {
  public readonly name: string = 'FileNotFound';

  public readonly message: string = 'File has not been found';
}
