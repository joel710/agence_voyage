import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for TypeBillet based on README.md entity description
export interface TypeBillet {
  idTypeBillet?: number; // Assuming id is number (README says Long)
  libelleTypeBillet: string;
  prixTypeBillet: number; // README says Double
}

@Injectable({
  providedIn: 'root'
})
export class TypeBilletService {
  // Base URL from TypeBilletcontroller in README.md
  private baseUrl = '/tg/voyage_pro/reservation/auth/ticket'; 

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Method to be modified: GET /getAll
  getAllTypesBillet(): Observable<TypeBillet[]> {
    return this.http.get<any>(`${this.baseUrl}/getAll`) // Changed to <any>
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response as TypeBillet[];
          }
          if (typeof response === 'object' && response !== null && Object.keys(response).length === 0) {
            console.warn('TypeBillet API returned {} for a list request. Transforming to [].');
            return [] as TypeBillet[];
          }
          return response as TypeBillet[]; // Pass through other types
        }),
        catchError(this.handleError)
      );
  }

  // Example: POST /create 
  createTypeBillet(typeBilletData: TypeBillet): Observable<TypeBillet> {
    return this.http.post<TypeBillet>(`${this.baseUrl}/create`, typeBilletData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Example: GET /get/{id}
  getTypeBilletById(id: number): Observable<TypeBillet> { // README uses TypeBilletDTO for response here
    return this.http.get<TypeBillet>(`${this.baseUrl}/get/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Example: PUT /update/{idType}
  updateTypeBillet(idType: number, typeBilletData: TypeBillet): Observable<TypeBillet> { // README uses TypeBilletDTO
    return this.http.put<TypeBillet>(`${this.baseUrl}/update/${idType}`, typeBilletData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Example: DELETE /delete/{id}
  deleteTypeBillet(id: number): Observable<boolean> { // README says response is boolean
    return this.http.delete<boolean>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An API error occurred in TypeBilletService:', error);
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
