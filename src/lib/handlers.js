const fs = require("node:fs");
const currentUser = require("./auth");


exports.home=(req,res)=>{
  const user = currentUser.name;
  const fetchDetails = currentUser.fetch??{title:"profiler",user};
  //console.log(user);
  if(user){
    //console.log("rendering");
    res.render("home", fetchDetails);
  }else{
    //console.log("redirecting");
    res.redirect(302,"/login");
  }
}

exports.signup = (req,res)=>{
  res.render("signup",{title: "signup"});
}

exports.login = (req,res)=>{
  res.render("login",{title: "login"});
}

exports.processSignup = (req,res)=>{
  const body = req.body;
  //console.log(body);
  const file = __dirname.replace("lib","users.json");
  fs.readFile(file,"utf8",(err,data)=>{
    if(err){
      console.log(err);
      res.status(500).json({message: "server error"});
      return;
    }
    const users = JSON.parse(data);
    if(users.some(user=>user.email === body.email)){
      res.status(409).json({message: "email already exist"})
      return;
    }
    users.push(body);
    fs.writeFile(file,JSON.stringify(users),(err)=>{
      if(err){
	console.log(err);
	res.status(500).json({message: "Server error"});
	return;
      }
      currentUser.name =  req.body.displayName;
      res.json({message: "success",user: currentUser.name});
    })
  })
}

exports.processLogin = (req,res)=>{
  //console.log("login")
  const body = req.body; 
  const file = __dirname.replace("lib","users.json");
  fs.readFile(file,"utf8",(err,data)=>{
    if(err){
      console.log(err);
      res.status(500).json({error: err});
      return;
    }
    const users = JSON.parse(data);
    const user = users.filter(user=>{
      return (user.email ===  body.email && user.passcode ===body.passcode)
    })
    //console.log(user);
    if(user[0]){
      currentUser.name=user[0].displayName;
      res.json({msg:"success",user:currentUser.name});
    }else {
      res.status(404).json({error: err});
    }
  })
}

exports.notFound = (req,res)=>{
  const path = req.url;
  res.status(404).render("404",{path,title:"page not found",port:3000});
}

/*eslint-disable no-unused-vars */
exports.serverError = (err,req,res,next)=>{
  res.status(500).render("500",{err: err.message,title: "server error"});
}
/* eslint-enable no-unused-vars */

exports.apiSearch = (req,res)=>{
  const body = req.body;
  if(!body.queryString){
    res.status(400).json({message: "Bad request: no query string"});
    return;
  }
  const apiUrl = `https://api.github.com/users/${body.queryString}`;
  //console.log(apiUrl);
  fetch(apiUrl)
    .then(resp=>{
      if(resp.ok)return resp.json();
      throw new Error("something went wrong");
    })
    .then(data=>{
      console.log("data",data);
      const {name,location,bio,login,following,followers,avatar_url} = data;
      currentUser.fetch = {
	title: "profiler",
	src: avatar_url,
	user: currentUser.name,
	publicRepos: data.public_repos,
	additionalInfo: [
	  {
	    className: "twitter",
	    value: "@"+data.twitter_username,
	    icon: "fa fa-twitter",
	    href: `https://www.twitter.com/${data.twitter_username}`,
	  },
	  {
	    className: "github",
	    value: login.slice(0,20),
	    icon: "fa fa-github",
	    href: data.html_url,
	  }
	],
	name,
	login,
	following,
	followers,
	bio,
	location,
      };
      res.json({message: "success"});

    })
    .catch(err=>{
	console.log(err)
      res.status(404).json({message:"Something is wrong"});
    })
}
