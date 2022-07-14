import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarDataProfessional = [
  
  {
    title: 'Asiakkaat',
    path: '../profenssional_clients',
    icon: <IoIcons.IoMdPerson />,
    cName: 'nav-text'
  },

  {
    title: 'Palvelut',
    path: '../professional_services',
    icon: <RiIcons.RiServiceFill />,
    cName: 'nav-text'
  }
  ,

  {
    title: 'Työajat',
    path: '../professional_calender',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nav-text'
  }
  
]

export const SidebarDataClient = [

  {
    title: 'Ammattilaiset',
    path: '../client_professionals',
    icon: <IoIcons.IoIosPeople />,
    cName: 'nav-text'
  },


  {
    title: 'Palvelut',
    path: '../client_services',
    icon: <RiIcons.RiServiceFill />,
    cName: 'nav-text'
  }
  ,

  {
    title: 'Ajanvaraus',
    path: '../client_booking',
    icon: <RiIcons.RiCalendarCheckFill />,
    cName: 'nav-text'
  }
]

export const SidebarDataAdmin = [
  {
    title: 'Ammattilaiset',
    path: '../admin_professionals',
    icon: <IoIcons.IoIosPeople />,
    cName: 'nav-text'
  },

  {
    title: 'Asiakkaat',
    path: '../admin_clients',
    icon: <IoIcons.IoIosPerson />,
    cName: 'nav-text'
  },

  {
    title: 'Palvelut',
    path: '../admin_services',
    icon: <RiIcons.RiServiceFill />,
    cName: 'nav-text'
  }
]