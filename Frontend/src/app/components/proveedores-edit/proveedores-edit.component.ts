import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { proveedor } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-proveedores-edit',
  standalone: false,
  templateUrl: './proveedores-edit.component.html',
  styleUrl: './proveedores-edit.component.css',
})
export class ProveedoresEditComponent implements OnInit {
  user: proveedor = {
    id_proveedor: null,
    nombre: null,
    telefono: null,
    n_cuenta: null,
    email: null,
  };

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/suppliers').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/proveedores']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.id_proveedor!, this.user, '/suppliers').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/proveedores']);
      },
      error: (err) => alert(err),
    });
  }
}
