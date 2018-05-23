# Game of Thrones Battle API

Install modules:
> npm install 

Run application:
> npm start 


Example endpoints:
- localhost:5000/list
- localhost:5000/count
- localhost:5000/stats
- localhost:5000/search

     search arguments:
     * <b>king</b> - name of attacker or defender king (example: <b>localhost:5000/search?king=Joffrey/Tommen Baratheon</b> )
     * <b>location</b> - battle location (example: <b>localhost:5000/search?location=Riverrun</b> )
     * <b>type</b> - battle type  (example: <b>localhost:5000/search?type=ambush</b> )
     
     search route supports combination of arguments:
     
     <b>localhost:5000/search?type=ambush&king=Joffrey/Tommen Baratheon</b>
     
 This application also is on Heroku platform:
 
 https://enigmatic-chamber-75142.herokuapp.com/
 
 All data about battles placed to https://mlab.com/
     