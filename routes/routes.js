// import required modules/packages
const express = require("express");
const User = require("../models/user");
const validator = require("validator");

// router instance
const router = express.Router();

// app endpoints
// route handler documentation
/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '204':
 *         description: No users found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        return res.status(204).send('No users found');
      }
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).send('Something broke!');
    }
});

/**
 * @openapi
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *       required:
 *         - email
 *         - username
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with email and username.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal Server Error
 */

router.post('/users', async (req, res) => {
    try {
      const { email, username } = req.body;

      // Perform any necessary validation
      if(validator.isEmail(email) !== true){
        return res.status(400).send("Enter a valid email");
      }; 
      
      if(!username || username.length ===0 || username ===""){
        return res.status(400).send("Enter a valid username");
      }
  
      // Save the user to the database
      const newUser = new User({ email, username });
      await newUser.save();
  
      res.status(201).send('User saved');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  /**
 * @openapi
 * components:
 *   schemas:
 *     UpdatedUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *       required:
 *         - email
 *         - username
 */

  /**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user details by ID
 *     description: Update the email and username of a user based on their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: Updated user details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatedUser'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

router.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { email, username } = req.body;
  
      // Perform any necessary validation or checks here
  
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Update the user details
      user.email = email;
      user.username = username;
      await user.save();
  
      res.status(200).send('User updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  /**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user based on their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

router.delete('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // find user by id
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // remove the user
      await user.remove();
  
      res.status(200).send('User deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// export router instance
module.exports = router;