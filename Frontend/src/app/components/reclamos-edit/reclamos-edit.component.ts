import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { reclamo } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { TIPOS_RECLAMO } from '../reclamos/reclamos.component';

@Component({
  selector: 'app-reclamos-edit',
  standalone: false,
  templateUrl: './reclamos-edit.component.html',
  styleUrl: './reclamos-edit.component.css',
})
export class ReclamosEditComponent implements OnInit {
  user: reclamo = {
    id_reclamo: null,
    observaciones: null,
    tipo_reclamo: null,
    dni_cliente: null,
    id_empleado: null,
  };
  Clientelist: any = [];
  Empleadolist: any = [];
  tipos = TIPOS_RECLAMO;

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.Data.getDropListClientes().subscribe((data: any) => (this.Clientelist = data));
    this.Data.getDropListEmpleados().subscribe((data: any) => (this.Empleadolist = data));

    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/complaints').subscribe({
        next: (res) => {
          this.user = res;
          if (res.tipo_reclamo && !this.tipos.includes(res.tipo_reclamo)) this.tipos = [...this.tipos, res.tipo_reclamo];
        },
        error: (err) => {
          alert(err);
          this.router.navigate(['/reclamos']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.id_reclamo!, this.user, '/complaints').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/reclamos']);
      },
      error: (err) => alert(err),
    });
  }
}
