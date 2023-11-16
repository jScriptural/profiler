
const form = document.forms.login;
console.log(form);


form.onsubmit = (event)=>{
  event.preventDefault();

  const formData = {
    email: form.email.value,
    passcode: form.passcode.value
  }

  const body = JSON.stringify(formData);
  const headers = {
    "Content-Type": "application/json",
  }
  fetch("/process/login",{method: "POST",headers,body})
    .then(res=>{
      if(res.status !== 200)throw new Error("This account does not exist in our database");
      return res.json();
    })
    .then(result=>{
      const user = encodeURIComponent(result.user.toLowerCase());
      console.log(user);
      alert(result.msg);
      location.replace(`/${user}`);
    })
    .catch(err=>alert(err.message));
}
