export class FileNotCreatedInDatabaseError extends Error {
  public readonly name: string = 'FileNotCreatedInDatabase';

  public readonly message: string = 'File has not been created in the database';
}
