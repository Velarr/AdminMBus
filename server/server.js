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
  keyFilename: './credentials.json'
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

    const { companhia, cor, rota, nrota } = req.body;

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



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
