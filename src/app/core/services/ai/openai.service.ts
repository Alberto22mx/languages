import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  constructor(private http: HttpClient) {}

  generateResponse(prompt: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${environment.baseUrl}/ai/chat`, { prompt });
  }
}
