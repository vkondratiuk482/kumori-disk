import { IUploadFile } from './upload-file.interface';
import { IShareAccess } from './share-access.interface';
import { IRevokeAccess } from './revoke-access.interface';
import { ICopyFile } from './copy-file.interface';
import { IRenameFile } from './rename-file.interface';

export interface IFileFacade {
  uploadSingleFileWithException(data: IUploadFile): Promise<string>;

  shareAccessWithException(data: IShareAccess): Promise<boolean>;

  revokeAccessWithException(data: IRevokeAccess): Promise<boolean>;

  copySingleWithException(data: ICopyFile): Promise<string>;

  renameSingleWithException(data: IRenameFile): Promise<string>;
}
