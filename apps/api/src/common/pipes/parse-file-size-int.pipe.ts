import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFileSizeIntPipe implements PipeTransform {
  transform(value: unknown) {
    const num = Number(value);
    if (!Number.isFinite(num) || !Number.isInteger(num) || num < 0) {
      throw new BadRequestException('fileSize must be a non-negative integer');
    }
    return num;
  }
}