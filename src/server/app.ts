// DEPENDENCIAS
import express, { Request, Response, NextFunction } from 'express';
import router from './routes/productos.js'; 
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tipado para textos.json
type Traducciones = Record<string, string>;

// Cargar traducciones desde JSON
const textos: Traducciones = JSON.parse(
  fs.readFileSync(path.resolve('public/assets/languages/textos.json'), 'utf-8')
);



// Función para traducir dinámicamente
function traducir(textos: Traducciones, lang: string = 'es'): Traducciones {
  const traducciones: Traducciones = {};
  for (const key in textos) {
    if (!key.endsWith('_en')) {
      traducciones[key] =
        lang === 'en' && textos[`${key}_en`] ? textos[`${key}_en`] : textos[key];
    }
  }
  return traducciones;
}

// Inicializar Express
const app = express();

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.static('public'));


// Datos de prueba
type Producto = {
  name: string;
  price: number;
  quantity: number;
  description: string;
  _id: string;
};

const productos: Producto[] = [
  { name: "Disco Duro", price: 120, quantity: 23, description: "Disco duro", _id: "66f85..." },
  { name: "Auriculares", price: 83, quantity: 37, description: "Auriculares inalámbricos", _id: "66f85..." },
  { name: "Alfombrilla", price: 25, quantity: 40, description: "Alfombrilla caucho", _id: "68077..." },
  { name: "Ratón", price: 30, quantity: 45, description: "Ratón ergonómico", _id: "6807a..." },
  { name: "Ratón", price: 30, quantity: 50, description: "Ratón ergonómico", _id: "680b9..." }
];

// Ruta inicial
app.get('/', (_req: Request, res: Response) => {
  res.render('login');
});

// Middleware de autenticación
function autenticar(req: Request, res: Response, next: NextFunction): void {
  if (req.cookies?.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// Ruta de login
app.post('/login', (req: Request, res: Response) => {
  const { usuario } = req.body;

  if (usuario && usuario.trim() !== "") {
    res.cookie('user', usuario, { maxAge: 24 * 60 * 60 * 1000 }); // 1 día
    res.status(200).json({ mensaje: "Login correcto" });
  } else {
    res.status(400).json({ error: "Faltan datos" });
  }
});

// Ruta protegida /index
app.get('/index', autenticar, (req: Request, res: Response) => {
  const langParam = req.query.lang as string | undefined;
  const cookieLang = req.cookies?.lang;
  const browserLang = req.headers['accept-language']?.split(',')[0].slice(0, 2);

  const lang = langParam || cookieLang || (['es', 'en'].includes(browserLang!) ? browserLang : 'en');

  if (langParam) {
    res.cookie('lang', lang, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 días
  }

  const traducciones = traducir(textos, lang);

  res.render('index', {
    traducciones,
    productos
  });
});

// API de productos
app.use('/productos', router);

// Iniciar servidor
app.listen(80, () => {
  console.log('Servidor corriendo en http://localhost:80');
});
