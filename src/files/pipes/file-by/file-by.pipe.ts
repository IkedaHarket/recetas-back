import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FYLE_BY } from 'src/files/interfaces';

@Injectable()
export class FileByPipe implements PipeTransform {
  
  transform(value: FYLE_BY, metadata: ArgumentMetadata) {
    
    if(!Object.values(FYLE_BY).includes(value)){
      const validFilesBy: string = Object.values(FYLE_BY).join(', ').toString()
      throw new BadRequestException(`FileBY must be [ ${ validFilesBy } ]`);
    }

    return value
  }
}
