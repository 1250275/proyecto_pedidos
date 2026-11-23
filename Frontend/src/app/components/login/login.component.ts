import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Login } from '../../Interfaces/user';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user: Login = {
    nombre_usuario: null,
    contrasena: null,
  };
  mensajeError = '';
  cargando = false;

  constructor(private auth: AuthService, private router: Router) {}

  IniciarSesion() {
    this.mensajeError = '';
    if (!this.user.nombre_usuario || !this.user.contrasena) {
      this.mensajeError = 'Digite el usuario y la contraseña';
      return;
    }
    this.cargando = true;
    this.auth.login(this.user).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError =
          err.status === 0 ? 'No se pudo conectar con el servidor' : err.error?.message || 'Error al iniciar sesión';
        this.user.contrasena = null;
      },
    });
  }
}
