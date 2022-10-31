export class FileKeyNotUpdatedInDatabaseError extends Error {
  public readonly name: string = 'FileKeyNotUpdatedInDatabase';

  public readonly message: string = 'File has not been updated in the database';
}
