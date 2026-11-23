import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToExcel(idTabla: string, titulo: string): void {
    const element = document.getElementById(idTabla);
    if (!element) return;
    element.classList.add('exportando');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { display: true, raw: true });
    element.classList.remove('exportando');
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, titulo.slice(0, 31));
    XLSX.writeFile(book, this.nombreArchivo(titulo) + '.xlsx');
  }

  async openPDF(idTabla: string, titulo: string): Promise<void> {
    const DATA = document.getElementById(idTabla);
    if (!DATA) return;
    DATA.classList.add('exportando');
    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(DATA, { scale: 2, width: DATA.scrollWidth, windowWidth: DATA.scrollWidth + 40 });
    } finally {
      DATA.classList.remove('exportando');
    }

    const horizontal = canvas.width > canvas.height * 1.2;
    const PDF = new jsPDF(horizontal ? 'l' : 'p', 'mm', 'a4');
    const margen = 10;
    const anchoPagina = PDF.internal.pageSize.getWidth();
    const altoPagina = PDF.internal.pageSize.getHeight();
    const fileWidth = anchoPagina - margen * 2;
    const fileHeight = (canvas.height * fileWidth) / canvas.width;
    const inicioTabla = 24;

    PDF.setFontSize(14);
    PDF.setTextColor(170, 14, 27);
    PDF.text(titulo, margen, 14);
    PDF.setFontSize(9);
    PDF.setTextColor(90, 90, 90);
    PDF.text('Generado el ' + new Date().toLocaleString('es-HN'), margen, 19);

    const FILEURI = canvas.toDataURL('image/jpeg', 0.92);
    const taparMargenes = (conSuperior: boolean) => {
      PDF.setFillColor(255, 255, 255);
      PDF.rect(0, altoPagina - margen, anchoPagina, margen, 'F');
      if (conSuperior) PDF.rect(0, 0, anchoPagina, margen, 'F');
    };

    PDF.addImage(FILEURI, 'JPEG', margen, inicioTabla, fileWidth, fileHeight);
    taparMargenes(false);
    let mostrado = altoPagina - margen - inicioTabla;
    while (mostrado < fileHeight) {
      PDF.addPage();
      PDF.addImage(FILEURI, 'JPEG', margen, margen - mostrado, fileWidth, fileHeight);
      taparMargenes(true);
      mostrado += altoPagina - margen * 2;
    }
    PDF.save(this.nombreArchivo(titulo) + '.pdf');
  }

  ticket(venta: any): void {
    const ancho = 80;
    const margen = 5;
    const derecha = ancho - margen;
    const dinero = (valor: any) => 'L ' + Number(valor).toFixed(2);
    const medidor = new jsPDF();
    medidor.setFontSize(8);
    const lineasProducto = venta.productos.map((p: any) => medidor.splitTextToSize(p.nombre, ancho - margen * 2));
    const alto = 92 + lineasProducto.reduce((suma: number, l: string[]) => suma + l.length * 3.6 + 4.5, 0) + (venta.efectivo != null ? 9 : 0);

    const PDF = new jsPDF('p', 'mm', [ancho, alto]);
    let y = 9;
    const linea = () => {
      PDF.setDrawColor(150, 150, 150);
      PDF.setLineDashPattern([1, 1], 0);
      PDF.line(margen, y, derecha, y);
      y += 4.5;
    };
    const fila = (izquierda: string, valor: string, negrita = false) => {
      PDF.setFont('helvetica', negrita ? 'bold' : 'normal');
      PDF.text(izquierda, margen, y);
      PDF.text(valor, derecha, y, { align: 'right' });
      y += 4.2;
    };

    PDF.setTextColor(170, 14, 27);
    PDF.setFont('helvetica', 'bold');
    PDF.setFontSize(12);
    PDF.text('SISTEMA DE PEDIDOS', ancho / 2, y, { align: 'center' });
    y += 5;
    PDF.setTextColor(40, 40, 40);
    PDF.setFont('helvetica', 'normal');
    PDF.setFontSize(8);
    PDF.text('Comprobante ' + venta.codigo_comprobante, ancho / 2, y, { align: 'center' });
    y += 6;

    fila('Pedido No.', String(venta.id_pedido));
    fila('Fecha', venta.fecha_hora);
    fila('Cliente', venta.cliente);
    fila('DNI', venta.dni_cliente);
    fila('Atendió', venta.cajero.trim());
    fila('Gaveta', String(venta.id_gaveta));
    y += 1;
    linea();

    venta.productos.forEach((p: any, i: number) => {
      PDF.setFont('helvetica', 'bold');
      for (const texto of lineasProducto[i]) {
        PDF.text(texto, margen, y);
        y += 3.6;
      }
      fila('  ' + p.cantidad + ' x ' + dinero(p.precio_unitario), dinero(p.sub_total));
      y += 0.3;
    });
    linea();

    PDF.setFontSize(11);
    fila('TOTAL', dinero(venta.total), true);
    y += 1;
    PDF.setFontSize(8);
    if (venta.efectivo != null) {
      fila('Efectivo', dinero(venta.efectivo));
      fila('Cambio', dinero(venta.cambio));
    }
    y += 2;
    linea();
    PDF.setFont('helvetica', 'normal');
    PDF.text('¡Gracias por su compra!', ancho / 2, y + 1, { align: 'center' });

    PDF.save('Ticket_' + venta.codigo_comprobante + '.pdf');
  }

  private nombreArchivo(titulo: string): string {
    const fecha = new Date().toISOString().slice(0, 10);
    return titulo.replace(/\s+/g, '_') + '_' + fecha;
  }
}
