
import * as Icon from 'react-feather';

const userRole = localStorage.getItem('role');

const SidebarData = [
  // { caption: 'Personal' },
  // {
  //   title: 'Dashboards',
  //   href: '/dashboards',
  //   id: 1,
  //   suffix: '4',
  //   suffixColor: 'bg-cyan rounded-pill text-dark-white',
  //   icon: <Icon.Home />,
  //   collapisble: true,
  //   children: [
  //     // {
  //     //   title: 'User Management',
  //     //   href: '/dashboards/userlist',
  //     //   icon: <Icon.User />,
  //     //   id: 1.1,
  //     //   collapisble: false,
  //     // },
  //     // {
  //     //   title: 'Shop Management',
  //     //   href: '/dashboards/shoplist',
  //     //   icon: <Icon.User />,
  //     //   id: 1.1,
  //     //   collapisble: false,
  //     // },
  //     {
  //       title: 'Analytical',
  //       href: '/dashboards/analytical',
  //       icon: <Icon.Disc />,
  //       id: 1.2,
  //       collapisble: false,
  //     },
  //     {
  //       title: 'Demographical',
  //       href: '/dashboards/demographical',
  //       icon: <Icon.Disc />,
  //       id: 1.3,
  //       collapisble: false,
  //     },
  //     {
  //       title: 'Modern',
  //       href: '/dashboards/modern',
  //       icon: <Icon.Disc />,
  //       id: 1.4,
  //       collapisble: false,
  //     },
  //   ],
  // },
  
  { caption: 'Management' },
  
  ...(userRole === 'ADMIN' ? [
    {
      title: 'User Management',
      href: '/dashboards/userlist',
      icon: <Icon.User />,
      id: 2.1,
      collapisble: false,
    }
  ] : []),
  {
    title: 'Product List',
    href: '/auth/ecom/shop',
    icon: <Icon.ShoppingCart />,
    id: 2.4,
    collapisble: false,
  },
  {
    title: 'Order Management',
    href: '/my-order',
    icon: <Icon.ShoppingCart />,
    id: 2.4,
    collapisble: false,
  },
  {
    title: 'Shop Management',
    href: '/dashboards/shoplist',
    icon: <Icon.Home />,
    id: 2.2,
    collapisble: false,
  }
  
];

export default SidebarData;
