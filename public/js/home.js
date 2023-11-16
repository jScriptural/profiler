
const form = document.forms.search;

console.log(form);

form.onsubmit= event=>{
  event.preventDefault();
  const queryString = form.username.value;
  const body = JSON.stringify({queryString});
  const headers = {"Content-Type": "application/json"};
  fetch("/api/search",{method:"POST",body,headers})
    .then(res=>{
      if(res.status !== 200){
	throw new Error("No such user profile/account");
      }
     return  res.json();
    })
    .then(data=>{
      console.log(data);
      location.reload()
    })
    .catch(err=>console.log(err.message))

}
