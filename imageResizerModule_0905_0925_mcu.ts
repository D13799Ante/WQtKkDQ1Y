// 代码生成时间: 2025-09-05 09:25:09
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageResizerService } from './imageResizer.service';
import { MulterStorageService } from './multerStorage.service';
import { ImageResizerController } from './imageResizer.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: new MulterStorageService().getStorage(),
      })},
  ]),
  controllers: [ImageResizerController],
  providers: [ImageResizerService, MulterStorageService],
})
export class ImageResizerModule {}

/*
 * Image Resizer Service
 * Handles the logic for resizing images.
 */
import { Injectable } from '@nestjs/common';
import { Multer } from '@nestjs/platform-express';
import { extname } from 'path';
import { v2 as sharp } from 'sharp';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageResizerService {
  constructor(private readonly multer: Multer) {}

  async resizeImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const resizedFiles = [];
      for (const file of files) {
        const resize = sharp(file.path)
          .resize({
            width: 800, // Resize width
            height: 600, // Resize height
            fit: 'inside', // Fit mode
          }).toFile(`./${file.filename}-resized.${extname(file.originalname)}`);
        resizedFiles.push(await resize);
      }
      return resizedFiles.map((file) => file.info.path);
    } catch (error) {
      throw new BadRequestException('Error resizing images: ' + error.message);
    }
  }
  
  async deleteOriginalFiles(files: Express.Multer.File[]): Promise<void> {
    try {
      for (const file of files) {
        await sharp(file.path).delete();
      }
    } catch (error) {
      throw new BadRequestException('Error deleting original files: ' + error.message);
    }
  }
}

/*
 * Multer Storage Service
 * Handles storage configuration for multer.
 */
import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v2 as sharp } from 'sharp';
import { Request } from 'express';

@Injectable()
export class MulterStorageService {
  getStorage(): diskStorage.Options {
    return {
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + sharp.format.extname(file.originalname));
      },
    };
  }
}

/*
 * Image Resizer Controller
 * Handles HTTP requests for resizing images.
 */
import { Controller, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageResizerService } from './imageResizer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('image-resizer')
export class ImageResizerController {
  constructor(private readonly imageResizerService: ImageResizerService) {}

  @UseGuards(AuthGuard())
  @Post('resize')
  @UseInterceptors(FileInterceptor('files'))
  async resizeImage(@UploadedFiles() files: Express.Multer.File[]): Promise<string[]> {
    const resizedPaths = await this.imageResizerService.resizeImages(files);
    await this.imageResizerService.deleteOriginalFiles(files);
    return resizedPaths;
  }
}