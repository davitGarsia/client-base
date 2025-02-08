import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  apiUrl = environment.API_URL;
  readonly http: HttpClient = inject(HttpClient);

  constructor() { }

  get<T>(url?: string, params?: {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url}`, { params });
  }

  post<T>(url: string, body?: {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, body);
  }

  put<T>(url: string, body?: {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${url}`);
  }
}
