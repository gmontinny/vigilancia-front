import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, CreateUsuarioRequest } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  create(request: CreateUsuarioRequest): Observable<Usuario> {
    const formData = new FormData();
    
    // Adiciona os dados do usuário como JSON
    formData.append('usuario', JSON.stringify(request.usuario));
    
    // Adiciona a imagem se fornecida
    if (request.imagem) {
      formData.append('imagem', request.imagem);
    }

    return this.http.post<Usuario>(this.apiUrl, formData);
  }
}