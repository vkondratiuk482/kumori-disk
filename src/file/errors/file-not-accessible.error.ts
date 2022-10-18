export class FileNotAccessibleError extends Error {
  public readonly name: string = 'FileNotAccessible';

  public readonly message: string =
    'You can not access this file. You can ask the owner to share the access';
}
