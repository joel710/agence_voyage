import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface for Agent Data Transfer Object
// Based on the AGENT entity and aligned AgentData from the modal
export interface AgentDTO {
  idAgent?: number;
  nomAgent: string;
  prenomAgent: string; // Was prenomAgent in entity, kept for consistency
  sexeAgent: 'Homme' | 'Femme' | 'Autre' | ''; // Matching modal's AgentData
  dateNaiss?: string; // yyyy-MM-dd
  telAgent?: string;
  mailAgent: string;
  role: 'Agent' | 'Admin' | ''; // Added role to match modal's AgentData & dashboard display needs
}

// Interface for Agent entity (for POST create, if different from DTO, e.g. required fields)
// For now, assuming AgentDTO can be used for creation payload as well,
// unless specific API requirements for AGENT creation emerge.
// If password or other specific fields are needed for creation, define a separate AgentCreateDTO or similar.

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  // Assuming a base URL similar to other entities
  private baseUrl = '/tg/voyage_pro/reservation/auth/agent';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // GET /agents (assumed endpoint)
  getAllAgents(): Observable<AgentDTO[]> {
    return this.http.get<AgentDTO[]>(`${this.baseUrl}`) // Assuming GET all is at base URL
      .pipe(catchError(this.handleError));
  }

  // GET /agents/{idAgent} (assumed endpoint)
  getAgentById(idAgent: number): Observable<AgentDTO> {
    return this.http.get<AgentDTO>(`${this.baseUrl}/${idAgent}`)
      .pipe(catchError(this.handleError));
  }

  // POST /agents (assumed endpoint)
  createAgent(agentData: AgentDTO): Observable<AgentDTO> { // Assuming AgentDTO is used for creation
    return this.http.post<AgentDTO>(`${this.baseUrl}`, agentData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // PUT /agents/{idAgent} (assumed endpoint)
  updateAgent(idAgent: number, agentData: AgentDTO): Observable<AgentDTO> {
    return this.http.put<AgentDTO>(`${this.baseUrl}/${idAgent}`, agentData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // DELETE /agents/{idAgent} (assumed endpoint)
  deleteAgent(idAgent: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${idAgent}`, this.httpOptions)
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
    return throwError(() => new Error('Something bad happened with Agent API; please try again later.'));
  }
}
