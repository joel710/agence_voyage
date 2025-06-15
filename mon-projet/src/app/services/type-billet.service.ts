import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    return this.http.get<TypeBilletDTO[]>(`${this.baseUrl}/getAll`)
      .pipe(catchError(this.handleError));
  }

  // GET /get/{id} (API returns TypeBilletDTO)
  getTypeBilletById(idTypeBillet: number): Observable<TypeBilletDTO> {
    return this.http.get<TypeBilletDTO>(`${this.baseUrl}/get/${idTypeBillet}`)
      .pipe(catchError(this.handleError));
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
    return this.http.delete<boolean>(`${this.baseUrl}/delete/${idTypeBillet}`, this.httpOptions)
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
    return throwError(() => new Error('Something bad happened with TypeBillet API; please try again later.'));
  }
}
