import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GtfsService } from './services/gtfs.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('gtfs')
@Controller('gtfs')
export class GtfsController {
  constructor(private readonly gtfsService: GtfsService) {}

  @ApiResponse({
    status: 200,
  })
  @Post('parse/routes')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadRouteList(@UploadedFile() file: Express.Multer.File) {
    return this.gtfsService.uploadRoutes(file);
  }

  @ApiResponse({
    status: 200,
  })
  @Post('parse/agencies')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAgencyList(@UploadedFile() file: Express.Multer.File) {
    return this.gtfsService.uploadAgencies(file);
  }

  @ApiResponse({
    status: 200,
  })
  @Post('parse/ports')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPortsList(@UploadedFile() file: Express.Multer.File) {
    return this.gtfsService.uploadPorts(file);
  }
}
