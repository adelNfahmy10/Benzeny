import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-setting-benzeny',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './setting-benzeny.component.html',
  styleUrl: './setting-benzeny.component.css'
})
export class SettingBenzenyComponent {
    test():void{
        console.log('yes');

    }
}
