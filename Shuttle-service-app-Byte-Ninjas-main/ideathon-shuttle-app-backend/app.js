const express = require('express');
const cors = require('cors');
const expressQueue = require('express-queue')
// const { router } = './routes/all_routes';
const PORT = 5000;
const fs = require('fs')
const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.1.2:3000']
}));
app.use(expressQueue({ activeLimit: 1, queuedLimit: 100 }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const router = express.Router();

app.use('/routes', router);

const shuttleList = require('./object_records/shuttle.json');
const activeShuttles = {
    "KA123456781":{
        lat:13.04252, lng:77.62078
    }
}
const req = require('express/lib/request');

router.get('/', (req, res)=>{
    res.send('Hello');
});
router.post('/register', (req, res) => {
    console.log(req.body);
    const userData = require('./object_records/user.json');
    
    if(userData.hasOwnProperty(req.body.email)){

        
     res.send({success: false, error: 'User already exists'});
     }else{
        userData[req.body.email] = req.body;
        fs.writeFile('./object_records/user.json', JSON.stringify(userData), (err) => {
            console.log('Updated');
            res.send({success: true});
        });
     }
});

router.post('/login', (req, res) => {
    const userData = require('./object_records/user.json');
    
    if(!userData.hasOwnProperty(req.body.email)){   
     res.send({success: false, error: 'Please enter valid user details'});
     }else if(userData[req.body.email].password !== req.body.password){
        res.send({success: false, error: 'Please enter valid user details'});
    }else{
            res.send({success: true});
        }
});

router.get('/activeshuttles', (req, res) => {
    for(let key in activeShuttles){
        activeShuttles[key].lat += 0.001;
        activeShuttles[key].lng += 0.001;
    }
    res.send(activeShuttles);
});

router.post('/updateshuttlelocation', (req, res) => {
    activeShuttles[req.body.shuttleid] = {lat: req.body.lat, lng: req.body.lng};
    activeShuttles["KA123456781"] = req.body;
    console.log(activeShuttles);
    res.send({success: true});
});

router.post('/loginshuttle', (req, res) => {
    console.log('Shuttle Login', req.body);
    if(shuttleList.hasOwnProperty(req.body.vehiclename) && !shuttleList[req.body.vehiclename].isloggedin){
        if(shuttleList[req.body.vehiclename].password === req.body.password){
            console.log('shuttle login status: ',shuttleList[req.body.vehiclename].isloggedin);
            shuttleList[req.body.vehiclename].isloggedin = true;
            res.send({success: true});
        }
    }else if(shuttleList[req.body.vehiclename].isloggedin)
        res.send({success: false, error: 'Already logged in another device'});
    else
        res.send({success: false, error: 'Please log in with proper credentials'});
});

router.post('/starttrip', () => {
    activeShuttles.add
})


app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
