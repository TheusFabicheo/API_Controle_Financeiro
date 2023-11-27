const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const cadastraUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;
try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const params = [nome, email, senhaCriptografada];
    const query = await pool.query('INSERT INTO usuarios(nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email', params);
    return res.status(201).json(query.rows[0]);
} catch (error) {
    return res.status(500).json({mensagem:"Ocorreu um erro interno no servidor."})
}

}

const login = async (req, res) => {
    const {email, senha} = req.body;

    const query = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if(query.rowCount < 1){
        return res.status(400).json({mensagem: "O email não cadastrado"});
    }
    const login = bcrypt.compare(senha, query.rows[0].senha);
    if(!login){
        return res.status(401).json({mensagem: "Email ou senha incorretos"});
    }
    const tokenJWT = jwt.sign({id: query.rows[0].id}, process.env.JWT_SECRET, {expiresIn: '8h'});

    const retorno = {usuario : {
        id: query.rows[0].id,
        nome: query.rows[0].nome,
        email: query.rows[0].email
    },
    token: tokenJWT
}
    return res.status(200).json(retorno);


}

const listarUsuarios = async (req,res) =>{
    const {senha, ...perfilUsuario} = req.usuario

    return res.status(200).json(perfilUsuario)
    
}

const atualizarUsuario = async (req,res) =>{
    const {nome,email,senha} = req.body

    if(!nome || !email || !senha){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios'})
    }
    
    try{  
        const emailExistente = await pool.query('select * from usuarios where email = $1',
        [email])
        if(emailExistente.rowCount > 0){
            return res.status(400).json({mensagem: 'O email já existe!'})
        }
        const senhaCriptografada = await bcrypt.hash(senha,10)
        await pool.query('update usuarios set nome = $1, email = $2, senha = $3 where id=$4',
        [
            nome,
            email,
            senhaCriptografada,
            req.usuario.id
        ])
        return res.status(204).send()
    }catch(error){
        console.error('Erro interno do servidor:', error);
        return res.status(500).json({mensagem:'Erro interno do servidor'})
    }
    
}
module.exports = {
    cadastraUsuario,
    login,
    listarUsuarios,
    atualizarUsuario
}