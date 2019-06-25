import {PrivateRoute} from '../../router/Route';

import Accounts from './Accounts';
import Achievements from './Achievements';
import Games from './Games';
import Home from './Home';
import Inventory from './Inventory';
import Logout from './Logout';
import Platforms from './Platforms';
import Profile from './Profile';
import Races from './Races';
import UploadExample from '../helper/UploadExample';

const routes = [
  {
    path: '/accounts',
    name: 'Contas',
    component: Accounts,
  },
  {
    path: '/achievements',
    name: 'Conquistas',
    component: Achievements,
  },
  {
    path: '/games',
    name: 'Jogos',
    component: Games,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Home,
    exact: true
  },
  {
    path: '/home',
    name: 'Dashboard',
    component: Home,
    exact: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Home,
  },
  {
    path: '/inventory',
    name: 'Inventário',
    component: Inventory,
  },
  {
    path: '/logout',
    component: Logout,
  },
  {
    path: '/platforms',
    name: 'Plataformas',
    component: Platforms,
  },
  {
    path: '/profile',
    name: 'Meu Perfil',
    component: Profile,
  },
  {
    path: '/races',
    component: Races,
  },
  {
    path: '/upload-example',
    component: UploadExample
  }
];

export default {component: PrivateRoute, routes};
