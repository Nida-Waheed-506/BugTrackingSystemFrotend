import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  bugShownLimit = new BehaviorSubject<number>(1);
  constructor(private http: HttpClient) {}

  createBug(formData: any) {
    return this.http.post(`${environment.url}/bug`, formData);
  }

  editBug(formData: any, bug_id: any) {
    return this.http.patch(`${environment.url}/bugs/${bug_id}`, formData);
  }
  deleteBug(bug_id: any, project_id: any) {
    const reqBody = { project_id };
    return this.http.delete(
      `${environment.url}/bugs/${bug_id}?project_id=${project_id}`
    );
  }
  getProjectBugs(project_id: any, page: any, limit: any) {
    return this.http.get(
      `${environment.url}/bugs?project_id=${project_id}&page=${
        page + 1
      }&limit=${limit}`
    );
  }

  changeStatus(project_id: any, status: any, bug_id: any) {
    const reqBody = { project_id, status };
    return this.http.patch(`${environment.url}/bugs/${bug_id}/status`, reqBody);
  }

  isQABelongToBug(project_id: any, bug_id: any) {
    return this.http.get(`${environment.url}/bugs/${bug_id}/${project_id}`);
  }
}
