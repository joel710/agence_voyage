import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for TypeBillet Data Transfer Object / Entity
// Based on the aligned TypeBilletData from the modal and TYPE_BILLET entity
export interface TypeBilletDTO { // Using DTO suffix for consistency, though API uses TYPE_BILLET and TypeBilletDTO
  idTypeBillet?: number;
  libelleTypeBillet: string;
  prixTypeBillet: number;
}

@Injectable({
  providedIn: 'root'
})
export class TypeBilletService {
  private baseUrl = '/tg/voyage_pro/reservation/auth/ticket';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // POST /create (API expects TYPE_BILLET, returns TYPE_BILLET)
  createTypeBillet(typeBilletData: TypeBilletDTO): Observable<TypeBilletDTO> {
    return this.http.post<TypeBilletDTO>(`${this.baseUrl}/create`, typeBilletData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // GET /getAll (API returns List<TYPE_BILLET>)
  getAllTypesBillet(): Observable<TypeBilletDTO[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAll`) // Changed to any[]
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response as TypeBilletDTO[];
          }
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/getAll. Transforming to []. Consider fixing the API.`);
            return [] as TypeBilletDTO[];
          }
          console.warn(`Unexpected response type for GET ${this.baseUrl}/getAll. Expected TypeBilletDTO[], got:`, response);
          return [] as TypeBilletDTO[]; // Fallback or throw
        }),
        catchError(this.handleError)
      );
  }

  // GET /get/{id} (API returns TypeBilletDTO)
  getTypeBilletById(idTypeBillet: number): Observable<TypeBilletDTO | null> {
    return this.http.get<any>(`${this.baseUrl}/get/${idTypeBillet}`) // Changed to any
      .pipe(
        map((response: any) => {
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/get/${idTypeBillet}. Transforming to null. Consider fixing the API to return 404.`);
            return null;
          }
          if (response && typeof response === 'object' && response.idTypeBillet !== undefined) { // Basic check
            return response as TypeBilletDTO;
          }
          if (response === null) return null;
          console.warn(`Unexpected response type for GET ${this.baseUrl}/get/${idTypeBillet}. Expected TypeBilletDTO or empty {}, got:`, response);
          return null;
        }),
        catchError(this.handleError)
      );
  }

  // PUT /update/{idType} (API expects TypeBilletDTO, returns TypeBilletDTO)
  // Note: API path uses {idType}, DTO uses idTypeBillet. Assuming idType refers to idTypeBillet.
  updateTypeBillet(idTypeBillet: number, typeBilletData: TypeBilletDTO): Observable<TypeBilletDTO> {
    return this.http.put<TypeBilletDTO>(`${this.baseUrl}/update/${idTypeBillet}`, typeBilletData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // DELETE /delete/{id} (API returns boolean)
  // Note: API path uses {id}, DTO uses idTypeBillet. Assuming id refers to idTypeBillet.
  deleteTypeBillet(idTypeBillet: number): Observable<boolean> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${idTypeBillet}`, { ...this.httpOptions, observe: 'response' }) // Observe response for 204
      .pipe(
        map(response => {
          // Handle 204 No Content (common for DELETE success)
          if (response.status === 204) {
            return true; // Successfully deleted, no content
          }
          // Handle 200 OK with a body
          if (response.status === 200) {
            const body = response.body;
            if (typeof body === 'boolean') {
              return body;
            }
            if (body && typeof body === 'object' && Object.keys(body).length === 0) {
              console.warn(`API returned {} for DELETE ${this.baseUrl}/delete/${idTypeBillet}. Interpreting as success (true).`);
              return true; // Assuming {} means success
            }
            // If body is something else but status is 200, it's unexpected for a boolean return
            console.warn(`Unexpected body for 200 OK on DELETE ${this.baseUrl}/delete/${idTypeBillet}. Expected boolean or empty {}. Got:`, body);
            return false; // Or throw error
          }
          // Should not be reached if not 200 or 204, as HttpErrorResponse would be thrown
          console.warn('Unexpected response status for deleteTypeBillet:', response.status);
          return false; // Fallback for other unexpected success codes
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened with TypeBillet API; please try again later.'));
  }
}
