import http from 'http';
import fetch from 'node-fetch';
import * as fs from 'fs'; 
import express from 'express';
import session from 'express-session';
const app= express();
const router = express.Router();
const port = 4000;
let temp;

const bodyData = `{
    "value": "<string>",
    "representation": "view"
  }`;




// const url = 'https://fefundinfo.atlassian.net/wiki/rest/api/content/2840789051?expand=body.view';
// const url = 'https://fefundinfo.atlassian.net/wiki/rest/api/content/2538405911?expand=body.styled_view,metadata.labels'; // GET 
// const url = 'https://fefundinfo.atlassian.netwiki/rest/api/contentbody/convert/774210015'; // POST 
// `Basic ${Buffer.from('kousigan.moni@fefundinfo.com:PGlAqdK9s1A0eRzCL6wqF558').toString('base64')}`

async function MyApp(id) {
    const url = 'https://fefundinfo.atlassian.net/wiki/rest/api/content/'+id+'?expand=body.styled_view  ';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic a291c2lnYW4ubW9uaUBmZWZ1bmRpbmZvLmNvbTpQR2xBcWRLOXMxQTBlUnpDTDZ3cUY1NTg=',
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json'
          },
      })
     .then(res => res)
     .catch(error=>{
        console.log('Bad request...!',error)
     })
     const content = await response.json()
     .catch(error=>{
        console.log('Invalid response...!',error)
     });
     return content;
}  

async function AttachmentLoader(url) {
    let actualUrl;
     const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic a291c2lnYW4ubW9uaUBmZWZ1bmRpbmZvLmNvbTpQR2xBcWRLOXMxQTBlUnpDTDZ3cUY1NTg=',
          },
      })
     .then(res => {
        // console.log(res.url)
        actualUrl = res.url
         })
      .catch(error=>{
        console.log('Bad request...!',error)
     })
      
     return actualUrl;
 }  
 app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Scripts", "*");
    res.header(
     "Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
 });

 let newUrl;
app.get('/img',(req,res)=>{
    // console.log(req.query.imgurl)
    AttachmentLoader(req.query.imgurl)
    .then(resp=> newUrl= resp)
    .then(()=>res.json({imgurlvalue:newUrl}))
    .catch(err=> {throw err});
})
app.get('/file',(req,res)=>{
    // console.log(req.query.fileurl)
    AttachmentLoader(req.query.fileurl)
    .then(resp=> newUrl= resp)
    .then(()=>res.json({fileurlvalue:newUrl}))
    .catch(err=> {throw err});
})
//  MyApp().then(res=>{ 
//     // console.log('async response...',res) 
//     temp = res;
// });

const sessionConfig = {
    secret: 'MYSECRET',
    name: 'appName',
    resave: false,
    saveUninitialized: false,
    cookie : {
      sameSite: 'none', // THIS is the config you are looing for.
    }
  };
// app.use(session(sessionConfig));

app.get('/api',(req,res)=>{
    // console.log(req.query)
    MyApp(req.query.pageid).then(resp=>{ 
        temp = resp;
        // res.send(String(resp.body.styled_view.value))
    })
    .then(()=> res.json(temp))
    .catch(err=> console.log(err))
    // res.cookie(  { sameSite: 'none', secure: true});
})

app.get('/page',(req,res)=>{
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            throw err; 
        }    
        else{
            res.send(String(html));
        }
    })
})

app.get('/help',(req,res)=>{
    MyApp(req.query.pageid).then(resp=>{ 
       let tempData =String(resp.body.styled_view.value);
        fs.writeFile("test.html", tempData, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            // console.log(fs.readFileSync("test.txt", "utf8"));
            fs.readFile('./test.html', function (err, html) {
                if (err) {
                    throw err; 
                }    
                else{
                    res.send(String(html));
                }
            })
        }
        });
    })
    .catch(err=>console.log(err))
})
// 
app.listen(port,()=>{
    console.log('Server running on port:', port);
})

var content=undefined;

// fs.readFile('./index.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }       
//     http.createServer(function(request, response) {  
//         response.writeHeader(200, 
//             {
//                 "Content-Type": "text/html; charset=utf-8;",
//                 "Access-Control-Allow-Origin":"*"
//             });  
//         content = temp;
//         response.write(content,'utf8'); 
//         response.end();  
//     }).listen(port,(error) => {
//             if (error) {
//                 console.log('Error:', error)
//             }
//             else {
//                 console.log('Server is running on port ', port)
//             }
//         })
// });

// http.createServer(function(request, response) {  
//     response.writeHeader(200, 
//         {
//             "Content-Type": "text/html; charset=utf-8;",
//             "Access-Control-Allow-Origin":"*"
//         });  
        
//      response.write(temp,'utf8'); 
//     response.end();  
// }).listen(port,(error) => {
//         if (error) {
//             console.log('Error:', error)
//         }
//         else {
//             console.log('Server is running on port ', port)
//         }
//     })