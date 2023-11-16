const express = require("express");
const exphbs =  require("express-handlebars");
const handlers = require("./lib/handlers.js");

const app = express();
const port = process.env.PORT || 3000;
const path = __dirname.replace("src","public");

app.use(express.static(path));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine(".html", exphbs.engine({
  defaultLayout: "index",
  extname: ".html"
}));
app.set("view engine","html");


app.get("/",(req,res)=>{
  res.redirect(308,"/login");
});
app.get("/signup",handlers.signup);
app.get("/login",handlers.login);
app.get("/:user",handlers.home);

app.post("/process/signup",handlers.processSignup);
app.post("/process/login", handlers.processLogin);
app.post("/api/search",handlers.apiSearch);

app.use(handlers.notFound);
app.use(handlers.serverError);


app.listen(port,()=>console.log(`server is listening at port ${port}`));


