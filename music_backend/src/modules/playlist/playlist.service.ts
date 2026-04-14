import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaylistManager } from '../../domain/logic/playlist-manager';
import { MusicApiService } from '../music-api/music-api.service';
import { Track } from '../../domain/interfaces/track.interface';

@Injectable()
export class PlaylistService {
  // Ahora guardamos múltiples managers: { "nombre": PlaylistManager }
  private playlists: Map<string, PlaylistManager> = new Map();

  constructor(private readonly musicApi: MusicApiService) {
    // Creamos una playlist por defecto
    this.playlists.set('Favoritos', new PlaylistManager());
  }

  async searchTracks(query: string) {
    return await this.musicApi.search(query);
  }

  // Crear nueva playlist
  createPlaylist(name: string) {
    if (!this.playlists.has(name)) {
      this.playlists.set(name, new PlaylistManager());
    }
    return Array.from(this.playlists.keys());
  }

  getPlaylistNames() {
    return Array.from(this.playlists.keys());
  }

  getTracksFromPlaylist(name: string) {
    const manager = this.playlists.get(name);
    if (!manager) throw new NotFoundException('Playlist no existe');
    return manager.toArray();
  }

  addToPlaylist(playlistName: string, track: Track) {
    const manager = this.playlists.get(playlistName);
    if (!manager) throw new NotFoundException('Playlist no existe');
    manager.append(track);
    return { message: `Añadida a ${playlistName}` };
  }

  playNext(playlistName: string) {
    return this.playlists.get(playlistName)?.getNext();
  }

  playPrev(playlistName: string) {
    return this.playlists.get(playlistName)?.getPrevious();
  }
}