import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: false,
})
export class FiltroPipe implements PipeTransform {
  transform(value: any[], arg: string, textoFila?: (fila: any) => string): any[] {
    if (!value) return [];
    if (!arg || arg.trim() === '') return value;
    const buscado = this.normalizar(arg);
    const resultPosts = [];
    for (const post of value) {
      const texto = textoFila ? textoFila(post) : Object.values(post).join(' ');
      if (this.normalizar(texto).indexOf(buscado) > -1) {
        resultPosts.push(post);
      }
    }
    return resultPosts;
  }

  private normalizar(texto: string): string {
    return String(texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }
}
