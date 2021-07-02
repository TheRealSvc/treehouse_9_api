'use strict';

const express = require('express');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');



//  1 ----- User Routes --------------------------

// Route that returns the currently authenticated user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    let user = req.currentUser ;
    console.log(`Halloooo user ${user}`)
    res.status(200).json({ "message": `Current User is ${user.emailAddress}` });

}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    let user ;
    try {
        console.log("hierrrrrrr: create User ");
        res.location('/');
        user = await User.create(req.body);
        res.status(201).json({ "message": "User successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        console.log(error);
        throw error;
      }
    }
  })
);

// 2 ----- Course routes ---------------------- 
//A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll() ; 
    res.status(200).json(courses);
}));


//A /api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    res.status(200).json(course);
  } else {
    errHandler(404, "Course not found! ");
  }
}));

//A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
// Route that creates a new user.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  /*
  console.log(Object.keys(courseData));
  for (const [key, value] of Object.entries(courseData)) {
    console.log(`${key}: ${value}`);
  } */
  try {
      let courseData = req.body ;
      newCourse = await Course.create(courseData) //.then(x => console.log(x)) ;
      const { id } = newCourse;
      console.log(typeof(newCourse))
      console.log("Never gets here: (after create Course) ");
      res.status(201).location('/api/courses/' + id).end(); 
  } catch (error) {
      console.log(` 1: Error  `);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      console.log(" 2: Error ");
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      console.log(" 3: Error ");
      throw error;
    }
  }
})
);

//A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
      const course = await Course.findByPk(req.params.id);
          // extract the current user from request
          const { currentUser } = req; 
          if (course) {
              // And if the current user created the content, allow them to edit it. If not, a 403 forbidden is sent.
              if (currentUser.id === course.userId) {
                  await course.update(req.body);
                  res.status(204).end();
              } else {
                  res.status(403).end();
              }}
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
})
);




//A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
      const course = await Course.findByPk(req.params.id);
          // extract the current user from request
          const { currentUser } = req; 
          if (course) {
              // And if the current user created the content, allow them to edit it. If not, a 403 forbidden is sent.
              if (currentUser.id === course.userId) {
                  await course.destroy(req.body);
                  res.status(204).end();
              } else {
                  res.status(403).end();
              }}
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
})
);





module.exports = router;
