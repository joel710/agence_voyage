import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define interfaces for your DTOs/Entities
// As per subtask, we'll be working with 'Client[]', let's assume ClientDTO is the Client model.
export interface Client { 
  idClient?: number;
  nomClient: string;
  prenomClient: string;
  dateNaiss: string;
  mailClient: string;
  telClient: string;
  sexeClient: string;
  login: string;
  password?: string; 
}

// This was the original Client interface in the guide, keeping ClientDTO as Client for now.
// export interface ClientEntity { // Renamed to avoid conflict if both were needed
//   idClient?: number;
//   nomClient: string;
//   prenomClient: string;
//   dateNaiss: string; 
//   mailClient: string;
//   telClient: string;
//   sexeClient: string;
//   login: string;
//   password?: string; 
// }

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = '/tg/voyage_pro/reservation/auth/client'; 

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // POST /create (expects full CLIENT object - assuming ClientEntity here)
  createClient(clientData: Client): Observable<Client> { // Changed ClientEntity to Client
    return this.http.post<Client>(`${this.baseUrl}/create`, clientData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // GET /getAll
  getAllClients(): Observable<Client[]> { // Changed ClientDTO[] to Client[]
    return this.http.get<any>(`${this.baseUrl}/getAll`) // Changed to <any>
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response as Client[];
          }
          if (typeof response === 'object' && response !== null && Object.keys(response).length === 0) {
            console.warn(`Client API returned {} for a list request. Transforming to [].`);
            return [] as Client[];
          }
          // If the original type was Client[], and we get here, it means response is not an array
          // and not an empty object. This could be an actual error or unexpected type.
          // For safety, and to match original behavior if http.get<Client[]> would have errored,
          // one might consider throwing an error here or ensuring it's castable.
          // However, to strictly address the reported issue of {} vs [], we'll pass it through
          // and assume other types would be handled by subsequent logic or are out of scope for this specific fix.
          return response as Client[]; 
        }),
        catchError(this.handleError)
      );
  }

  // GET /get/{idClient}
  getClientById(idClient: number): Observable<Client> { // Changed ClientDTO to Client
    return this.http.get<Client>(`${this.baseUrl}/get/${idClient}`) // Changed ClientDTO to Client
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT /update/{idClient} (expects ClientDTO)
  updateClient(idClient: number, clientData: Client): Observable<Client> { // Changed ClientDTO to Client
    return this.http.put<Client>(`${this.baseUrl}/update/${idClient}`, clientData, this.httpOptions) // Changed ClientDTO to Client
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE /delete/{idClient}
  deleteClient(idClient: number): Observable<any> { 
    return this.http.delete<any>(`${this.baseUrl}/delete/${idClient}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // PUT /search (expects ClientDTO for criteria)
  searchClients(searchCriteria: Client): Observable<Client[]> { // Changed ClientDTO to Client
    return this.http.put<Client[]>(`${this.baseUrl}/search`, searchCriteria, this.httpOptions) // Changed ClientDTO[] to Client[]
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An API error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
