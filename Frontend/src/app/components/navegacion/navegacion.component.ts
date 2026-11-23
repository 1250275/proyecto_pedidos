import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { GrupoMenu } from '../../constants/roles';

@Component({
  selector: 'app-navegacion',
  standalone: false,
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css',
})
export class NavegacionComponent implements OnInit {
  menuAbierto = false;
  grupos: GrupoMenu[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.grupos = this.auth.menuPermitido();
  }

  CerrarSesion() {
    this.menuAbierto = false;
    this.auth.logout();
  }
}
