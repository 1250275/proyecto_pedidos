import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { usuario } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';
import { ESTADOS_USUARIO } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-usuarios-edit',
  standalone: false,
  templateUrl: './usuarios-edit.component.html',
  styleUrl: './usuarios-edit.component.css',
})
export class UsuariosEditComponent implements OnInit {
  user: usuario = {
    id_usuario: null,
    nombre_empleado: null,
    nombre_usuario: null,
    rol: null,
    estado: null,
  };
  Rollist: string[] = [];
  estados = ESTADOS_USUARIO;
  contrasenaNueva = '';
  esPropio = false;

  constructor(
    private Data: DataService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.Data.getDropListRoles().subscribe((data: any) => (this.Rollist = data));
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.esPropio = Number(params['id']) === this.auth.usuario?.id_usuario;
      this.Data.getOne(params['id'], '/users').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/usuarios']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    const cambios = { nombre_usuario: this.user.nombre_usuario, rol: this.user.rol, estado: this.user.estado };
    this.Data.update(this.user.id_usuario!, cambios, '/users').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/usuarios']);
      },
      error: (err) => alert(err),
    });
  }

  RestablecerContrasena(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.id_usuario + '/password', { contrasena_nueva: this.contrasenaNueva }, '/users').subscribe({
      next: () => {
        alert('Contraseña restablecida');
        f.resetForm();
      },
      error: (err) => alert(err),
    });
  }
}
