import { Injectable, HttpException, Logger } from "@nestjs/common";
import axios from "axios";
import FormData from "form-data";

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly baseUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";

  async health(): Promise<any> {
    const { data } = await axios.get(`${this.baseUrl}/health`, { timeout: 5000 });
    return data;
  }

  async analyzeVideo(file: Express.Multer.File): Promise<any> {
    const form = new FormData();
    form.append("file", file.buffer, {
      filename: file.originalname || "video.mp4",
      contentType: file.mimetype || "video/mp4",
    });

    try {
      const { data } = await axios.post(`${this.baseUrl}/analyze`, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 300000,
      });
      return data;
    } catch (e: any) {
      this.logger.error(`ML service error: ${e.message}`);
      const status = e.response?.status || 502;
      const detail = e.response?.data?.detail || "ML service unavailable";
      throw new HttpException(detail, status);
    }
  }
}
