CREATE DATABASE dindin;

CREATE TABLE usuarios(
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
  );
  
  CREATE TABLE categorias(
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL
    );
    
    CREATE TABLE transacoes(
      id SERIAL PRIMARY KEY,
      descricao TEXT NOT NULL,
      valor INT NOT NULL,
      data TIMESTAMP NOT NULL DEFAULT now(),
      categoria_id INT REFERENCES categorias(id),
      usuario_id INT REFERENCES usuarios(id),
      tipo TEXT NOT NULL
      );
      
		INSERT INTO categorias(descricao) VALUES ('Alimentação');
    INSERT INTO categorias(descricao) VALUES ('Assinaturas e Serviços');
    INSERT INTO categorias(descricao) VALUES ('Casa');
    INSERT INTO categorias(descricao) VALUES ('Mercado');
    INSERT INTO categorias(descricao) VALUES ('Cuidados Pessoais');
    INSERT INTO categorias(descricao) VALUES ('Educação');
    INSERT INTO categorias(descricao) VALUES ('Família');
    INSERT INTO categorias(descricao) VALUES ('Lazer');
    INSERT INTO categorias(descricao) VALUES ('Pets');
    INSERT INTO categorias(descricao) VALUES ('Presentes');
    INSERT INTO categorias(descricao) VALUES ('Roupas');
    INSERT INTO categorias(descricao) VALUES ('Saúde');
    INSERT INTO categorias(descricao) VALUES ('Transporte');
    INSERT INTO categorias(descricao) VALUES ('Salário');
    INSERT INTO categorias(descricao) VALUES ('Vendas');
    INSERT INTO categorias(descricao) VALUES ('Outras receitas');
    INSERT INTO categorias(descricao) VALUES ('Outras despesas');