export class RequestExecutionError extends Error {
  public readonly name: string = 'RequestExecution';

  public readonly message: string =
    'An error occurred while executing 3rd party request';
}
