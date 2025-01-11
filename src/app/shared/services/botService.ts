import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BotService {
  constructor(private http: HttpClient) {}

  getBotResponse(): Observable<string> {
    return this.http
      .get<{ author: string; quote: string }>(
        'https://programming-quotesapi.vercel.app/api/random'
      )
      .pipe(
        map((response) => {
          return response.quote;
        }),
        catchError((err) => {
          console.error('Error getting bot response:', err);
          return 'Sorry, something went wrong.';
        })
      );
  }
}
