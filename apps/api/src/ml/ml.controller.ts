import { Controller, Get, Post, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MlService } from "./ml.service";

@Controller("analysis")
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Get("health")
  health() {
    return this.mlService.health();
  }

  @Post("video")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 200 * 1024 * 1024 } }))
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No video file uploaded (field name: file).");
    return this.mlService.analyzeVideo(file);
  }
}
