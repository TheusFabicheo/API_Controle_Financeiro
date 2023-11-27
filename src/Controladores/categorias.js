const pool = require('../conexao');

const listarCategorias = async (req,res) =>{
    try{
        const lista = 'select * from categorias'

        const {rows, rowCount} = await pool.query(lista)

        if(rowCount < 1){
            return res.status(404).json({mensagem: "Nenhum produto cadastrado"});
        }

        res.status(200).json(rows)
    } catch(error){
        res.status(500).json({mensagem: 'Erro no servidor ao listar as categorias'})
    }
}

module.exports = {
    listarCategorias
}