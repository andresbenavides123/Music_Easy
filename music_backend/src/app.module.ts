import { Module } from '@nestjs/common';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { MusicApiModule } from './modules/music-api/music-api.module';

@Module({
  imports: [PlaylistModule, MusicApiModule],
})
export class AppModule {}