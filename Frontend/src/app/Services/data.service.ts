import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  API_URI = 'http://127.0.0.1:3000/api';

  constructor(private http: HttpClient) {}

  getAll(url: string): Observable<any> {
    return this.http.get(`${this.API_URI}` + url).pipe(catchError(this.errorHandl));
  }

  getOne(id: string | number, url: string): Observable<any> {
    return this.http.get(`${this.API_URI}` + url + `/${id}`).pipe(catchError(this.errorHandl));
  }

  delete(id: string | number, url: string): Observable<any> {
    return this.http.delete(`${this.API_URI}` + url + `/${id}`).pipe(catchError(this.errorHandl));
  }

  update(id: string | number, updated: any, url: string): Observable<any> {
    return this.http
      .post(`${this.API_URI}` + url + `/${id}`, this.limpiar(updated))
      .pipe(catchError(this.errorHandl));
  }

  save(registro: any, url: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http
      .post(`${this.API_URI}` + url, JSON.stringify(this.limpiar(registro)), { headers: headers })
      .pipe(catchError(this.errorHandl));
  }

  getDropListClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URI + '/customers');
  }

  getDropListEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URI + '/employees');
  }

  getDropListGavetas(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URI + '/drawers');
  }

  getDropListProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URI + '/products');
  }

  getDropListProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URI + '/suppliers');
  }

  getDropListPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URI + '/orders');
  }

  getDropListRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.API_URI + '/roles');
  }

  private limpiar(registro: any) {
    const datos: any = {};
    for (const campo in registro) {
      const valor = registro[campo];
      datos[campo] = typeof valor === 'string' && valor.trim() === '' ? null : valor;
    }
    return datos;
  }

  errorHandl(error: any) {
    let errorMessage = '';
    const codigo = error.error?.code;
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (codigo === 'ER_ROW_IS_REFERENCED_2' || codigo === 'ER_ROW_IS_REFERENCED') {
      errorMessage = 'No se puede eliminar: el registro está siendo usado en otra tabla';
    } else if (codigo === 'ER_DUP_ENTRY') {
      const valor = /Duplicate entry '(.*)' for key/.exec(error.error.sqlMessage ?? '')?.[1];
      errorMessage = 'Ya existe un registro con ' + (valor ? 'el valor "' + valor + '"' : 'esos datos');
    } else if (codigo === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      errorMessage = 'Los datos no cumplen las reglas de la tabla: ' + (error.error.sqlMessage ?? '');
    } else if (error.error?.sqlMessage) {
      errorMessage = error.error.sqlMessage;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor';
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }
}
