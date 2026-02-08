import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';

@Component({
  selector: 'app-benzeny-onboarding-details',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './benzeny-onboarding-details.component.html',
  styleUrl: './benzeny-onboarding-details.component.css'
})
export class BenzenyOnboardingDetailsComponent {

}
