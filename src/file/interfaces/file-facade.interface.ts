import { UploadFile } from './upload-file.interface';
import { ShareAccess } from './share-access.interface';
import { RevokeAccess } from './revoke-access.interface';
import { CopyFile } from './copy-file.interface';

export interface FileFacade {
  uploadSingleFileWithException(data: UploadFile): Promise<string>;

  shareAccessWithException(data: ShareAccess): Promise<boolean>;

  revokeAccessWithException(data: RevokeAccess): Promise<boolean>;

  copySingleWithException(data: CopyFile): Promise<string>;
}
