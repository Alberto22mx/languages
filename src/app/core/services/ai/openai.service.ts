import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer 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`,
    });

    const body = {
      model: 'gpt-4', // O usa gpt-3.5-turbo según tus necesidades
      messages: [
        { role: 'system', content: 'Eres un asistente muy útil y profesional.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    return this.http.post('https://api.openai.com/v1/chat/completions', body, { headers });
  }
}
