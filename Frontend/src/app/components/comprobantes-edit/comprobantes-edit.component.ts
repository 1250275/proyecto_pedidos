import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { comprobante } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-comprobantes-edit',
  standalone: false,
  templateUrl: './comprobantes-edit.component.html',
  styleUrl: './comprobantes-edit.component.css',
})
export class ComprobantesEditComponent implements OnInit {
  user: comprobante = {
    codigo_comprobante: null,
    id_pedido: null,
  };
  Pedidolist: any = [];
  ocupados: number[] = [];

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.Data.getDropListPedidos().subscribe((data: any) => (this.Pedidolist = data));
    this.Data.getAll('/receipts').subscribe((data: any) => (this.ocupados = data.map((c: any) => c.id_pedido)));

    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/receipts').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/comprobantes']);
        },
      });
    }
  }

  get pedidosDisponibles() {
    return this.Pedidolist.filter((p: any) => p.id_pedido === this.user.id_pedido || !this.ocupados.includes(p.id_pedido));
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.codigo_comprobante!, { id_pedido: this.user.id_pedido }, '/receipts').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/comprobantes']);
      },
      error: (err) => alert(err),
    });
  }
}
