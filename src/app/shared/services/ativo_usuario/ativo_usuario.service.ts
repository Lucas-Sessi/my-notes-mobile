import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AtivoUsuarioService {
    url = `${environment.apiUrl}/ativo-usuario`;

    constructor(
        private http: HttpClient,
    ) {}

    public findAll(idUser: number, idCategoria: number): Observable<any> {
        return this.http.get(`${this.url}/list/category/${idCategoria}?idUser=${idUser}`)
    }

    public findOneById(id: number): Observable<any> {
        return this.http.get(`${this.url}/find/${id}`)
    }

    public create(data: any): Observable<any> {
        return this.http.post(`${this.url}/create`, data)
    }
    
    public calcularAporte(data: any): Observable<any> {
        return this.http.post(`${this.url}/calcular/aporte`, data)
    }

    public update(id: number, data: any): Observable<any> {
        return this.http.patch(`${this.url}/update/${id}`, data)
    }

    public delete(id: number): Observable<any> {
        return this.http.delete(`${this.url}/delete/${id}`)
    }
}