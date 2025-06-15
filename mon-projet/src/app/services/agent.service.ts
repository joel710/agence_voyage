import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
    return this.http.get<any[]>(`${this.baseUrl}`) // Changed to any[] to allow map to inspect
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response as AgentDTO[];
          }
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}. Transforming to []. Consider fixing the API.`);
            return [] as AgentDTO[];
          }
          // This case should ideally not be reached if API respects contract or HttpClient errors first
          console.warn(`Unexpected response type for GET ${this.baseUrl}. Expected AgentDTO[], got:`, response);
          return [] as AgentDTO[]; // Fallback to empty array, or throw error
        }),
        catchError(this.handleError)
      );
  }

  // GET /agents/{idAgent} (assumed endpoint)
  getAgentById(idAgent: number): Observable<AgentDTO | null> {
    return this.http.get<any>(`${this.baseUrl}/${idAgent}`) // Changed to any to allow map to inspect
      .pipe(
        map((response: any) => {
          if (response && typeof response === 'object' && Object.keys(response).length === 0) {
            console.warn(`API returned {} for GET ${this.baseUrl}/${idAgent}. Transforming to null. Consider fixing the API to return 404.`);
            return null;
          }
          // If response is not an empty object, assume it's a valid AgentDTO
          // Potentially add more checks here if API can return other non-DTO shapes with 200 OK
          if (response && typeof response === 'object' && response.idAgent !== undefined) { // Basic check
            return response as AgentDTO;
          }
          // If it's not an empty object and not a recognizable AgentDTO, it's an unexpected response
          // For a getById, this might mean an error or an unexpected valid response.
          // Returning null or throwing an error might be appropriate.
          // If API guarantees 404 for not found, this path (for 200 OK) suggests malformed data.
          if (response === null) return null; // If API explicitly returns null for 200 OK
          console.warn(`Unexpected response type for GET ${this.baseUrl}/${idAgent}. Expected AgentDTO or empty {}, got:`, response);
          // Decide: throw error, or return null? Returning null for now.
          return null;
        }),
        catchError(this.handleError)
      );
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
