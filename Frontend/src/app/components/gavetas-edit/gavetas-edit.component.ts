import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { gaveta } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-gavetas-edit',
  standalone: false,
  templateUrl: './gavetas-edit.component.html',
  styleUrl: './gavetas-edit.component.css',
})
export class GavetasEditComponent implements OnInit {
  user: gaveta = {
    id_gaveta: null,
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
          this.router.navigate(['/gavetas']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.id_gaveta!, this.user, '/drawers').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/gavetas']);
      },
      error: (err) => alert(err),
    });
  }
}
