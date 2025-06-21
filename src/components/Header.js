
import React from 'react';
import styles from './css/header.module.css';

const Header = ({ title }) => {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
    </div>
  );
};

export default Header;
