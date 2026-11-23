import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { comprobante } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-comprobantes',
  standalone: false,
  templateUrl: './comprobantes.component.html',
  styleUrl: './comprobantes.component.css',
})
export class ComprobantesComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: comprobante = {
    codigo_comprobante: null,
    id_pedido: null,
  };
  Pedidolist: any = [];
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/comprobantes');
    this.esAdmin = this.auth.esAdmin;
    this.Data.getDropListPedidos().subscribe((data: any) => (this.Pedidolist = data));
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/receipts').subscribe({
      next: (res) => {
        this.TUser = res;
        this.user.codigo_comprobante = this.siguienteCodigo();
      },
      error: (err) => console.error(err),
    });
  }

  get pedidosSinComprobante() {
    return this.Pedidolist.filter((p: any) => !this.TUser.some((c: any) => c.id_pedido === p.id_pedido));
  }

  totalPedido(id: number) {
    return this.Pedidolist.find((p: any) => p.id_pedido === id)?.total;
  }

  siguienteCodigo(): string {
    const numeros = this.TUser.map((c: any) => Number(c.codigo_comprobante.split('-').pop()) || 0);
    const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
    return '000-001-01-' + String(siguiente).padStart(8, '0');
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    this.Data.save(this.user, '/receipts').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(codigo: string) {
    if (!confirm('¿Desea eliminar el comprobante ' + codigo + '?')) return;
    this.Data.delete(codigo, '/receipts').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
