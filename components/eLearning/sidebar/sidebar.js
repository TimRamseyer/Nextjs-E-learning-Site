import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart } from 'react-icons/fa';
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
//import sidebarBg from './assets/bg1.jpg';

const Aside = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {
 
  return (
    <ProSidebar
      //image={image ? sidebarBg : false}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
         Admin
        </div>
        <div> {/* Add onclick handler to collapse menu; add style */}
        {collapsed ? (
                <FiArrowRightCircle/>
              ) : (
                <FiArrowLeftCircle/>
              )}
              </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaTachometerAlt />}
            suffix={<span className="badge red">new</span>}
          >
            Dashboard
          </MenuItem>
          <MenuItem icon={<FaGem />}>Profile</MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title='Orders'
            icon={<FaRegLaughWink />}
          >
            <MenuItem>Submenu 1</MenuItem>
            <MenuItem>Submenu 2</MenuItem>
            <MenuItem>Submenu 3</MenuItem>
          </SubMenu>
          <SubMenu
            prefix={<span className="badge gray">3</span>}
            title='My Subsctription'
            icon={<FaHeart />}
          >
            <MenuItem>Sub Menu 1</MenuItem>
            <MenuItem>Sub Menu 2</MenuItem>
            <MenuItem>Sub Menu 3</MenuItem>
          </SubMenu>
          <SubMenu title="My Courses" icon={<FaList />}>
            <MenuItem>Sub Menu 1 </MenuItem>
            <MenuItem>Sub Menu 2 </MenuItem>
            <SubMenu title={`$Sub Menu 3`}>
              <MenuItem>Sub Menu 3.1 </MenuItem>
              <MenuItem>Sub Menu 3.2 </MenuItem>
              <SubMenu title={`$Sub Menu 3.3`}>
                <MenuItem>Sub Menu 3.3.1 </MenuItem>
                <MenuItem>Sub Menu 3.3.2 </MenuItem>
                <MenuItem>Sub Menu 3.3.3 </MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/azouaoui-med/react-pro-sidebar"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span> View Source</span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;