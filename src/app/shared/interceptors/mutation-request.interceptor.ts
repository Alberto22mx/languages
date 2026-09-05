import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize, shareReplay } from 'rxjs';

/**
 * Evita que dos clics rápidos ejecuten la misma mutación más de una vez.
 * Las consultas GET se excluyen deliberadamente para no alterar su actualización normal.
 */
@Injectable()
export class MutationRequestInterceptor implements HttpInterceptor {
  private readonly pendingRequests = new Map<string, Observable<HttpEvent<unknown>>>();
  private readonly mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.mutationMethods.has(request.method)) {
      return next.handle(request);
    }

    const key = this.getRequestKey(request);
    const pendingRequest = this.pendingRequests.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    const request$ = next.handle(request).pipe(
      finalize(() => this.pendingRequests.delete(key)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.pendingRequests.set(key, request$);
    return request$;
  }

  private getRequestKey(request: HttpRequest<unknown>): string {
    return `${request.method}|${request.urlWithParams}|${this.serializeBody(request.body)}`;
  }

  private serializeBody(body: unknown): string {
    if (body === null || body === undefined) return '';
    if (typeof body === 'string') return body;
    if (body instanceof Date) return body.toISOString();

    try {
      if (Array.isArray(body)) {
        return `[${body.map((item) => this.serializeBody(item)).join(',')}]`;
      }
      if (typeof body === 'object') {
        return `{${Object.keys(body as object)
          .sort()
          .map((key) => `${key}:${this.serializeBody((body as Record<string, unknown>)[key])}`)
          .join(',')}}`;
      }
      return JSON.stringify(body);
    } catch {
      return String(body);
    }
  }
}
