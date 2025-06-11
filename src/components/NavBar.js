import React from 'react';
import { Link } from 'react-router-dom';
import styles from './css/navbar.module.css';

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.link}>Adicionar Rota</Link>
      <Link to="/rotas" className={styles.link}>Ver Rotas</Link>
    </nav>
  );
}
