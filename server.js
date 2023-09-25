// const express = require("express");

// const app = express();

// const mongoose = require('mongoose');
// PORT = 5000;

// DB_URl = 'mongodb://0.0.0.0:27017';

// mongoose.connect(DB_URl);
// const conn = mongoose.connection;

// conn.once('open',()=>{
//     console.log("DB COnnected");
// })
// conn.on('error',()=>{
//     console.log("DB NOT connected");
// })
//////////////////////////////////////////////

/// run command -- npm run dev

/////////////////////
// import dependency 
const express = require('express')
const cors = require('cors');
const app = express()
const Product = require('./models/productModel')
const mongoose = require('mongoose');
const swaggerJSDocs = require('swagger-jsdoc')
const swaggerui = require('swagger-ui-express')
app.use(cors());
//middleware 
app.use(express.json());   //our app will understand json

const options = {
    definition:{
        openapi : '3.0.0',
        info:{
            title: 'Node JS api Project for MongoDb',
            version: '1.0.0'
        },
        servers:[{
            url: 'http://localhost:3000/'
        }]
    },
    apis:['server.js']
}



const swaggerSpec = swaggerJSDocs(options)
app.use('/swagger',swaggerui.serve, swaggerui.setup(swaggerSpec))

// /**
//  * @swagger
//  * /products:
//  *  get:
//  *      summary: This api is used to check if get method is working or not
//  *      description: This api is used to check if get method is working or not
//  *      responses:
//  *          200:
//  *              description: To test Get method
//  */
/**
 * @swagger
 * /products:
 *  get:
 *      summary: Get a list of products with pagination
 *      description: Get a list of products with pagination. Use the `pagenumber` query parameter to specify the page number.
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *          description: The page number for pagination (default is 1)
 *      responses:
 *          200:
 *              description: Successful response
 *          400:
 *              description: Invalid request
 */


// routes
app.get('/',(req,res)=>{
    res.send('Hello node api')
})
app.get('/test',(req,res)=>{
    res.send('Hello Nodemon! Welcome to Node')
})

// Crud APIs MongoDB


app.get('/products', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from query parameters, default to 1 if not provided
      const limit = parseInt(req.query.limit) || 3; // Get the limit from query parameters, default to 3 if not provided
  
      // Calculate the number of documents to skip based on the page and limit
      const skip = (page - 1) * limit;
  
      // Query the database with skip and limit
      const products = await Product.find({}).sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit);
  
      // Get the total count of products (for pagination)
      const totalCount = await Product.countDocuments();
  
      res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit), // Calculate total pages
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         id:
 *           type: string  # Change the type to "string"
 *         name:
 *           type: string
 *         quantity:
 *           type: int
 *         price:
 *           type: int
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         quantity:
 *           type: int
 *         price:
 *           type: int
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: To get a product by id
 *     description: To get a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String Id required  # Update the description
 *         schema:
 *           type: string  # Change the type to "string"
 *     responses:
 *       200:
 *         description: This is used to fetch data by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 */

// GetByID
app.get('/products/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        const prod = await Product.findById(id);
        res.status(200).json(prod);
    }catch(error){
        res.status(500).json({message:error.message})

    }
})

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: To delete a product by id
 *     description: To delete a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: String Id required  # Update the description
 *         schema:
 *           type: string  # Change the type to "string"
 *     responses:
 *       200:
 *         description: This is used to delete data by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 */
// DeleteBYID
app.delete('/products/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        const prod = await Product.findByIdAndRemove(id);
        res.status(200).json("Delete Successfully!!!!");
    }catch(error){
        res.status(500).json({message:error.message})

    }
})


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: This endpoint allows you to update a product's information by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Products'
 *     responses:
 *       200:
 *         description: Successful response containing the updated product data.
 */

//Update
app.put('/products/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);
        if(!product){
            return res.status(404).json({message: `Cannot find product with id ${id}`})
        }
        else{
            res.status(200).json("Successfullu Updated!!");
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

/**
 * @swagger
 * /products:
 *   post:
 *     summary: To insert a product
 *     description: To insert a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Products'
 *     responses:
 *       200:
 *         description: Added Successfully
 */

//Insert
app.post('/products', async(req,res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json("Added Successfully");
       // res.status(200).json(product);
    } catch(error){
        console.log(error.message);
        res.status(500).json({message : error.message})
    }
})

//Connection to MongoDb
DB_URl = 'mongodb://0.0.0.0:27017/Node_API';

mongoose.connect(DB_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(3000,()=>{
        console.log('Node api run on port 3000')
    })
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });