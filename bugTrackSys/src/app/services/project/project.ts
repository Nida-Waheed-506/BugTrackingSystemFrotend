import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projectsInfo$ = new BehaviorSubject<any[]>([]);
  projects$ = new BehaviorSubject<any[]>([]);
  projectsShownLimit = new BehaviorSubject<number>(1);
  constructor(private http: HttpClient) {}

  //  add the project

  addProject(formData: any) {
    return this.http.post(`${environment.url}/project`, formData);
  }

  // get all the projects

  getProjects(page: any, limit: any) {
    return this.http.get(
      `${environment.url}/projects?page=${page + 1}&limit=${limit}`
    );
  }

  // assign project

  assignUserToProject(email: string, project_id: any) {
    const reqBody = { email };
    return this.http.post(
      `${environment.url}/projects/${project_id}/assign`,
      reqBody
    );
  }

  //  get top 4 developers in a project

  getTopDevelopers(project_id: any) {
    return this.http.get(
      `${environment.url}/projects/${project_id}/users/developers`
    );
  }

  getDevByName(searchingName: any, project_id: any) {
    return this.http.get(
      `${environment.url}/projects/${project_id}/users/developers?search=${searchingName}`
    );
  }

  isManagerBelongToProject(project_id: any) {
    return this.http.get(`${environment.url}/projects/${project_id}`);
  }

  isQABelongToProject(project_id: any) {
    return this.http.get(`${environment.url}/bugs/${project_id}`);
  }
}
