
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUpload, FaList, FaUserPlus, FaInfoCircle } from 'react-icons/fa';
import styles from './css/sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>Admin Painel</div>
      <nav className={styles.menu}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
          <FaUpload /> <span>Upload</span>
        </NavLink>
        <NavLink to="/rotas" className={({ isActive }) => isActive ? styles.active : ''}>
          <FaList /> <span>Rotas</span>
        </NavLink>
        <NavLink to="/registrar-condutor" className={({ isActive }) => isActive ? styles.active : ''}>
          <FaUserPlus /> <span>Motoristas</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
