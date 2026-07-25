import { Router } from 'express';
import carros from "./app/controllers/CarrosControllers.js";
import proprietarios from "./app/controllers/ProprietariosControllers.js";
import usuarios from "./app/controllers/UsuariosControllers.js";
import setores from "./app/controllers/SetoresControllers.js";
import vagas from "./app/controllers/VagasControllers.js";

const routes = new Router();

routes.get('/carros', (req, res) => carros.index(req, res));
routes.get('/carros/:id', (req, res) => carros.show(req, res));
routes.get('/modelos', (req, res) => carros.showModelo(req, res));
routes.post('/carros', (req, res) => carros.create(req, res));
routes.put('/carros/:id', (req, res) => carros.update(req, res));
routes.delete('/carros/:id', (req, res) => carros.destroy(req, res));

routes.get('/proprietarios', (req, res) => proprietarios.index(req, res));
routes.get('/proprietarios/:id', (req, res) => proprietarios.show(req, res));
routes.put('/proprietarios/:id', (req, res) => proprietarios.update(req, res));
routes.post('/proprietarios', (req, res) => proprietarios.create(req, res));
routes.delete('/proprietarios/:id', (req, res) => proprietarios.destroy(req, res));

routes.get('/usuarios', (req, res) => usuarios.index(req, res));
routes.get('/usuarios/:id', (req, res) => usuarios.show(req, res));
routes.put('/usuarios/:id', (req, res) => usuarios.update(req, res));
routes.post('/usuarios', (req, res) => usuarios.create(req, res));
routes.delete('/usuarios/:id', (req, res) => usuarios.destroy(req, res));


routes.get('/setores', (req, res) => setores.index(req, res));
routes.get('/setores/:id', (req, res) => setores.show(req, res));
routes.put('/setores/:id', (req, res) => setores.update(req, res));
routes.post('/setores', (req, res) => setores.create(req, res));
routes.delete('/setores/:id', (req, res) => setores.destroy(req, res));
routes.patch('/setores/:id/ativar', (req, res) => setores.patch(req, res));

routes.get('/vagas', (req, res) => vagas.index(req, res));
routes.get('/vagas/:id', (req, res) => vagas.show(req, res));
routes.put('/vagas/:id', (req, res) => vagas.update(req, res));
routes.post('/vagas', (req, res) => vagas.create(req, res));
routes.delete('/vagas/:id', (req, res) => vagas.destroy(req, res));
routes.patch('/vagas/:id/ativar', (req, res) => vagas.patch(req, res));

export default routes;