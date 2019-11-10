echo "Starting server..."
SET DEBUG=*,-babel*,-send*,-express* 
rem ./node_modules/.bin/babel-node src/server/index.js
node ../src/server/index.js