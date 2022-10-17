export class UserExceedsPersonalStorageLimitError extends Error {
  public readonly name: string = 'UserExceedsPersonalStorageLimit';

  public readonly message: string = 'User exceeds personal storage limit';
}
