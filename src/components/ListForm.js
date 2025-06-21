import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './css/list.module.css';

export default function ListForm() {
  const [rotas, setRotas] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/rotas')
      .then(res => res.json())
      .then(data => setRotas(data))
      .catch(() => setErro('Erro ao carregar rotas'));
  }, []);

  const rodoeste = rotas.filter(r => r.companhia === 'Rodoeste');
  const sam = rotas.filter(r => r.companhia === 'Sam');
  const hfunchal = rotas.filter(r => r.companhia === 'H.Funchal');

  return (
    <div className={styles.container}>
      {erro && <p className={styles.error}>{erro}</p>}

      <div className={styles.columns}>
        <div className={styles.column}>
          <h3>Rodoeste</h3>
          {rodoeste.length === 0 && <p>Nenhuma rota</p>}
          {rodoeste.map((rota) => (
            <div key={rota.id} className={styles['route-item']}>
              <Link to={`/rota/${rota.id}`}>
                {rota.nrota} - {rota.rota}
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <h3>Sam</h3>
          {sam.length === 0 && <p>Nenhuma rota</p>}
          {sam.map((rota) => (
            <div key={rota.id} className={styles['route-item']}>
              <Link to={`/rota/${rota.id}`}>
                {rota.nrota} - {rota.rota}
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <h3>H.Funchal</h3>
          {hfunchal.length === 0 && <p>Nenhuma rota</p>}
          {hfunchal.map((rota) => (
            <div key={rota.id} className={styles['route-item']}>
              <Link to={`/rota/${rota.id}`}>
                {rota.nrota} - {rota.rota}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
