import { Router } from 'express';
import veiculos from "./app/controllers/VeiculosControllers.js";
import proprietarios from "./app/controllers/ProprietariosControllers.js";
import usuarios from "./app/controllers/UsuariosControllers.js";
import setores from "./app/controllers/SetoresControllers.js";
import vagas from "./app/controllers/VagasControllers.js";
import permanencias from "./app/controllers/PermanenciaControllers.js"
import { validate } from './app/middlewares/validate.js';
import { createVeiculoSchema } from './app/validations/veiculos.schema.js';
import { createProprietarioSchema } from './app/validations/proprietarios.schema.js';
import { createSetorSchema } from './app/validations/setores.schema.js';
import { createVagaSchema } from './app/validations/vagas.schema.js';
import { createPermanenciaSchema } from './app/validations/permanencias.schema.js';
import { validateId } from './app/middlewares/validateId.js';


const routes = new Router();

routes.get('/veiculos', (req, res) => veiculos.index(req, res));
routes.get('/veiculos/:id', validateId, (req, res) => veiculos.show(req, res));
routes.post('/veiculos', validate(createVeiculoSchema), (req, res) => veiculos.create(req, res));
routes.put('/veiculos/:id', validateId, validate(createVeiculoSchema), (req, res) => veiculos.update(req, res));
routes.delete('/veiculos/:id', validateId,  (req, res) => veiculos.destroy(req, res));

routes.get('/proprietarios', (req, res) => proprietarios.index(req, res));
routes.get('/proprietarios/:id', validateId,  (req, res) => proprietarios.show(req, res));
routes.put('/proprietarios/:id', validateId,  validate(createProprietarioSchema), (req, res) => proprietarios.update(req, res));
routes.post('/proprietarios', validate(createProprietarioSchema), (req, res) => proprietarios.create(req, res));
routes.delete('/proprietarios/:id', validateId,  (req, res) => proprietarios.destroy(req, res));

routes.get('/usuarios', (req, res) => usuarios.index(req, res));
routes.get('/usuarios/:id', (req, res) => usuarios.show(req, res));
routes.put('/usuarios/:id', (req, res) => usuarios.update(req, res));
routes.post('/usuarios', (req, res) => usuarios.create(req, res));
routes.delete('/usuarios/:id', (req, res) => usuarios.destroy(req, res));


routes.get('/setores', (req, res) => setores.index(req, res));
routes.get('/setores/:id', validateId, (req, res) => setores.show(req, res));
routes.put('/setores/:id', validateId,  validate(createSetorSchema), (req, res) => setores.update(req, res));
routes.post('/setores', validate(createSetorSchema), (req, res) => setores.create(req, res));
routes.patch('/setores/:id', validateId,  (req, res) => setores.desativarSetor(req, res));
routes.patch('/setores/:id/ativar', validateId,  (req, res) => setores.ativarSetor(req, res));

routes.get('/vagas', (req, res) => vagas.index(req, res));
routes.get('/vagas/:id', validateId,  (req, res) => vagas.show(req, res));
routes.put('/vagas/:id', validateId,  validate(createVagaSchema), (req, res) => vagas.update(req, res));
routes.post('/vagas', validate(createVagaSchema), (req, res) => vagas.create(req, res));
routes.delete('/vagas/:id', validateId,  (req, res) => vagas.destroy(req, res));
routes.patch('/vagas/:id/ativar', validateId,  (req, res) => vagas.ativarVaga(req, res));

routes.get('/permanencias', (req, res) => permanencias.index(req, res));
routes.get('/permanencias/:id', validateId,  (req, res) => permanencias.show(req, res));
routes.put('/permanencias/:id', validateId,  (req, res) => permanencias.finalizar(req, res));
routes.post('/permanencias', validate(createPermanenciaSchema), (req, res) => permanencias.create(req, res));


export default routes;