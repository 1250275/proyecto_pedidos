import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { empleado } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-empleados-edit',
  standalone: false,
  templateUrl: './empleados-edit.component.html',
  styleUrl: './empleados-edit.component.css',
})
export class EmpleadosEditComponent implements OnInit {
  user: empleado = {
    id_empleado: null,
    nombre: null,
    apellidos: null,
    dni: null,
    email: null,
    cargo: null,
    fecha_ingreso: null,
    fecha_nacimiento: null,
  };

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/employees').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/empleados']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.id_empleado!, this.user, '/employees').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/empleados']);
      },
      error: (err) => alert(err),
    });
  }
}
