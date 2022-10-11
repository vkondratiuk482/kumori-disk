export class FileNotDownloadedError extends Error {
  public readonly name: string = 'FileNotDownloaded';

  public readonly message: string = 'File has not been downloaded';
}
