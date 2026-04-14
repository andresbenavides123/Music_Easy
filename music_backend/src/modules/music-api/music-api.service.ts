import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Track } from '../../domain/interfaces/track.interface';

@Injectable()
export class MusicApiService {
  // Conexión con la API de Deezer para buscar música real
  async search(query: string): Promise<Track[]> {
    const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
    return response.data.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      artist: item.artist.name,
      albumCover: item.album.cover_medium,
      previewUrl: item.preview,
    }));
  }
}