export class FileNotDownloadedError extends Error {
  public readonly name: string = 'FileNotDownloaded';

  public readonly message: string = 'IFile has not been downloaded';
}
