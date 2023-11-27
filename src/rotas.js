const express = require('express');
const { verificaDadosLogin, verificaDadosTransacao, verificaToken, verificaDadosCadastro } = require('./Intermediarios/verificar');
const { cadastraUsuario, login, listarUsuarios, atualizarUsuario } = require('./Controladores/usuarios');
const { listarCategorias } = require('./Controladores/categorias');


const { cadastraTransacao, detalhaTransacao, listarTransacao, atualizarTransacao, deletarTransacao, extrato, totalExtrato } = require('./Controladores/transacoes');

const rotas = express();

rotas.use(express.json())

rotas.post('/usuario', verificaDadosCadastro, cadastraUsuario);
rotas.post('/login', verificaDadosLogin, login);

rotas.use(verificaToken);

rotas.get('/usuario',listarUsuarios)
rotas.get('/categoria',listarCategorias)
rotas.put('/usuario', atualizarUsuario)

rotas.post('/transacao', verificaDadosTransacao, cadastraTransacao)
rotas.get('/transacao',listarTransacao)
rotas.get('/transacao/extrato',extrato)
rotas.get('/transacao/:id', detalhaTransacao)
rotas.put('/transacao/:id',atualizarTransacao)
rotas.delete('/transacao/:id',deletarTransacao)


rotas.post('/transacao', verificaDadosTransacao, cadastraTransacao);
rotas.get('/transacao/:id', detalhaTransacao);
module.exports = rotas;