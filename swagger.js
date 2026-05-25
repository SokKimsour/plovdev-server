const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'PlovDev API',
    description: 'API Documentation'
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  tags: [
    { name: 'Auth', description: 'Auth endpoints' },
    {name : "Otp" , description : "Otp endpoints"} ,
    {name : "User profile" , description : "User profile endpoints"} ,
    {name : "Course" , description : "Course endpoints"} ,
    {name : "Section" , description : "Section endpoints"} ,
    {name : "Lesson" , description : "Lesson endpoints"} ,
    {name : "Category" , description : "Category endpoints"} ,
    {name : "Quizzes" , description : "Quizzes endpoints"} ,
    {name : "Course Progress" , description : "Course Progress endpoints"} ,
    {name : "Payment" , description : "Payment endpoints"} ,
  ]
};

const outputFile = './swagger-output.json';
const routes = [
  './server.js',
];

swaggerAutogen(outputFile, routes, doc);