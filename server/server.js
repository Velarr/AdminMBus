import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Firestore } from '@google-cloud/firestore';
import * as toGeoJSON from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

const firestore = new Firestore({
  projectId: 'busdb-90db1',
  keyFilename: '../credentials.json'
});

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/enviar', upload.single('geojson'), async (req, res) => {
  try {
    console.log('Recebendo dados:', req.body);
    console.log('Arquivo recebido:', req.file);

    const { companhia, rota, nrota } = req.body;

    if (!req.file) return res.status(400).send('Arquivo obrigatório');

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let geojson;

    if (ext === '.kml') {
      const kmlData = fs.readFileSync(filePath, 'utf8');
      const dom = new DOMParser().parseFromString(kmlData);
      geojson = toGeoJSON.kml(dom);
    } else if (ext === '.geojson') {
      const rawData = fs.readFileSync(filePath, 'utf8');
      geojson = JSON.parse(rawData);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).send('Formato não suportado, envie .kml ou .geojson');
    }

    let cor;
    switch (companhia.toLowerCase()) {
      case 'rodoeste':
        cor = '#FF0000';
        break;
      case 'sam':
        cor = '#008000';
        break;
      case 'h.funchal':
      case 'hfunchal':
        cor = '#BA8E23'; 
        break;
      default:
        cor = '#000000';
    }

    const data = {
      companhia,
      cor,
      rota,
      nrota: parseInt(nrota),
      geojson: JSON.stringify(geojson),
      timestamp: new Date(),
    };

    const docRef = await firestore.collection('rotas').add(data);

    fs.unlinkSync(filePath);

    res.status(200).send(`Rota salva com ID: ${docRef.id}`);
  } catch (error) {
    console.error('Erro no /enviar:', error);
    res.status(500).send('Erro ao processar a rota.');
  }
});

app.get('/rotas', async (req, res) => {
  try {
    const snapshot = await firestore.collection('rotas').orderBy('nrota').get();
    const rotas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(rotas);
  } catch (error) {
    console.error('Erro ao buscar rotas:', error);
    res.status(500).send('Erro ao buscar rotas.');
  }
});

app.get('/rotas/:id', async (req, res) => {
  try {
    const doc = await firestore.collection('rotas').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Rota não encontrada');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
    res.status(500).send('Erro ao buscar rota.');
  }
});

app.delete('/rotas/:id', async (req, res) => {
  try {
    await firestore.collection('rotas').doc(req.params.id).delete();
    res.status(200).send('Rota eliminada');
  } catch (error) {
    console.error('Erro ao eliminar rota:', error);
    res.status(500).send('Erro ao eliminar rota.');
  }
});

app.put('/rotas/:id', async (req, res) => {
  try {
    const { companhia, rota, nrota, cor } = req.body;
    await firestore.collection('rotas').doc(req.params.id).update({
      companhia,
      rota,
      nrota: Number(nrota),
      cor
    });
    const doc = await firestore.collection('rotas').doc(req.params.id).get();
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao atualizar rota:', error);
    res.status(500).send('Erro ao atualizar rota.');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
