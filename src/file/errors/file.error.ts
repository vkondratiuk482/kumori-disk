import { DomainError } from 'src/common/domain-error';

export class FileError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  public static NotAccessible(): FileError {
    return new FileError(
      'You can not access this file. You can ask the owner to share the access',
    );
  }

  public static ActionNotPerformed(): FileError {
    return new FileError(
      'An error occurred while performing the action with a file',
    );
  }

  public static NotFound(): FileError {
    return new FileError('File has not been found');
  }
}
