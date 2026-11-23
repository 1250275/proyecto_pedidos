import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, catchError, map, tap, switchMap } from 'rxjs';
import { DataService } from './data.service';
import { Login, UsuarioSesion } from '../Interfaces/user';
import { ROLES, MENU, GrupoMenu } from '../constants/roles';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuario: UsuarioSesion | null = null;
  private sesionRevisada = false;

  constructor(private http: HttpClient, private data: DataService, private router: Router) {}

  private get url() {
    return this.data.API_URI + '/auth';
  }

  login(credenciales: Login): Observable<UsuarioSesion> {
    return this.http.post<any>(this.url + '/login', credenciales).pipe(
      switchMap(() => this.cargarUsuario()),
      map((usuario) => usuario as UsuarioSesion),
    );
  }

  logout(): void {
    this.http.post(this.url + '/logout', {}).subscribe({
      complete: () => this.terminarSesion(),
      error: () => this.terminarSesion(),
    });
  }

  terminarSesion(): void {
    this.usuario = null;
    this.sesionRevisada = true;
    this.router.navigate(['/login']);
  }

  cargarUsuario(): Observable<UsuarioSesion | null> {
    return this.http.get<UsuarioSesion>(this.url + '/me').pipe(
      tap((usuario) => {
        this.usuario = usuario;
        this.sesionRevisada = true;
      }),
      catchError(() => {
        this.usuario = null;
        this.sesionRevisada = true;
        return of(null);
      }),
    );
  }

  verificarSesion(): Observable<boolean> {
    if (this.usuario) return of(true);
    if (this.sesionRevisada) return of(false);
    return this.cargarUsuario().pipe(map((usuario) => usuario !== null));
  }

  menuPermitido(): GrupoMenu[] {
    return MENU.map((g) => ({ ...g, opciones: g.opciones.filter((o) => this.tieneRol(o.ver)) })).filter(
      (g) => g.opciones.length > 0,
    );
  }

  tieneRol(roles: readonly string[] | undefined): boolean {
    if (!roles) return true;
    return !!this.usuario && roles.includes(this.usuario.rol);
  }

  puedeEscribir(ruta: string): boolean {
    const opcion = MENU.flatMap((g) => g.opciones).find((o) => o.ruta === ruta);
    return !!opcion && this.tieneRol(opcion.escribir);
  }

  get esAdmin(): boolean {
    return this.usuario?.rol === ROLES.ADMIN;
  }
}
