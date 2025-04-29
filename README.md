This project is built using Nextjs. 
Folder structure: 
- /public: it has all the assets like images(in svg), icons and fonts info.
- /src: it contains all info related to our main app
- Inside src folder we have below mentioned folders :
- /app: that contains all the pages related code and inside app there is /api folder too for having the backend api route related code and (auth) has the signup and login page code.
- /components: it contains all the reusable UI component code
- /data: has some hardcoded data values
- /db: it contains the database connection code
- /models: has the MongoDB schema related code
- /utils: it has some reusable functions used throughout the app
- middleware.js: has the middleware auth-related code  

### setup instructions
- Clone the project
```bash
git clone your-github-url
```
- Navigate to the Project Directory
```bash
cd Snatch
```
- Install Dependencies (make sure you are in root folder)
```bash
npm install
```
-  Run the Development Server
```bash
npm run dev
```
