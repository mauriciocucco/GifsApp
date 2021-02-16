import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gif, GiphySearchResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private key: string = environment.apiKey;
  private urlServer: string = environment.url;
  private _historial: string[] = [];
  resultados: Gif[] = [];

  get historial() {
    return [...this._historial]; //rompo la relación de referencia
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados =
      JSON.parse(localStorage.getItem('ultimosResultados')!) || [];
    /*if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }*/
  }

  buscarGifs(termino: string = '') {
    termino = termino.trim().toLowerCase();

    if (!this._historial.includes(termino)) {
      this._historial.unshift(termino);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.key)
      .set('limit', '10')
      .set('q', termino);

    this.http
      .get<GiphySearchResponse>(`${this.urlServer}/search`, { params })
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem(
          'ultimosResultados',
          JSON.stringify(this.resultados)
        );
      });
  }
}
