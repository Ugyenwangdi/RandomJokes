const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); 

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const results = ["This line doesn't actually do anything, but the code stops working when I delete it."];

app.get("/", function(req, res){
    
    res.render("index", {
        jokes: results
    });
})

app.post("/", function(req, res){

    const categories = [req.body.category];
    const flags = req.body.flag;
    const types = req.body.type;

    const baseURL = "https://v2.jokeapi.dev";
    const params = [
        "blacklistFlags="+flags,
        "type="+types
    ];

    https.get(`${baseURL}/joke/${categories.join(",")}?${params.join("&")}`, response => {
        
        response.on("data", chunk => {
            // On data received, convert it to a JSON object
            let randomJoke = JSON.parse(chunk.toString());

            if(randomJoke.type == "single")
            {
                // If type == "single", the joke only has the "joke" property
                let joke = randomJoke.joke;
                results[0] = joke;  
                res.redirect("/");
            }
            else
            {
                // If type == "twopart", the joke has the "setup" and "delivery" properties
                let setup = randomJoke.setup;
                results[0] = setup;  
                setTimeout(() => {
                    let delivery = randomJoke.delivery;
                    results[1] = delivery;  
                }, 3000);
                res.redirect("/");
            }
        });

        response.on("error", err => {
            // On error, log to console
            console.error(`Error: ${err}`);
            res.redirect("/");
        });
    });

    

})


app.listen(3000, function(){
    console.log("Server started running on port 3000...");
})






