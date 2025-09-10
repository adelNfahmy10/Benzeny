import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = (route, state) => {
    const _Router = inject(Router)
    const _PLATFORM_ID = inject(PLATFORM_ID)
    const role = localStorage.getItem('role')

    if(isPlatformBrowser(_PLATFORM_ID)){
      if(localStorage.getItem('token') !== null){
        if(role == 'Benzeny'){
            _Router.navigate(['/benzeny-dashboard'])
        } else if(role == 'CompanyOwner' || role == 'Admin' ){
            _Router.navigate(['/company-dashboard'])
        } else if(role == 'BranchManager'){
            _Router.navigate(['/branch-dashboard'])
        }
        return false
      } else {
        return true
      }
    } else{
      return false
    }
};
