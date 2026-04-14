import { Module } from '@nestjs/common';
import { MusicApiService } from './music-api.service';

@Module({
  providers: [MusicApiService],
  exports: [MusicApiService],
})
export class MusicApiModule {}