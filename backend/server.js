
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
app.use(bodyParser.json());

const client = new pg.Client({
  user: 'postgres',
  database: 'LearnLink',
  password: 'Cesarazpi123@A',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }

  console.log('Connected to PostgreSQL database');
});

// GET request to fetch all courses
app.get('/', (req, res) => {
  
    // Execute the SQL query
    client.query('SELECT * FROM Courses ORDER BY id ASC', (err, result) => {
      if (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Error fetching courses');
        return;
      }
  
      // Send the fetched courses as JSON
      res.status(200).json(result.rows);
    });
  });

//GET a course by id
app.get('/:id' , (req , res) => {
    const id = parseInt(req.params.id);
    client.query('SELECT * FROM Courses where id = $1' , [id] , (error , results)=> {
        if(error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

//Delete a course by id
app.delete('/:id' , (req , res) => {
    const id = parseInt(req.params.id);
    client.query(`DELETE FROM Courses where id = $1` , [id] , (error , results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`USER DELETED WITH ID : ${id}`)
    })
})

//Update a course
app.patch('/:id' , (req , res) => {
    const id = parseInt(req.params.id)
    const{name , description , instructor , genre} = req.body;

    client.query(
            `UPDATE courses SET name = $1 , description = $2 , instructor = $3 , genre = $4`,
            [name , description , instructor , genre],
            (error , results) => {
                if(error)
                {
                    throw error;
                }
                res.status(200).send( `Course modified with ID : ${id}`);
            }
    )
})
// POST request to create a new course
app.post('/courses', (req, res) => {
  const { name, description, instructor, genre } = req.body;

  client.query(
    `INSERT INTO Courses (name, description, instructor, genre) VALUES ($1, $2, $3, $4)`,
    [name, description, instructor, genre],
    (err) => {
      if (err) {
        console.error('Error inserting course:', err);
        res.status(500).send('Error inserting course');
        return;
      }

      res.status(200).send('Course inserted successfully');
    }
  );
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});