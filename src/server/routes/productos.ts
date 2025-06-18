import express, { Request, Response } from 'express';
import { APIService } from '../apiService.js'; // Asegúrate que apiService.ts está correctamente tipado

const router = express.Router();

// Obtener todos los productos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const productos = await APIService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos",error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const producto = await APIService.obtenerProductoPorId(req.params.id);
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto",error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Crear un nuevo producto
router.post('/', async (req: Request, res: Response) => {
  try {
    await APIService.crearProducto(req.body);
    res.status(201).send();
  } catch (error) {
    console.error("Error al crear el producto",error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar un producto existente
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await APIService.actualizarProducto(req.params.id, req.body);
    res.status(204).send();
  } catch (error) {
    console.error("Error al actualizar producto",error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar un producto
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await APIService.eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar producto",error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
