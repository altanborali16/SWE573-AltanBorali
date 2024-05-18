# SWE573-AltanBorali

## Docker

projectrepo/community_back_end/community_back_end/settings.pyy from code line 120-143 should be active.
projectrepo/community_back_end/community_back_end/settings.pyy from code line 110-119 should be deactive.

project repo > docker-compose up --build

It takes about 5min to build.

It also takes time to build http://localhost:3000/ so please be patient :)

When you once docker-compose up --build for the next sessions you can use docker-compose-up or run it from docker desktop

## Local Run

### Back-end

projectrepo/community_back_end run => pip install requirements.txt

Database created for postgresql if you do not have it you can download from => https://www.postgresql.org/
With that you can also use pgAdmin.

projectrepo/community_back_end/community_back_end/settings.pyy from code line 120-143 should be deactive.
projectrepo/community_back_end/community_back_end/settings.pyy from code line 110-119 should be active.
projectrepo/community_back_end/community_back_end/settings.py =>Refill datbase information
![image](https://github.com/altanborali16/SWE573-AltanBorali/assets/93518063/a75000e6-04dc-48ad-a5db-d653f266bdb3)

projectrepo/community_back_end :

run python manage.py makemigrations

run python manage.py migrate

After that step your database tables should be created.

To run backend => python manage.py runserver


### Front-end
If you dont have node.js first download node.j from https://nodejs.org/en/download/current

projectrepo/communit_front_end :

run npm i  or run npm install (only once)

run npm start (on every start)
