import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = (route, state) => {
    const _Router = inject(Router)
    const _PLATFORM_ID = inject(PLATFORM_ID)
    const role = localStorage.getItem('role')
    const mainRole = localStorage.getItem('roles')?.split(',').map(r => r.trim()) || [];

    if(isPlatformBrowser(_PLATFORM_ID)){
      if(localStorage.getItem('token') !== null){
        if(mainRole.includes('BSuperAdmin')){
            _Router.navigate(['/benzeny-dashboard'])
        } else if(mainRole.includes('CompanyOwner') || mainRole.includes('Admin') ){
            _Router.navigate(['/company-dashboard'])
        } else if(mainRole.includes('BranchManager') ){
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
