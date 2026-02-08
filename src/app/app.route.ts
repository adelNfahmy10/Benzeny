import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AnalyticsComponent } from './analytics';
import { FinanceComponent } from './finance';
import { CryptoComponent } from './crypto';

// widgets
import { WidgetsComponent } from './widgets';

// tables
import { TablesComponent } from './tables';

// font-icons
import { FontIconsComponent } from './font-icons';

// charts
import { ChartsComponent } from './charts';

// dragndrop
import { DragndropComponent } from './dragndrop';

// layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

// pages
import { KnowledgeBaseComponent } from './pages/knowledge-base';
import { FaqComponent } from './pages/faq';
import { CompaniesComponent } from './companies/companies.component';
import { UsersCompanyComponent } from './users-company/users-company.component';
import { BranchesComponent } from './branches/branches.component';
import { CarsComponent } from './cars/cars.component';
import { SettingBenzenyComponent } from './setting-benzeny/setting-benzeny.component';
import { CarBrandComponent } from './setting-benzeny/car-brand/car-brand.component';
import { CarModelComponent } from './setting-benzeny/car-model/car-model.component';
import { PlateTypeComponent } from './setting-benzeny/plate-type/plate-type.component';
import { CarTypeComponent } from './setting-benzeny/car-type/car-type.component';
import { TagsComponent } from './setting-benzeny/tags/tags.component';
import { DriverComponent } from './driver/driver.component';
import { AdsComponent } from './ads/ads.component';
import { BenzenyDashboardComponent } from './benzeny-dashboard/benzeny-dashboard.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { BranchDashboardComponent } from './branch-dashboard/branch-dashboard.component';
import { NfcComponent } from './nfc/nfc.component';
import { NfcDetailsComponent } from './nfc-details/nfc-details.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { FuelTransferComponent } from './fuel-transfer/fuel-transfer.component';
import { BalanceComponent } from './balance/balance.component';
import { TransactionComponent } from './transaction/transaction.component';
import { BenzenyInvoicesComponent } from './benzeny-invoices/benzeny-invoices.component';
import { logedGuard } from 'src/core/guards/loged/loged.guard';
import { authGuard } from 'src/core/guards/auth/auth.guard';
import { Error404Component } from './pages/error404';
import { BenzenyUsersComponent } from './benzeny-users/benzeny-users.component';
import { BenzenyLogsComponent } from './benzeny-logs/benzeny-logs.component';
import { BenzenyOnboardingComponent } from './benzeny-onboarding/benzeny-onboarding.component';
import { BenzenyOnboardingDetailsComponent } from './benzeny-onboarding-details/benzeny-onboarding-details.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        canActivate:[logedGuard],
        children: [
            // auth
            { path: '', loadChildren: () => import('./auth/auth.module').then((d) => d.AuthModule) },

            // pages
            // { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },
        ],
    },
    {
        path: '',
        component: AppLayout,
        canActivate:[authGuard],
        children: [
            // dashboard
            { path: '', component: AdsComponent, data: { title: 'Ads' } },
            // { path: 'index', component: IndexComponent, data: { title: 'Sales Admin' } },
            // { path: 'dashboard', component: IndexComponent, data: { title: 'Dashboard' } },
            // { path: 'analytics', component: AnalyticsComponent, data: { title: 'Analytics Admin' } },
            // { path: 'finance', component: FinanceComponent, data: { title: 'Finance Admin' } },
            // { path: 'crypto', component: CryptoComponent, data: { title: 'Crypto Admin' } },

            // Main Benzeny Components
            { path: 'benzeny-onboarding', component: BenzenyOnboardingComponent, data: { title: 'Onboarding' } },
            { path: 'benzeny-onboarding-details/:id', component: BenzenyOnboardingDetailsComponent, data: { title: 'Onboarding-Details' } },
            { path: 'benzeny-dashboard', component: BenzenyDashboardComponent, data: { title: 'Dashboard' } },
            { path: 'benzeny-users', component: BenzenyUsersComponent, data: { title: 'Users' } },
            { path: 'company-dashboard', component: CompanyDashboardComponent, data: { title: 'Dashboard' } },
            { path: 'company-dashboard/:id', component: CompanyDashboardComponent, data: { title: 'Dashboard' } },
            { path: 'branch-dashboard', component: BranchDashboardComponent, data: { title: 'Dashboard' } },
            { path: 'branch-dashboard/:id', component: BranchDashboardComponent, data: { title: 'Dashboard' } },
            { path: 'companies', component: CompaniesComponent, data: { title: 'Company' } },
            { path: 'users-company', component: UsersCompanyComponent, data: { title: 'Users' } },
            { path: 'branches', component: BranchesComponent, data: { title: 'Branches' } },
            { path: 'cars', component: CarsComponent, data: { title: 'Cars' } },
            { path: 'drivers', component: DriverComponent, data: { title: 'Drivers' } },
            { path: 'nfc', component: NfcComponent, data: { title: 'NFC' } },
            { path: 'nfc-details/:id', component: NfcDetailsComponent, data: { title: 'NFC' } },
            { path: 'balance', component: BalanceComponent, data: { title: 'Balance' } },
            { path: 'subscription', component: SubscriptionComponent, data: { title: 'Subscription' } },
            { path: 'benzeny-logs', component: BenzenyLogsComponent, data: { title: 'Logs' } },
            { path: 'transaction', component: TransactionComponent, data: { title: 'Transaction' } },
            { path: 'invoices', component: BenzenyInvoicesComponent, data: { title: 'Invoices' } },
            { path: 'fuel-transfer', component: FuelTransferComponent, data: { title: 'Fuel Transfer' } },
            { path: 'ads', component: AdsComponent, data: { title: 'ADS' } },
            { path: 'setting-benzeny', component: SettingBenzenyComponent, data: { title: 'Settings' }, children:[
                {path: '', redirectTo: 'car-brand', pathMatch: 'full' },
                {path: 'car-brand', component: CarBrandComponent},
                {path: 'car-model', component: CarModelComponent},
                {path: 'plate-type', component: PlateTypeComponent},
                {path: 'car-type', component: CarTypeComponent},
                {path: 'tags', component: TagsComponent},
            ]},

            { path: '**', component: Error404Component, data: { title: 'Error 404' } },

            // widgets
            // { path: 'widgets', component: WidgetsComponent, data: { title: 'Widgets' } },

            // font-icons
            // { path: 'font-icons', component: FontIconsComponent, data: { title: 'Font Icons' } },

            // charts
            // { path: 'charts', component: ChartsComponent, data: { title: 'Charts' } },

            // dragndrop
            // { path: 'dragndrop', component: DragndropComponent, data: { title: 'Dragndrop' } },

            // pages
            // { path: 'pages/knowledge-base', component: KnowledgeBaseComponent, data: { title: 'Knowledge Base' } },
            // { path: 'pages/faq', component: FaqComponent, data: { title: 'FAQ' } },

            //apps
            // { path: '', loadChildren: () => import('./apps/apps.module').then((d) => d.AppsModule) },

            // components
            // { path: '', loadChildren: () => import('./components/components.module').then((d) => d.ComponentsModule) },

            // elements
            // { path: '', loadChildren: () => import('./elements/elements.module').then((d) => d.ElementsModule) },

            // forms
            // { path: '', loadChildren: () => import('./forms/form.module').then((d) => d.FormModule) },

            // users
            // { path: '', loadChildren: () => import('./users/user.module').then((d) => d.UsersModule) },

            // tables
            // { path: 'tables', component: TablesComponent, data: { title: 'Tables' } },
            // { path: '', loadChildren: () => import('./datatables/datatables.module').then((d) => d.DatatablesModule) },
        ],
    },


];
