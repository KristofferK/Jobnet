# Jobnet
When you are unemployed in Denmark it is mandatory to check the job proposals at jobnet.dk at least once a week to receive "dagpenge" (unemployment benefits).
We will automate this task with Nodejs and Puppeteer.
 
Kenneth (~~a jobless rat with minimal education~~a friend of mine) asked me to make this project for him.

# Installation
* Update ```./src/jobnet-credentials.ts``` with your Jobnet credentials. Please note that NemID is **not** supported.
* Run the script using ```npm start```.

# Cron
You should run the script every now and then. You probably don't want to run it too often, asi t might seem suspicious, if it runs every five minutes throughout the day.
Instead you might want to run it once every other day.
```30 9 1-31/2 * * /usr/local/bin/node /home/username/Jobnet/script.js```