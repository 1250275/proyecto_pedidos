import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExportService } from '../../Services/export.service';

@Component({
  selector: 'app-barra-tabla',
  standalone: false,
  templateUrl: './barra-tabla.component.html',
  styleUrl: './barra-tabla.component.css',
})
export class BarraTablaComponent {
  @Input() titulo = 'Reporte';
  @Input() tabla = 'tabla';
  @Input() filtro = '';
  @Output() filtroChange = new EventEmitter<string>();
  generandoPdf = false;

  constructor(private exportar: ExportService) {}

  cambiarFiltro(valor: string) {
    this.filtro = valor;
    this.filtroChange.emit(valor);
  }

  exportToExcel() {
    this.exportar.exportToExcel(this.tabla, this.titulo);
  }

  async openPDF() {
    this.generandoPdf = true;
    try {
      await this.exportar.openPDF(this.tabla, this.titulo);
    } finally {
      this.generandoPdf = false;
    }
  }
}
