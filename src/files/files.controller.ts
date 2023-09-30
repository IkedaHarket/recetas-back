import * as fs from 'fs';
import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res, Delete } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { Auth } from 'src/auth/decorators';
import { AUTH_ROLES } from 'src/auth/interfaces';
import { FileResponse } from './responses';
import { FileByPipe } from './pipes/file-by/file-by.pipe';
import { FYLE_BY } from './interfaces';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':fileBy/:fileName')
  @ApiParam({ name: 'fileBy', enum: FYLE_BY })
  findWebPageImage(
    @Res() res: Response,
    @Param('fileName') fileName: string,
    @Param("fileBy",FileByPipe) fileBy: FYLE_BY,
  ) {
    const path = this.filesService.getStaticWebPageImage(fileBy, fileName );
    res.sendFile( path );
  }

  @Get('fileBy')
  @Auth()
  @ApiResponse({ status: 201, description: 'Web page was created', type: String, isArray: true  })
  getAllFileBy() {
    return this.filesService.getAllFileBy()
  }

  @Post(':fileBy')
  @Auth(AUTH_ROLES.USER_ROLE)
  @ApiParam({ name: 'fileBy', enum: FYLE_BY })
  @ApiResponse({ status: 201, description: 'Imagen subida', type: FileResponse  })
  @UseInterceptors( 
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 }
      storage: diskStorage({
        destination: (req, file, callback)=>  callback(null,`./static/assets/${req.params.fileBy}/`),
        filename: fileNamer
      })
    })
   )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile( 
    @UploadedFile() file: Express.Multer.File,
    @Param("fileBy",FileByPipe) fileBy: FYLE_BY,
  ){
    if ( !file )  throw new BadRequestException('Make sure that the file is an image');
    const secureUrl = `${ this.configService.get('HOST_API') }/files/${fileBy}/${ file.filename }`;
    return new FileResponse(secureUrl);
  }

  // @Delete(":fileBy/:fileName")
  // @Auth(AUTH_ROLES.USER_ROLE)
  // @ApiParam({ name: 'fileBy', enum: FYLE_BY })
  // @ApiResponse({ status: 200, description: 'File deleted successfully'  })
  // deleteWebPageImage( 
  //   @Param("fileName") fileName:string,
  //   @Param("fileBy",FileByPipe) fileBy: FYLE_BY,
  //   ){
  //     fs.unlink(this.filesService.getStaticWebPageImage(fileBy,fileName), ()=>{} )
  // }

}
