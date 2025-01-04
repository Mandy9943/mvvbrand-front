import { RouteNamesEnum } from '@/localConstants';
import { Home } from '@/pages';
import { BrandOwnToken } from '@/pages/BrandOwnToken/BrandOwnToken';
import { BrandToken } from '@/pages/BrandToken/BrandToken';
import { RouteType } from '@/types';

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home
  },
  {
    path: RouteNamesEnum.brandMemexchangeToken,
    title: 'Brand Memexchange Token',
    component: BrandToken
  },
  {
    path: RouteNamesEnum.brandMyToken,
    title: 'Brand My Token',
    component: BrandOwnToken
  }
];
