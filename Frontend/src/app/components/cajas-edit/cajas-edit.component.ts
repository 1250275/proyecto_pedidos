import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { caja } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-cajas-edit',
  standalone: false,
  templateUrl: './cajas-edit.component.html',
  styleUrl: './cajas-edit.component.css',
})
export class CajasEditComponent implements OnInit {
  user: caja = {
    id_caja: null,
    monto_dinero: null,
  };

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/drawers').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/cajas']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.id_caja!, this.user, '/drawers').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/cajas']);
      },
      error: (err) => alert(err),
    });
  }
}
