import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/shared/services/auth/session.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriaUsuarioService {
    url = `${environment.apiUrl}/categoria-usuario`;

    constructor(
        private http: HttpClient,
    ) {}

    public findAll(idUser: number, idCategoria: number): Observable<any> {
        return this.http.get(`${this.url}/list/?idUser=${idUser}&idCategoria=${idCategoria}`)
    }

    public findOneById(id: number): Observable<any> {
        return this.http.get(`${this.url}/${id}`)
    }

    public create(data: any): Observable<any> {
        return this.http.post(`${this.url}`, data)
    }

    public update(id: number, data: any): Observable<any> {
        return this.http.patch(`${this.url}/${id}`, data)
    }

    public delete(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`)
    }
}