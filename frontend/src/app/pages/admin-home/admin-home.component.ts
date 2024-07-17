import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [SidebarComponent,NgClass,RouterOutlet],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
  providers:[AuthService]
})
export class AdminHomeComponent {
  isSidebarOpen = true;
  constructor(private tokenService:AuthService){}
  toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
  }
  logout(){
  this.tokenService.logout()
  }
}
