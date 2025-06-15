import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for Agent based on README.md entity description
export interface Agent {
  idAgent?: number; // Assuming idAgent is number, though README says Long
  nomAgent: string;
  prenomAgent?: string; // Max Length 75, so could be optional or empty string
  sexeAgent: string;   // Max Length 1
  dateNaiss: string;   // Format "dd/mm/yyyy", string is safer for transport
  telAgent: string;    // Max Length 20
  mailAgent: string;   // Max Length 20
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  // Assuming a base URL for Agent API, not found in README's API list
  private baseUrl = '/tg/voyage_pro/reservation/auth/agent'; 

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Method to be modified: GET /getAll (assumed endpoint)
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<any>(`${this.baseUrl}/getAll`) // Assuming '/getAll' endpoint, changed to <any>
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response as Agent[];
          }
          if (typeof response === 'object' && response !== null && Object.keys(response).length === 0) {
            console.warn('Agent API returned {} for a list request. Transforming to [].');
            return [] as Agent[];
          }
          return response as Agent[]; // Pass through other types
        }),
        catchError(this.handleError)
      );
  }

  // Example: POST /create (assumed endpoint)
  createAgent(agentData: Agent): Observable<Agent> {
    return this.http.post<Agent>(`${this.baseUrl}/create`, agentData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Example: GET /get/{idAgent} (assumed endpoint)
  getAgentById(idAgent: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}/get/${idAgent}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Example: PUT /update/{idAgent} (assumed endpoint)
  updateAgent(idAgent: number, agentData: Agent): Observable<Agent> {
    return this.http.put<Agent>(`${this.baseUrl}/update/${idAgent}`, agentData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Example: DELETE /delete/{idAgent} (assumed endpoint)
  deleteAgent(idAgent: number): Observable<any> { 
    return this.http.delete<any>(`${this.baseUrl}/delete/${idAgent}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An API error occurred in AgentService:', error);
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
