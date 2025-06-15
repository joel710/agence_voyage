import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for Voyage Data Transfer Object
// Based on the aligned VoyageData from the modal and VOYAGE entity
export interface VoyageDTO {
  idVoyage?: number;
  departVoyage: string;
  arriveVoyage: string;
  dateVoyage: string; // Expected as yyyy-MM-dd string for API
  prix?: number;
  placesDisponibles?: number;
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
  createVoyage(voyageData: VoyageDTO): Observable<VoyageDTO> { // Assuming response is VoyageDTO, API doc says VOYAGE or VoyageDTO
    return this.http.post<VoyageDTO>(`${this.baseUrl}/create`, voyageData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // GET /getAll
  getAllVoyages(): Observable<VoyageDTO[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAll`) // Changed to any[]
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response as VoyageDTO[];
          }
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/getAll. Transforming to []. Consider fixing the API.`);
            return [] as VoyageDTO[];
          }
          console.warn(`Unexpected response type for GET ${this.baseUrl}/getAll. Expected VoyageDTO[], got:`, response);
          return [] as VoyageDTO[]; // Fallback or throw
        }),
        catchError(this.handleError)
      );
  }

  // GET /get/{idVoyage}
  getVoyageById(idVoyage: number): Observable<VoyageDTO | null> {
    return this.http.get<any>(`${this.baseUrl}/get/${idVoyage}`) // Changed to any
      .pipe(
        map((response: any) => {
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/get/${idVoyage}. Transforming to null. Consider fixing the API to return 404.`);
            return null;
          }
          if (response && typeof response === 'object' && response.idVoyage !== undefined) { // Basic check
            return response as VoyageDTO;
          }
          if (response === null) return null;
          console.warn(`Unexpected response type for GET ${this.baseUrl}/get/${idVoyage}. Expected VoyageDTO or empty {}, got:`, response);
          return null;
        }),
        catchError(this.handleError)
      );
  }

  // PUT /update/{idVoyage}
  updateVoyage(idVoyage: number, voyageData: VoyageDTO): Observable<VoyageDTO> { // Assuming response is VoyageDTO
    return this.http.put<VoyageDTO>(`${this.baseUrl}/update/${idVoyage}`, voyageData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // DELETE /delete/{idVoyage}
  deleteVoyage(idVoyage: number): Observable<any> { // Response type might vary
    return this.http.delete<any>(`${this.baseUrl}/delete/${idVoyage}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened with Voyage API; please try again later.'));
  }
}
