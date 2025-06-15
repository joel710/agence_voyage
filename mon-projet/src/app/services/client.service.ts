import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for Client Data Transfer Object (used for GET, PUT responses)
export interface ClientDTO {
  idClient?: number;
  nomClient: string;
  prenomClient: string;
  dateNaiss: string; // Expected as yyyy-MM-dd string for API
  mailClient: string;
  telClient: string;
  sexeClient: 'Homme' | 'Femme' | 'Autre' | ''; // Aligned with modal
  login: string;
  password?: string; // Optional in DTOs, e.g., not returned in GET all
}

// Interface for Client entity (potentially used for POST create, may have stricter password rules)
// Based on user doc, POST /create expects a CLIENT object, not ClientDTO.
export interface Client {
  idClient?: number;
  nomClient: string;
  prenomClient: string;
  dateNaiss: string; // Expected as yyyy-MM-dd string for API
  mailClient: string;
  telClient: string;
  sexeClient: 'Homme' | 'Femme' | 'Autre' | ''; // Aligned with modal
  login: string;
  password?: string; // API doc implies this is part of CLIENT object for creation
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = '/tg/voyage_pro/reservation/auth/client'; // Base URL from API documentation

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // POST /create (expects full CLIENT object)
  createClient(clientData: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/create`, clientData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // GET /getAll
  getAllClients(): Observable<ClientDTO[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAll`) // Changed to any[] to allow map to inspect
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response as ClientDTO[];
          }
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/getAll. Transforming to []. Consider fixing the API.`);
            return [] as ClientDTO[];
          }
          console.warn(`Unexpected response type for GET ${this.baseUrl}/getAll. Expected ClientDTO[], got:`, response);
          return [] as ClientDTO[]; // Fallback or throw
        }),
        catchError(this.handleError)
      );
  }

  // GET /get/{idClient}
  getClientById(idClient: number): Observable<ClientDTO | null> {
    return this.http.get<any>(`${this.baseUrl}/get/${idClient}`) // Changed to any to allow map to inspect
      .pipe(
        map((response: any) => {
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/get/${idClient}. Transforming to null. Consider fixing the API to return 404.`);
            return null;
          }
          if (response && typeof response === 'object' && response.idClient !== undefined) { // Basic check
            return response as ClientDTO;
          }
          if (response === null) return null;
          console.warn(`Unexpected response type for GET ${this.baseUrl}/get/${idClient}. Expected ClientDTO or empty {}, got:`, response);
          return null;
        }),
        catchError(this.handleError)
      );
  }

  // PUT /update/{idClient} (expects ClientDTO)
  updateClient(idClient: number, clientData: ClientDTO): Observable<ClientDTO> {
    return this.http.put<ClientDTO>(`${this.baseUrl}/update/${idClient}`, clientData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE /delete/{idClient}
  deleteClient(idClient: number): Observable<any> { // Response type might vary
    return this.http.delete<any>(`${this.baseUrl}/delete/${idClient}`, this.httpOptions) // Added httpOptions for consistency, though DELETE might not need Content-Type
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT /search (expects ClientDTO for criteria)
  searchClients(searchCriteria: Partial<ClientDTO>): Observable<ClientDTO[]> {
    return this.http.put<any[]>(`${this.baseUrl}/search`, searchCriteria, this.httpOptions) // Changed to any[]
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response as ClientDTO[];
          }
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for PUT ${this.baseUrl}/search. Transforming to []. Consider fixing the API.`);
            return [] as ClientDTO[];
          }
          console.warn(`Unexpected response type for PUT ${this.baseUrl}/search. Expected ClientDTO[], got:`, response);
          return [] as ClientDTO[]; // Fallback or throw
        }),
        catchError(this.handleError)
      );
  }

  // Basic error handler
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened with Client API; please try again later.'));
  }
}
