const pool = require('../conexao');
const jwt = require('jsonwebtoken');

const cadastraTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const {authorization} = req.headers;

    const token = authorization.split(' ')[1];

    const payload = jwt.decode(token);

    const params = [descricao, valor, data, categoria_id, payload.id, tipo];
try {
    if(tipo !== 'entrada' && tipo !== 'saida'){
        return res.status(400).json({mensagem: "O tipo precisa ser entrada ou saida apenas."})
    }
    const query = await pool.query('INSERT INTO transacoes(descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', params);
    return res.status(201).json(query.rows[0]);
} catch (error) {
    console.log(error.message);
    return res.status(500).json({mensagem: "Ocorreu um erro interno no servidor"})
}

}

const detalhaTransacao = async (req, res) => {
    const {id} = req.params;
    const {authorization} = req.headers;

    const payload = jwt.decode(authorization.split(' ')[1]);

try {
    const params = [Number(id), payload.id];
    const query = await pool.query('SELECT * FROM transacoes as t JOIN categorias ON t.categoria_id = categorias.id WHERE t.id = $1  AND usuario_id = $2', params)
    if(query.rowCount < 1) {
        return res.status(404).json({mensagem: "Transacao não encontrada"});
    }
    return res.status(200).json(query.rows[0]);
} catch (error) {
    console.log(error.message)
    return res.status(500).json({mensagem: "Ocorreu um erro interno no servidor"});
}
}

const listarTransacao = async(req,res) =>{
    const filtro = req.query.filtro;
    console.log(filtro);
    try{
    if(!filtro.filtro){
        const {rows: transacao} = await pool.query(
            'select * from transacoes where usuario_id = $1',
            [req.usuario.id]) 
        return res.json(transacao)
    }
    
    const query = await pool.query('SELECT * FROM transacoes WHERE usuario_id = $1 AND categoria = $2', []);
    

    }catch(error){
        return res.status(500).json({mensagem: "Ocorreu um erro interno no servidor"});
    }
}

const atualizarTransacao = async (req,res) => {
    const {descricao, valor, data, categoria_id, tipo} = req.body
    const {id} = req.params 

    if(!descricao || !valor || !data || !categoria_id || !tipo){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios'})
    }

    if(tipo !== 'entrada' && tipo !== 'saida'){
        return res.status(400).json({mensagem: "O tipo precisa ser entrada ou saida apenas."})
    }
    try{
        const existeTransacao = await pool.query(
            'select * from transacoes where id = $1 and usuario_id=$2',
            [   id,
                req.usuario.id
            ])

        if(existeTransacao.rowCount === 0){
            return res.status(404).json({mensagem: 'Não existe transações ativas'})
        }

        const existeCategoria = await pool.query(
            'select * from categorias where id = $1',
            [categoria_id]
        )
        
        if(existeCategoria.rowCount === 0){
            return res.status(404).json({mensagem: 'Categoria não encontrada'})
        }
        await pool.query(
            'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6 and usuario_id = $7',
            [
                descricao,
                valor,
                data,
                categoria_id,
                tipo,
                id,
                req.usuario.id
            ])
            return res.status(204).send()
    }catch(error){
        return res.status(500).json({mensagem: "Ocorreu um erro interno no servidor"});
    }
}

const deletarTransacao = async(req,res) => {
    const {id} = req.params

    try{
        const existeTransacao = await pool.query(
            'select * from transacoes where id = $1 and usuario_id = $2',
            [
                id,
                req.usuario.id
            ])

        if(existeTransacao.rowCount === 0){
            return res.status(404).json({mensagem: 'Não existe transações ativas'})
        }

        const deletar = await pool.query(
            'DELETE FROM transacoes WHERE id = $1 and usuario_id = $2', 
            [
                id, 
                req.usuario.id
            ])

        if (deletar.rowCount > 0) {
            return res.status(204).send()
        }

    }catch(error){
        return res.status(500).json({mensagem: "Ocorreu um erro interno no servidor"})
    }
}

const extrato = async (req, res) => {
    try{
        const calcularExtrato = await pool.query(
            `select
            sum(case when tipo = 'entrada' then valor else 0 end) as total_entrada,
            sum(case when tipo = 'saida' then valor else 0 end) as total_saida
            from transacoes
            where usuario_id = $1
            group by usuario_id`,
            [req.usuario.id]
        )
        if(calcularExtrato.rowCount === 0){
            return res.status(404).json({ mensagem: 'Não existem transações' })
        }
        const totalExtrato = {
            entrada: calcularExtrato.rows[0].total_entrada,
            saida: calcularExtrato.rows[0].total_saida
        }
        return res.status(200).json(totalExtrato)
    }catch(error){
        console.log(error)
        return res.status(500).json({mensagem: "Ocorreu um erro interno no servidor"})
    }
};
module.exports = {
    cadastraTransacao,
    detalhaTransacao,
    listarTransacao,
    atualizarTransacao,
    deletarTransacao,
    extrato
}