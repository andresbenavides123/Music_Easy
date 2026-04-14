import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { MusicApiModule } from '../music-api/music-api.module';

@Module({
  imports: [MusicApiModule],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}