import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarDataProfessional = [
  {
    title: 'Home',
    path: '../professional_dashboard',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },

  {
    title: 'Professionals',
    path: '../professional_professionals',
    icon: <IoIcons.IoIosPeople />,
    cName: 'nav-text'
  },

  {
    title: 'Clients',
    path: '../profenssional_clients',
    icon: <IoIcons.IoMdPerson />,
    cName: 'nav-text'
  },

  {
    title: 'Services',
    path: '../professional_services',
    icon: <RiIcons.RiServiceFill />,
    cName: 'nav-text'
  }
  ,

  {
    title: 'Worktimes',
    path: '../professional_calender',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nav-text'
  }
  ,

  {
    title: 'Settings',
    path: '../professional_settings',
    icon: <AiIcons.AiFillSetting />,
    cName: 'nav-text'
  }
]

export const SidebarDataClient = [
  {
    title: 'Home',
    path: '../client_dashboard',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },

  {
    title: 'Professionals',
    path: '../client_professionals',
    icon: <IoIcons.IoIosPeople />,
    cName: 'nav-text'
  },


  {
    title: 'Services',
    path: '../client_services',
    icon: <RiIcons.RiServiceFill />,
    cName: 'nav-text'
  }
  ,

  {
    title: 'Settings',
    path: '../client_settings',
    icon: <AiIcons.AiFillSetting />,
    cName: 'nav-text'
  }
]