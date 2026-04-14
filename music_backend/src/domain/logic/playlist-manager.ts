import { Track } from '../interfaces/track.interface';
import { SongNode } from '../entities/song-node.entity';

export class PlaylistManager {
  private head: SongNode | null = null;
  private tail: SongNode | null = null;
  public current: SongNode | null = null;
  private size: number = 0;

  public append(track: Track): void {
    const newNode = new SongNode(track);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  public remove(id: string): void {
    let temp = this.head;
    while (temp) {
      if (temp.data.id === id) {
        if (temp.prev) temp.prev.next = temp.next;
        if (temp.next) temp.next.prev = temp.prev;
        if (temp === this.head) this.head = temp.next;
        if (temp === this.tail) this.tail = temp.prev;
        this.size--;
        return;
      }
      temp = temp.next;
    }
  }

  // Avanzar: Usa el puntero .next
  public getNext(): Track | null {
    if (this.current?.next) {
      this.current = this.current.next;
    } else {
      this.current = this.head; // Loop al inicio
    }
    return this.current ? this.current.data : null;
  }

  // RETROCEDER: ¡Este es el que te faltaba! Usa el puntero .prev
  public getPrevious(): Track | null {
    if (this.current?.prev) {
      this.current = this.current.prev;
    } else {
      this.current = this.tail; // Loop al final
    }
    return this.current ? this.current.data : null;
  }

  public toArray(): Track[] {
    const tracks: Track[] = [];
    let temp = this.head;
    while (temp) {
      tracks.push(temp.data);
      temp = temp.next;
    }
    return tracks;
  }
}