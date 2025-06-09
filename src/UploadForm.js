// src/Aplicacao.js
import React from 'react';

export default class Aplicacao extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                companhia: 'Rodoeste',
                cor: '#BA8E23',
                rota: '',
                nrota: '',
                geojson: null,
            },
            status: ''
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
        data.append('cor', formData.cor);
        data.append('rota', formData.rota);
        data.append('nrota', formData.nrota);
        data.append('geojson', formData.geojson);

        try {
            this.setState({ status: 'Enviando...' });
            const res = await fetch('http://localhost:3001/enviar', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const text = await res.text();
                console.log(text);
                this.setState({
                    formData: {
                        companhia: 'Rodoeste',
                        cor: '#BA8E23',
                        rota: '',
                        nrota: '',
                        geojson: null
                    },
                    status: 'Rota enviada com sucesso!'
                });
            } else {
                this.setState({ status: `Erro: ${res.statusText}` });
            }
        } catch (error) {
            this.setState({ status: 'Erro ao enviar: ' + error.message });
        }
    };

    render() {
        const { formData, status } = this.state;

        return (
            <form onSubmit={this.handleSubmit} encType="multipart/form-data" style={{ maxWidth: '400px', margin: 'auto' }}>
                <h1>Adicionar Rota</h1>

                <label>
                    Companhia:
                    <select name="companhia" value={formData.companhia} onChange={this.handleChange} required>
                        <option value="Rodoeste">Rodoeste</option>
                        <option value="Sam">Sam</option>
                        <option value="H.Funchal">H.Funchal</option>
                    </select>
                </label>

                <fieldset style={{ marginTop: '1em' }}>
                    <legend>Cor:</legend>
                    {[
                        { label: 'Dourado', value: '#BA8E23' },
                        { label: 'Vermelho', value: '#FF0000' },
                        { label: 'Verde', value: '#008000' },
                    ].map(({ label, value }) => (
                        <label key={value} style={{ display: 'block', marginBottom: '0.5em', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="cor"
                                value={value}
                                checked={formData.cor === value}
                                onChange={this.handleChange}
                                required
                            />
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: value,
                                    marginRight: '8px',
                                    verticalAlign: 'middle',
                                    border: '1px solid #000',
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </fieldset>

                <label style={{ display: 'block', marginTop: '1em' }}>
                    Rota:
                    <input
                        type="text"
                        name="rota"
                        value={formData.rota}
                        onChange={this.handleChange}
                        required
                        placeholder="Nome da rota"
                        style={{ width: '100%' }}
                    />
                </label>

                <label style={{ display: 'block', marginTop: '1em' }}>
                    Número da Rota:
                    <input
                        type="number"
                        name="nrota"
                        value={formData.nrota}
                        onChange={this.handleChange}
                        min="1"
                        required
                        placeholder="Ex: 1"
                        style={{ width: '100%' }}
                    />
                </label>

                <label style={{ display: 'block', marginTop: '1em' }}>
                    Ficheiro KML/GeoJson:
                    <input
                        type="file"
                        name="geojson"
                        accept=".kml,.geojson"
                        onChange={this.handleChange}
                        required
                        style={{ width: '100%' }}
                    />
                </label>

                <button type="submit" style={{ marginTop: '1.5em', padding: '0.5em 1em' }}>Enviar</button>

                {status && <p style={{ marginTop: '1em' }}>{status}</p>}
            </form>
        );
    }
}