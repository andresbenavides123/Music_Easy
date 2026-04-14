import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Track } from '../../domain/interfaces/track.interface';

@Controller('api/playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // 1. Buscar música (Sigue igual)
  @Get('search')
  async search(@Query('q') q: string) {
    return await this.playlistService.searchTracks(q);
  }

  // 2. Obtener nombres de todas las playlists
  @Get('names')
  getNames() {
    return this.playlistService.getPlaylistNames();
  }

  // 3. Obtener canciones de una playlist específica
  @Get('songs/:name')
  getSongs(@Param('name') name: string) {
    return this.playlistService.getTracksFromPlaylist(name);
  }

  // 4. Crear una nueva playlist
  @Post('create')
  create(@Body('name') name: string) {
    return this.playlistService.createPlaylist(name);
  }

  // 5. Agregar a una playlist específica
  @Post('add/:name')
  addTrack(@Param('name') name: string, @Body() track: Track) {
    return this.playlistService.addToPlaylist(name, track);
  }

  // 6. Controles (Next/Prev) por playlist
  @Get('next/:name')
  next(@Param('name') name: string) {
    return this.playlistService.playNext(name);
  }

  @Get('prev/:name')
  prev(@Param('name') name: string) {
    return this.playlistService.playPrev(name);
  }
}