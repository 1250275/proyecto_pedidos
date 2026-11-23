import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { GrupoMenu } from '../../constants/roles';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  grupos: GrupoMenu[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.grupos = this.auth.menuPermitido();
  }

  puedeEscribir(roles: string[]): boolean {
    return this.auth.tieneRol(roles);
  }
}
