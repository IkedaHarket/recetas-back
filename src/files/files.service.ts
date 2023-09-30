import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';
import { FYLE_BY } from './interfaces';

@Injectable()
export class FilesService {
  
    getStaticWebPageImage( fileBy: FYLE_BY,imageName: string ) {

        const path = join( __dirname, `../../static/assets/${fileBy}`, imageName );

        if ( !existsSync(path) ) 
            throw new BadRequestException(`No web page found with image ${ imageName }`);

        return path;
    }

    getAllFileBy(){
        return Object.values(FYLE_BY)
    }

}
