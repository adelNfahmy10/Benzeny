import { Component, Input } from '@angular/core';
import { IconModule } from '../icon/icon.module';

@Component({
  selector: 'app-btn-add',
  standalone: true,
  imports: [IconModule],
  templateUrl: './btn-add.component.html',
  styleUrl: './btn-add.component.css'
})
export class BtnAddComponent{
    @Input() btnText:string = ''
    @Input() disabled: boolean = false;
}
