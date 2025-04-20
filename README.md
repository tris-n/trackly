<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="left">
  <a href="https://github.com/tris-n/trackly">
    <img src="https://trackly-ff4bcc1da5d5.herokuapp.com/static/media/logo.65ed2c854cf102d9650b.png" alt="Logo" width="80" height="80">
  </a>
  
<!-- ## project_title -->
<h3 align="left" style="font-size: 24px">Trackly</h3>

  <p align="left">
    A comprehensive application designed for businesses to efficiently track and manage software bugs.
    <br />
    <br />
    <a href="https://trackly-ff4bcc1da5d5.herokuapp.com">View Demo</a>
    ·
    <a href="https://github.com/tris-n/trackly/issues">Report Bug</a>
	<br />
	<br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#database">Database</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#deployment-notes">Deployment Notes</a></li>
      </ul>
    </li>
    <li>
		<a href="#usage">Usage</a>
	</li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
  <br />



<!-- ABOUT THE PROJECT -->
## About The Project

Trackly is a comprehensive solution designed for teams to effectively manage and track bugs in their software projects. Built with a modern stack, it facilitates seamless project, user, and ticket management.

![dashboard]


### Features

* Fullstack CRUD operations.
* User, project, and ticket creation.
* Role-based security and permissions.
* Automated database rollback and backup.
* Searchable documents and ticket history.
* Commenting and attachment upload system.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Built With

### Frontend
![Javascript]
![React]
![Material-UI]
![Redux]
![Firebase]
![Firestore]
![Framer Motion]
![ApexCharts]
![Dayjs]
![Toastify]

### Backend
![NodeJS]
![Mongoose]
![Express]
![bcryptjs]

### Database
![MongoDB]



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
	- Add storage to your project.
	- Set the storage rules as follows:
		```sh
		rules_version = '2';
		service firebase.storage {
			match /b/{bucket}/o {
				match /{allPaths=**} {
				allow read; 
				allow write: if request.resource.metadata.authenticated != null;
				allow delete: if resource.metadata.authenticated != null;
				}
			}
		}
		```
2. Create a MongoDB database at [MongoDB Cloud](https://cloud.mongodb.com/).

### Installation

1. Clone the repo:
	```sh
	git clone https://github.com/tris-n/trackly.git
	```
	
2. Enter the API details in the `backendenv.example` file:
	- For `MONGO_URI`, you'll need the MongoDB connection string.
	- You can find the connection string by clicking 'Connect' on your MongoDB database page, then selecting 'Connect to your application - drivers'.
	- Your connection string should look something like:
	```sh
	mongodb+srv://<username>:<password>@<databasename>.abc123.mongodb.net/?retryWrites=true&w=majority
	```
	- For `JWT_SECRET`, you can set it to anything you like.

3. Enter the API details in the `frontendenv.example` file (it is inside the frontend folder):
	- Here you can set the login details for the demo accounts after you have created them.
	- You'll also need to put in your Firebase project details for `REACT_APP_FIREBASE_CONFIG`.
	- These can be found by logging into [Firebase Console](https://console.firebase.google.com/), selecting your project, then selecting 'Project Settings' from the cog icon next to 'Project Overview' in the top left of the screen.
	- Scroll down and grab the `firebaseConfig` object, converting it to JSON (by putting the keys in quotation marks, i.e., `{"apiKey": "1234", "authDomain": "www.firebaseapp.com", etc.}`) before you paste it into the `frontendenv.example` file.

4. Rename `backendenv.example` and `frontendenv.example` files to `.env`.

5. `cd` to the root folder of the project if you're not already there.
6. Install the backend dependencies:
	```sh
	npm install
	```
7. Run the server:
	```sh
	npm run server
	```

8. `cd` to the `/frontend/` folder.
9. Install the frontend dependencies:
	```sh
	npm install
	```
10. Start the frontend:
	```sh
	npm run start
	```

### Deployment Notes
- When deploying, change `.env NODE_ENV` to 'production'.
- If using Heroku, it will autobuild the frontend.
- Remember to put your frontend and backend `.env` variables into Heroku.
- Remember to comment out the automated rollback and backup functions as needed.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Getting Started
Create an admin account at [https://trackly-ff4bcc1da5d5.herokuapp.com/register](https://trackly-ff4bcc1da5d5.herokuapp.com/register). Upon registration, it will automatically log you in.

![register]

### Live Demo
If you just want to demo the site without creating an account, you can click on one of the four role demos at [https://trackly-ff4bcc1da5d5.herokuapp.com/](https://trackly-ff4bcc1da5d5.herokuapp.com/).

![demo]

### The Dashboard
The dashboard displays the total number of projects, tickets, and users, as well as their current statuses.

![dashboard]

### Create Projects
Admins have the capability to create projects.

![projects]

### Create Users
Both admins and project managers can create user accounts.

![users]

### Create Tickets
All roles are granted the permission to create tickets.

![tickets]

### Tickets
A ticket provides a brief description of the bug, a more detailed explanation, the bug's type, its status, priority level, assignee, submitter, due date, and any screenshot attachments.

![singleticket]

Additionally, the system includes a feature for commenting and offers a comprehensive ticket history.

![comments]

![history]

Users can search through tickets using any combination of name, status, and priority.

![search]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Tristan - [trisn.work@gmail.com](mailto:trisn.work@gmail.com)

Project Link: [https://github.com/tris-n/trackly](https://github.com/tris-n/trackly)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- Frontend -->
[Javascript]: https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Material-UI]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white
[Redux]: https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white
[Firebase]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[Firestore]: https://img.shields.io/badge/Firestore-007ACC?style=for-the-badge&logo=firebase&logoColor=white
[Framer Motion]: https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white
[ApexCharts]: https://img.shields.io/badge/ApexCharts-000000?style=for-the-badge&logo=chart-dot-js&logoColor=white
[Dayjs]: https://img.shields.io/badge/Dayjs-2D2D2D?style=for-the-badge&logo=calendar&logoColor=white
[Toastify]: https://img.shields.io/badge/Toastify-FFCA28?style=for-the-badge&logo=react-toastify&logoColor=black

<!-- Backend -->
[NodeJS]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=node-dot-js&logoColor=white
[Mongoose]: https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=database&logoColor=white
[Express]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[bcryptjs]: https://img.shields.io/badge/bcrypt-023E8A?style=for-the-badge&logo=bcrypt&logoColor=white

<!-- Database -->
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white

<!-- Screenshots -->
[register]: readme/images/register.jpg
[demo]: readme/images/demo.jpg
[dashboard]: readme/images/dashboard.jpg
[projects]: readme/images/projects.jpg
[users]: readme/images/users.jpg
[tickets]: readme/images/tickets.jpg
[singleticket]: readme/images/singleticket.jpg
[overview]: readme/images/overview.jpg
[comments]: readme/images/comments.jpg
[history]: readme/images/history.jpg
[search]: readme/images/search.jpg