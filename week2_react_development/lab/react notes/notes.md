npx create-react-app my-todo-app
cd my-todo-app
npm start

// packges
npm install react-router-dom


###### How to Fix the "0308010c:digital envelope routines::unsupported" Error
// To upgrade react-scripts to 5+, you can do it in two ways:

Uninstall and reinstall react-scripts
open the terminal and run 
`npm uninstall react-scripts`
run 
`npm install react-scripts`

Manually change the react script version
go to your package.json and change the react-script version to 5.0.2
delete the node_modules folder by running rm –rf node_modules
delete the package.lock.json file by running rm –rf package.lock.json
run npm install or yarn add, depending on the package manager you’re using