import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './css/details.module.css';

export default function RouteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rota, setRota] = useState(null);
  const [erro, setErro] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ companhia: '', rota: '', nrota: '', cor: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/rotas/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar rota');
        return res.json();
      })
      .then(data => {
        setRota(data);
        setForm({
          companhia: data.companhia,
          rota: data.rota,
          nrota: data.nrota,
          cor: data.cor
        });
      })
      .catch(() => setErro('Erro ao carregar detalhes da rota'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Tens a certeza que queres eliminar esta rota?')) return;
    try {
      const res = await fetch(`http://localhost:3001/rotas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao eliminar');
      navigate('/');
    } catch (e) {
      alert('Erro ao eliminar: ' + e.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/rotas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Falha ao atualizar');
      const updated = await res.json();
      setRota(updated);
      setEditMode(false);
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (erro) return <p className={styles.paragraph}>{erro}</p>;
  if (!rota) return <p className={styles.paragraph}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.detailsBox}>
        <h2 className={styles.heading}>Detalhes da Rota</h2>

        {!editMode ? (
          <>
            <p className={styles.paragraph}><strong>ID:</strong> {rota.id}</p>
            <p className={styles.paragraph}><strong>Companhia:</strong> {rota.companhia}</p>
            <p className={styles.paragraph}><strong>Nome da Rota:</strong> {rota.rota}</p>
            <p className={styles.paragraph}><strong>Número da Rota:</strong> {rota.nrota}</p>
            <p className={styles.colorField}>
              <strong>Cor:</strong>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: rota.cor }}
              />
              {` ${rota.cor}`}
            </p>

            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => setEditMode(true)}
              >
                Editar
              </button>
              <button
                className={styles.actionButton}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <label className={styles.editFormLabel}>
              Companhia:
              <select
                name="companhia"
                value={form.companhia}
                onChange={e => setForm({ ...form, companhia: e.target.value })}
                className={styles.editFormSelect}
              >
                <option>Rodoeste</option>
                <option>Sam</option>
                <option>H.Funchal</option>
              </select>
            </label>

            <label className={styles.editFormLabel}>
              Nome da Rota:
              <input
                name="rota"
                value={form.rota}
                onChange={e => setForm({ ...form, rota: e.target.value })}
                className={styles.editFormInput}
              />
            </label>

            <label className={styles.editFormLabel}>
              Número da Rota:
              <input
                type="number"
                name="nrota"
                value={form.nrota}
                onChange={e => setForm({ ...form, nrota: e.target.value })}
                className={styles.editFormInput}
              />
            </label>

            <label className={styles.editFormLabel}>
              Cor:
              <input
                type="text"
                name="cor"
                value={form.cor}
                onChange={e => setForm({ ...form, cor: e.target.value })}
                className={styles.editFormInput}
              />
            </label>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.actionButton}
                disabled={saving}
              >
                {saving ? 'A gravar...' : 'Guardar'}
              </button>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <Link to="/" className={styles.linkBack}>Voltar à lista</Link>
      </div>
    </div>
  );
}
