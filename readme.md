# Project 1 - Pulse Check

## Scope

My app will have two views, one for a teacher and one for students.  The student view will work on a computer or a mobile phone.  It will be very simple.  The student will be given a multiple choice question with four choices.  They will press a button, and their answer will be sent to the server and recorded along with the amount of time that it took to answer.

The teacher view will have two options:  create a new question or view results.  When the teacher views the results, it shows which students answered correctly, which students answered incorrectly, and a pie chart breakdown of the answers.  This will allow the teacher to get a better understanding of where students are having trouble.

Stretch add-ons will include:
* trivia API game
* 3D visualization of results

## User Stories

**Admin**

The admin will log into the server and create or open questions
1. wireframe a page
2. create an hbs template
3. write a server route (get/post, update/delete) for the page
4. create a schema for question with attributes: question, correct answer, all answers
5. serve the page with information populated from the database

The teacher will log into the app and open a new question.
1. wireframe a page
2. create an hbs template
3. write a server route (get/post) for the page
4. serve the page with information populated from the database

The teacher will login to the webpage and view question results.
1. wireframe a page
2. create an hbs template
3. write a server route (get) for the page
4. serve the page with information populated from the database

The teacher will login to the webpage and view student results.
1. wireframe a page
2. create an hbs template
3. write a server route (get) for the page
4. serve the page with information populated from the database

** Student

The student will log into the server and view profile page.
1. wireframe a page
2. create a user schema with attributes for name, password, array of objects (question (referenced), user answer (ref), correct answer (ref))
3. create an hbs template
4. write a server route for the page
5. serve the page with information populated from the database

The student will log into the server and view app page.
1. wireframe a page
2. create an hbs template
3. write a server route (get/post) for the page
4. serve the page with information populated from the database

## Wireframes

1. Signup
![alt text](https://github.com/stevendnoble/project1/mockups/blob/master/signup.png "Sign Up Page")

2. Login
![alt text](https://github.com/stevendnoble/project1/mockups/blob/master/login.png "Log In Page")

3. Admin Profile
![alt text](https://github.com/stevendnoble/project1/mockups/blob/master/adminprofile.png "Admin Profile Page")

4. Admin App
![alt text](https://github.com/stevendnoble/project1/mockups/blob/master/adminapp.png "Admin App Page")

5. User Profile
![alt text](https://github.com/stevendnoble/project1/mockups/blob/master/userprofile.png "User Profile Page")

6. User App
![alt text](https://github.com/stevendnoble/project1/mockups/blob/master/userapp.png "User App Page")

## Data Models

*User Model*
Attributes:  name, password, array of objects (question, user answer, correct answer) which will be referenced to the question model

*Question Model*
Attributes:  question, correct answer, all answer options, percent correct, percent of each incorrect (to be stored and displayed after the questions are posed)

## Milestones

* Project planning
* User page
* Admin page
* Server setup
* Admin page rendered with database
* Authentication
* Routes firmed up
* Styling complete
* Deploy to Heroku

Stretch:
* Research external API for trivia questions
* Research 3D visualization for results