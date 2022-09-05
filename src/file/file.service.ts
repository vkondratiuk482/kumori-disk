import { Injectable } from '@nestjs/common';
import { FileServiceInterface } from './interfaces/file-service.interface';

@Injectable()
export class FileService implements FileServiceInterface {}
