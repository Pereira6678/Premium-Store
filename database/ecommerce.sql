-- Script SQL completo para o e-commerce
-- Compatível com phpMyAdmin
-- Banco: ecommerce_db

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Criar banco de dados
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS ecommerce_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- --------------------------------------------------------
-- 2. Criar tabela usuarios
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) DEFAULT NULL,
  endereco TEXT DEFAULT NULL,
  tipo ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_email (email),
  INDEX idx_usuarios_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Criar tabela categorias
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_categorias_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 4. Criar tabela produtos
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INT UNSIGNED NOT NULL DEFAULT 0,
  imagem VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_produtos_categoria (categoria_id),
  KEY idx_produtos_preco (preco),
  CONSTRAINT fk_produtos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 5. Criar tabela pedidos
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('pendente', 'pago', 'enviado', 'cancelado') NOT NULL DEFAULT 'pendente',
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pedidos_usuario (usuario_id),
  KEY idx_pedidos_status (status),
  CONSTRAINT fk_pedidos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 6. Criar tabela itens_pedido
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS itens_pedido (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  produto_id INT UNSIGNED NOT NULL,
  quantidade INT UNSIGNED NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_itens_pedido_pedido (pedido_id),
  KEY idx_itens_pedido_produto (produto_id),
  CONSTRAINT fk_itens_pedido_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_itens_pedido_produto
    FOREIGN KEY (produto_id) REFERENCES produtos (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 7. Inserir categorias de exemplo
-- --------------------------------------------------------
INSERT INTO categorias (nome) VALUES
  ('Eletrônicos'),
  ('Moda'),
  ('Casa'),
  ('Esportes');

-- --------------------------------------------------------
-- 8. Inserir produtos de exemplo
-- --------------------------------------------------------
INSERT INTO produtos (nome, descricao, categoria_id, preco, estoque, imagem) VALUES
  ('Notebook Premium', 'Notebook ultrafino com ótimo desempenho.', 1, 4999.90, 12, 'notebook.jpg'),
  ('Camiseta Premium', 'Camiseta confortável com tecido premium.', 2, 129.90, 50, 'camiseta.jpg'),
  ('Lâmpada de Mesa', 'Design moderno para ambientes sofisticados.', 3, 249.90, 20, 'lampada.jpg'),
  ('Bola de Basquete', 'Bola oficial para treino e partidas.', 4, 189.90, 30, 'bola.jpg');

-- --------------------------------------------------------
-- 9. Inserir usuário administrador de exemplo
-- --------------------------------------------------------
INSERT INTO usuarios (nome, email, senha_hash, telefone, endereco, tipo) VALUES
  ('Administrador', 'admin@ecommerce.com', '$2b$10$examplehashplaceholder', '11999999999', 'Rua Exemplo, 123', 'admin');

SET FOREIGN_KEY_CHECKS = 1;
