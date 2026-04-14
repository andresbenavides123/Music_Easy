import { Track } from '../interfaces/track.interface';

export class SongNode {
  public data: Track;
  public next: SongNode | null = null;
  public prev: SongNode | null = null;

  constructor(track: Track) {
    this.data = track;
  }
}