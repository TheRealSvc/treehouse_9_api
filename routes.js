'use strict';

const express = require('express');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');


//
//  1 ----- User Routes -----------------------------------------------------
//

// Route that returns the currently authenticated user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    let user = req.currentUser ;
    res.status(200).json({ 
      "message": "current user",
      "id": user.id,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "emailAddress": user.emailAddress});
}));



// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    let user ;
    try {
        user = await User.create(req.body);
        res.status(201).location("/").end();
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


//
// 2 ----- Course routes ------------------------------------------------------
//

// function to filter the json array (array of objects) ... potential for improvement :-)
// it's also the place for output formatting 
function filterJson(data, keep) {
let res = [] ; 
for (var i=0 ; i < data.length; i+=1) {
  let entry = {}
  for (let j = 0; j < Object.keys(data[i].dataValues).length; j+=1 ) {
    if(keep.includes(Object.keys(data[i].dataValues)[j])) {
      entry[Object.entries(data[i].dataValues)[j][0] ] = Object.entries(data[i].dataValues)[j][1] 
    } 
  }
  res.push(entry) ;
}
return res;
}


//A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll() ; 
    const display = ["id", "title", "description", "estimatedTime", "materialsNeeded"] ;
    let ress = filterJson(courses, display);
    res.status(200).json(ress);
}));


//A /api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    res.status(200).json({
      "id": course.id ,
      "title": course.title , 
      "description": course.description , 
      "estimatedTime": course.estimatedTime , 
      "materialsNeeded": course.materialsNeeded 
    });
  } catch (error) {
    console.log(error) ;
    errHandler(404, "Course not found! ");
  }
}));


//A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
// Route that creates a new user.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
      let courseData = req.body ;
      const newCourse = await Course.create(courseData) 
      const { id } = newCourse;
      res.status(201).location('/api/courses/' + id).end(); 
  } catch (error) {
      console.log(error);
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

//A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
      const course = await Course.findByPk(req.params.id);
          const { currentUser } = req; 
          if (course) {
              if (currentUser.id === course.userId) { // cases: is authenticated (204) / not authenticated (403)
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
              if (currentUser.id === course.userId) { // cases: is authenticated (204) / not authenticated (403)
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
