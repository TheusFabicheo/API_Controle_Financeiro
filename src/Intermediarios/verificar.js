const pool = require('../conexao');
const jwt = require('jsonwebtoken');

const verificaDadosCadastro = async (req, res, next) => {
    const {nome, email, senha} = req.body;

    if(!nome){
        return res.status(400).json({mensagem:"O nome é obrigatório!"})
    }
    else if(!email){
        return res.status(400).json({mensagem:"O email é obrigatório!"})
    }
    else if(!senha){
        return res.status(400).json({mensagem:"A senha é obrigatória!"})
    };

    const params = [email];
    const query = await pool.query('SELECT * FROM usuarios WHERE email = $1', params)
    if(query.rowCount >= 1){
        return res.status(400).json({mensagem:"Este email já esta cadastrado"});
    }
    next();
}

const verificaDadosLogin = async (req, res, next) => {
    const {email, senha} = req.body;

    if(!email){
        return res.status(400).json({mensagem: "O campo email é obrigatório"})
    } else if(!senha){
        return res.status(400).json({mensagem: "A senha precisa ser informada"})
    };
    next()
}

const verificaToken = async (req, res, next) => {
    const {authorization} = req.headers;
    
    if(!authorization){
        return res.status(401).json({mensagem:'Para acessar este recurso um token de autenticação válido deve ser enviado.'})
    }
    const token = authorization.split(' ')[1]
    
   try{
    const {id} = jwt.verify(token, process.env.JWT_SECRET)
    const {rows,rowCount} = await pool.query(
        'select * from usuarios where id = $1',
        [id]
    )
    
    if(rowCount <1){
        return res.status(401).json({mensagem:'Para acessar este recurso um token de autenticação válido deve ser enviado.'})
    }

    req.usuario = rows[0]

    next()
   }catch(error){
    return res.status(401).json({mensagem:'Para acessar este recurso um token de autenticação válido deve ser enviado.'})
   }

}

const verificaDadosTransacao = async (req, res, next) => {
        const { descricao, valor, data, categoria_id, tipo } = req.body;

        if(!descricao || !valor || !data || !categoria_id || !tipo){
            return res.status(400).json({mensagem: "Todos os campos são obrigatórios"});
        }

        //if(tipo !== "entrada" || tipo !== "saida"){
          //  return res.status(400).json({mensagem: "Os tipos aceitos são: entrada ou saida"});
        //}

        const params = [categoria_id];
        const query = await pool.query('SELECT * FROM categorias WHERE id = $1', params);

        if(query.rowCount < 1){
            return res.status(404).json({mensagem: "O id da categoria informado não existe."})
        };

        next()
}

module.exports = {
    verificaDadosCadastro,
    verificaDadosLogin,
    verificaToken,
    verificaDadosTransacao
}