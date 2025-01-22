import { BadRequestException, Controller, Get, Logger, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { fileFilter } from './helpers/fileFilter.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from './helpers/fileNamer.helper';
import { FilesService } from './files.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is empty');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
    return res.sendFile(path);
  }
}
