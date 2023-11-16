"use strict"
console.log("signup form");
const form = document.forms.signup;

form.onsubmit=(event)=>{
  event.preventDefault();
  const formData = {
    displayName: form.displayName.value,
    email: form.email.value,
    passcode: form.passcode.value,
    phoneNumber: form.phoneNumber.value
  };
  const body = JSON.stringify(formData);
  const headers = {
    "Content-Type": "application/json"
  }
  fetch("/process/signup",{method:"POST",headers,body})
   .then(res=>{
     if(res.status === 409)throw Error("email already exist");
     if(res.status >200 || res.status>=300)throw Error("sign up fail due to internal server error");

      return res.json();
    })
    .then(result =>{
      const user = encodeURIComponent(result.user.toLowerCase());
      console.log(user);
      alert(result.message)
      location.replace(`/${user}`);
    })
    .catch(err=>alert(err.message));
}
