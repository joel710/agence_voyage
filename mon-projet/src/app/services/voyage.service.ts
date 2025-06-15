import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    return this.http.get<VoyageDTO[]>(`${this.baseUrl}/getAll`)
      .pipe(catchError(this.handleError));
  }

  // GET /get/{idVoyage}
  getVoyageById(idVoyage: number): Observable<VoyageDTO> { // Assuming response is VoyageDTO for consistency, API doc says VOYAGE
    return this.http.get<VoyageDTO>(`${this.baseUrl}/get/${idVoyage}`)
      .pipe(catchError(this.handleError));
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
