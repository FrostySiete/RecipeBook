-- Create and use the database
DROP DATABASE IF EXISTS homework2;
CREATE DATABASE homework2;
USE homework2;

--=======================THIS IS NOT PERFECT but the SQL dump doesnt work bc I had a version mismatch
--=======================Since you can add your own recipes, populate more if you'd like.

-- Drop tables if they exist
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS ingredients;

-- Create ingredients table
CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  description TEXT
);

-- Create recipes table
CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  protein VARCHAR(50),
  instructions TEXT
);

-- Create join table
CREATE TABLE recipe_ingredients (
  recipe_id INT,
  ingredient_id INT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Insert sample ingredients
INSERT INTO ingredients (type, description) VALUES
  ('protein', 'Chicken breast'),
  ('vegetable', 'Carrot'),
  ('vegetable', 'Onion'),
  ('carb', 'Rice'),
  ('spice', 'Salt'),
  ('spice', 'Pepper'),
  ('protein', 'Ground beef'),
  ('carb', 'Pasta'),
  ('vegetable', 'Tomato'),
  ('dairy', 'Cheese');

-- Insert sample recipes
INSERT INTO recipes (name, protein, instructions) VALUES
  ('Grilled Chicken & Rice', 'Chicken', 'Grill the chicken and serve with rice and vegetables.'),
  ('Spaghetti Bolognese', 'Beef', 'Cook pasta and top with beef tomato sauce.'),
  ('Veggie Stir Fry', 'Vegetarian', 'Stir fry vegetables with rice and spices.');

-- Link recipes to ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES
  -- Grilled Chicken & Rice (id 1)
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
  -- Spaghetti Bolognese (id 2)
  (2, 7), (2, 8), (2, 9), (2, 5), (2, 6),
  -- Veggie Stir Fry (id 3)
  (3, 2), (3, 3), (3, 4), (3, 9), (3, 5), (3, 6);
