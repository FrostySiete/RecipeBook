const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

//pug, hope this works instead of ejs, just worked better for me.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 

// Index route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/recipes', (req, res) => {
    const query = 'SELECT * FROM recipes';
    db.query(query, (err, results) => {
      if (err) return res.status(500).send('Database error');
  
      const grouped = {};
      results.forEach(recipe => {
        if (!grouped[recipe.protein]) grouped[recipe.protein] = [];
        grouped[recipe.protein].push(recipe);
      });
  
      res.render('recipes', { title: 'All Recipes', recipesByProtein: grouped });
    });
  });
  

  app.get('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
  
    const recipeQuery = 'SELECT * FROM recipes WHERE id = ?';
    const ingredientsQuery = `
      SELECT ingredients.* FROM ingredients
      JOIN recipe_ingredients ON ingredients.id = recipe_ingredients.ingredient_id
      WHERE recipe_ingredients.recipe_id = ?
    `;
  
    db.query(recipeQuery, [recipeId], (err, recipeResults) => {
      if (err) return res.status(500).send('Database error');
      if (recipeResults.length === 0) return res.status(404).send('Recipe not found');
  
      const recipe = recipeResults[0];
  
      db.query(ingredientsQuery, [recipeId], (err, ingredientResults) => {
        if (err) return res.status(500).send('Database error');
  
        res.render('recipe', {
          title: recipe.name,
          recipe,
          ingredients: ingredientResults
        });
      });
    });
  });
  
  app.get('/add', (req, res) => {
    const query = 'SELECT * FROM ingredients';
    db.query(query, (err, results) => {
      if (err) return res.status(500).send('Database error');
      res.render('add-recipe', { title: 'Add Recipe', ingredients: results });
    });
  });

  app.post('/add', (req, res) => {
    const { name, protein, ingredientIds, instructions } = req.body;
    const ingredientIdArray = ingredientIds.split(',').map(id => parseInt(id.trim()));
  
    const insertRecipe = 'INSERT INTO recipes (name, protein, instructions) VALUES (?, ?, ?)';
    db.query(insertRecipe, [name, protein, instructions], (err, result) => {
      if (err) return res.status(500).send('Database error');
  
      const recipeId = result.insertId;
  
      const insertLinks = ingredientIdArray.map(ingredientId => [recipeId, ingredientId]);
      const insertLinkQuery = 'INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ?';
  
      db.query(insertLinkQuery, [insertLinks], (err2) => {
        if (err2) return res.status(500).send('Failed to link ingredients');
        res.redirect('/recipes');
      });
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
