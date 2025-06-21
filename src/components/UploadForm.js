import React from 'react';
import styles from './css/upload.module.css';

export default class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        companhia: 'Rodoeste',
        rota: '',
        nrota: '',
        geojson: null,
      },
      status: '',
      enviado: false,
    };
  }

  handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'geojson') {
      this.setState(prevState => ({
        formData: { ...prevState.formData, geojson: files[0] }
      }));
    } else {
      this.setState(prevState => ({
        formData: { ...prevState.formData, [name]: value }
      }));
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formData } = this.state;

    if (!formData.geojson) {
      this.setState({ status: 'Por favor, selecione um ficheiro.' });
      return;
    }

    const data = new FormData();
    data.append('companhia', formData.companhia);
    data.append('rota', formData.rota);
    data.append('nrota', formData.nrota);
    data.append('geojson', formData.geojson);

    try {
      this.setState({ status: 'Enviando...', enviado: false });
      const res = await fetch('http://localhost:3001/enviar', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        this.setState({
          status: 'Rota enviada com sucesso! A recarregar...',
          enviado: true,
        });

        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        this.setState({ status: `Erro: ${res.statusText}`, enviado: false });
      }
    } catch (error) {
      this.setState({ status: 'Erro ao enviar: ' + error.message, enviado: false });
    }
  };

  render() {
    const { formData, status } = this.state;

    return (
      <div className={styles.container}>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data" className={styles.form}>
          <label className={styles.label}>
            Companhia:
            <br/>
            <select
              name="companhia"
              value={formData.companhia}
              onChange={this.handleChange}
              required
              className={styles.select}
            >
              <option value="Rodoeste">Rodoeste</option>
              <option value="Sam">Sam</option>
              <option value="H.Funchal">H.Funchal</option>
            </select>
          </label>

          <label className={styles.label}>
            Rota:
            <br/>
            <input
              type="text"
              name="rota"
              value={formData.rota}
              onChange={this.handleChange}
              required
              placeholder="Nome da rota"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Número da Rota:
            <br/>
            <input
              type="number"
              name="nrota"
              value={formData.nrota}
              onChange={this.handleChange}
              min="1"
              required
              placeholder="Ex: 1"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            <br/>
            <label htmlFor="geojson-upload" className={styles.customFileUpload}>
              {formData.geojson ? formData.geojson.name : "Escolher ficheiro KML/GEOJSON"}
            </label>
            <input
              id="geojson-upload"
              type="file"
              name="geojson"
              accept=".kml,.geojson"
              onChange={this.handleChange}
              required
              className={styles.file}
            />
          </label>


          <button type="submit" className={styles.button}>Enviar</button>

          {status && <p className={styles.status}>{status}</p>}
        </form>
      </div>
    );
  }
}
