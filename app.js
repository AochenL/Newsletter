const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post('/', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
        }
    ]
};
    const jsonData = JSON.stringify(data);

    const apiKey = "df1884c0312d0d35ef7409526457f4c5-us12"
    const listID = "fead518e55"
    const url = 'https://us12.api.mailchimp.com/3.0/lists/fead518e55?skip_merge_validation=<false>&skip_duplicate_check=<false>'

    const options = {
        method:"POST",
        auth:"aochenLiu:"+apiKey
    }

    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
            const state = response.statusCode;
            console.log(state);
            if (state === 200){
                res.sendFile(__dirname+"/success.html");
            } else{
                res.sendFile(__dirname+"/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();

});

app.post('/failure', function(req, res){
    res.redirect('/');
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000.");
});
