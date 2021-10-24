# Donate Fullstack JS App 
<p align="center">
  <img src="https://user-images.githubusercontent.com/55238814/138575036-1f96e640-e13f-4859-bcda-08b7c4353dbc.png" width="500" height="auto">
</p>
For execute this App on your host, you need to do next steps: 

1. Prepare your system
    * install nodejs v14.18.x
    * install mongodb v5.0.x
    * **mongodb** create db with name 'donateApp'
    * **mongodb** create user (login: donateApp, pass:donateApp) with read/write permissions on db 'donateApp', 

2. Clone app from github
    * `git clone https://github.com/meekot/donate-app.git`
    * `cd donate-app`

3. Installing dependencies
    * `npm install`
 
4. Config environement (if need) *you can config DB settings, and ports for developement and production modes*
    * `vim .env`

5. Run app 
    * dev mode full : `npm run dev` *after open http://localhost:8080/ in your browser*
    * prod mode full: `npm run start` *after open http://localhost:8081/ in your browser*
    * dev-mode back: `npm run dev-back`
    * prod mode back: `npm run start-back`
    * dev mode front: `npm run serve-front`
    * prod mode front: `npm run build-front`

