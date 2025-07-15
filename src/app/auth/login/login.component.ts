import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  mostrarContrasena: boolean = false;

  constructor(private router: Router) {}

  /**
   * Navega a la pantalla de inicio tras hacer clic en "Iniciar"
   */
  onIniciarSesion(): void {
    // Aquí podrías agregar validaciones si lo deseas
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);

    this.router.navigate(['/inicio']);
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  toggleContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
