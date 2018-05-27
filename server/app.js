/*
    ***************************************
    **   SERVER-SIDE STARTUP JS FILE     **
    ***************************************
*/
'use strict';

// ==========    DEPENDENCIES     ==========
// Load Modules as object
const express = require("express");         // node express module
const path = require("path");               // path helper function
const request = require("request");         // request module
const bodyParser = require("body-parser");	// body-parser module


// ==========   CONSTANTS       ==========
// Define Constants
const node_port = process.env.PORT || 3000;
const client_dir = __dirname;
const server_dir = path.join(__dirname, "/../client");
console.log("Server-side directory: " + client_dir);
console.log("Client-side directory: " + server_dir);

// Define runtime environment variable POWERAI_VISION_WEB_API_URL
const poweraiVisionBaseUrl = "https://ny1.ptopenlab.com/AIVision/api";
const poweraiVisionModel = "/dlapis/f66f9e07-e063-4679-87f4-642b5ec191d1";
const poweraiVisionWebApiUrl = poweraiVisionBaseUrl + poweraiVisionModel
const MISSING_ENV = "Missing required runtime environment variable POWERAI_VISION_WEB_API_URL";
console.log("Web API URL: " + poweraiVisionWebApiUrl);


// ==========   MIDDLEWARES     ==========
// Create Express app instacne
var app = express();

// Define Routes
app.use(express.static(client_dir));
app.use(express.static(server_dir));

// Define bodyParser
app.use(bodyParser.json());

// Define Endpoint for form-data submission
if (!poweraiVisionWebApiUrl) { console.log(MISSING_ENV); }

app.post('/classify', function (req, result) {
    if (!poweraiVisionWebApiUrl) {
        console.log(MISSING_ENV);
        result.send({
            data: JSON.stringify({ error: MISSING_ENV })
        });
    } else {
        req.pipe(request.post({
            url: poweraiVisionWebApiUrl,
            agentOptions: {
                rejectUnauthorized: false,
            }
        }, function (err, resp, body) {
            if (err) { console.log(err); }
            console.log(body);
            result.send({
                data: body
            });
        }));
    }
});


// ==========   SERVER / PORT SETUP     ==========
// Start server on node port
app.listen(node_port, function () {
    console.log("Application started at localhost:" + node_port);
});
