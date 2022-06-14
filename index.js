const express = require("express");
const app = express();
const pool = require('./db.js');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')


app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/Layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Home Route
app.get('/', async(req,res) => {
    try{
        res.render('Home');
    }
    catch(err){
        console.error(err);
    }
});

// Tour Packages Route
app.get('/tourpackages', async (req,res) => {
    try{
        const data = await pool.query('select q1.package_id,s_name,d_name,q2.date,q2.duration,q2.price,q2.rating from (select tms.tour_package.package_id,name as s_name from tms.tour_package,tms.location where s_location_id=location_id) as q1,(select tms.tour_package.package_id,name as d_name,tms.tour_package.date,tms.tour_package.duration,tms.tour_package.price,tms.tour_package.rating from tms.tour_package,tms.location where d_location_id=location_id) as q2 where q1.package_id=q2.package_id');
        res.render('TourPackages',{data:data.rows});
    }
    catch(err){
        console.error(err);
    }
   
});

// Locations Route
app.get('/locations', async (req,res) => {
    try{
        const data = await pool.query("select *from tms.location order by location_id desc");
        res.render('LocationDetails', {data: data.rows});
    }
    catch(err){
        console.error(err);
    }
});

app.get('/locations/add', async (req, res) => {
    try{
        res.render('AddLocation');
    }
    catch(err){
        console.error(err);
    }
});

app.get('/locations/:id', async (req,res) => {
    try{
        const {id} = req.params;
        const data = await pool.query("select *from tms.location where location_id=$1",[id]);
        res.render('EditLocation', {data: data.rows[0]});
    }
    catch(err){
        console.error(err);
    }
});

app.post('/locations/add', async(req,res) => {
    try{
        let id = await pool.query("select *from tms.count limit 1");
        id = id.rows[0];
        id = id['cnt'];
        let upd = await pool.query("update tms.count set cnt=$1 where cnt=$2",[id+1, id]);

        let {locationname, city, district, state, desc} = req.body;

        let newdata = await pool.query("insert into tms.location(location_id, name, city, district, state, description) values($1,$2,$3,$4,$5,$6)",[id+1, locationname, city, district, state, desc]);
        res.redirect('/locations');
    }
    catch(err){
        console.log(err);
        res.redirect('/locations');
    }
});

app.post('/locations/:id', async (req,res) => {
    try{
        const id = req.params.id;
        let {locationname, city, district, state, desc} = req.body;
        const newdata = await pool.query("update tms.location set name=$1, city=$2, district=$3, state=$4, description=$5 where location_id=$6", [locationname, city, district, state, desc, id]);
        res.redirect('/locations');
    }
    catch(err){
        console.error(err);
        res.redirect('/locations');
    }
});

app.post('/locations/delete/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const newdata = await pool.query("delete from tms.location where location_id = $1", [id]);
        res.redirect('/locations');
    }
    catch(err){
        console.error(err);
        res.redirect('/locations');
    }
});

app.listen(8000, () => {
    console.log("Server Listening At Port 8000");
})