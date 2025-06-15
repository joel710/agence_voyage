import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Renamed VoyageDTO to Voyage for consistency
export interface Voyage {
  idVoyage?: number;
  departVoyage: string;
  arriveVoyage: string;
  dateVoyage: string; // Or Date, handle conversion. String is fine for DTO.
}

@Injectable({
  providedIn: 'root'
})
export class VoyageService {
  private baseUrl = '/tg/voyage_pro/reservation/auth/voyage';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // POST /create
  createVoyage(voyageData: Voyage): Observable<Voyage> { 
    return this.http.post<Voyage>(`${this.baseUrl}/create`, voyageData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // GET /getAll - Method to be modified
  getAllVoyages(): Observable<Voyage[]> {
    return this.http.get<any>(`${this.baseUrl}/getAll`) // Changed to <any>
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response as Voyage[];
          }
          if (typeof response === 'object' && response !== null && Object.keys(response).length === 0) {
            console.warn('Voyage API returned {} for a list request. Transforming to [].');
            return [] as Voyage[];
          }
          return response as Voyage[]; // Pass through other types
        }),
        catchError(this.handleError)
      );
  }

  // GET /get/{idVoyage}
  getVoyageById(idVoyage: number): Observable<Voyage> { 
    return this.http.get<Voyage>(`${this.baseUrl}/get/${idVoyage}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT /update/{idVoyage}
  updateVoyage(idVoyage: number, voyageData: Voyage): Observable<Voyage> {
    return this.http.put<Voyage>(`${this.baseUrl}/update/${idVoyage}`, voyageData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE /delete/{idVoyage}
  deleteVoyage(idVoyage: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${idVoyage}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An API error occurred in VoyageService:', error);
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
