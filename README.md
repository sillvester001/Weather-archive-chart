## Task
Implement visualization of changes in temperature and precipitation levels over the past.

## Technical task
- by default, the user should see temperature change data **for the entire period**, that is, all data received from the server should be used
- the user should be able to specify the period up to a year
- the interface should not be "frozen" and the user should be able to select all controls at any time
- to display the graph use Canvas
- data from IndexedDB is used to build a graph
- data on the client is stored in two tables temperature and precipitation
- data for each of the tables is requested from the server separately
- if there is no data in the table, the data for it is requested from the server
- data from the server are requested on demand when the corresponding data was requested from the local database and they were not found in it
- record **for a single day** must be stored as a **separate object/record** in IndexedDB


## Technical requirements
- you can not use third-party libraries for drawing graphs and working with IndexedDb
- the application must work in the latest versions of Chrome and Firefox

- install dependencies
     ```
     npm install
     ```

- run
     ```
     npm start
     ```