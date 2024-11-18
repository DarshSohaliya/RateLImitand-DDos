import express,{Request,Response} from 'express'
import rateLimit from 'express-rate-limit'
import cors from "cors"
const app = express()
const PORT =5000

app.use(express.json())
app.use(cors())

const otpLimiter = rateLimit({
    windowMs: 5 * 60 *1000,
    max:3,
    message:'Too Many requests , plese try again after 5 minites',
    standardHeaders:true,
    legacyHeaders:false,
})

const passwordResetLimiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:5,
    message: 'Too many password reset attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
})

const otpStore:Record<string,string> = {}


app.post('/generate-otp',otpLimiter, (req:any, res:any) => {
    const email = req.body.email

    if (!email) {
        return res.status(400).json({message:"Email is REquired"}) 
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
     otpStore[email] = otp

    console.log(`OTP fro ${email}:${otp}`);
    res.status(200).json({message:"OTP generated and logged"})
    
})

app.post('/reset-password',passwordResetLimiter,async(req:any, res:any) =>{
    const {email,otp,newPassword,token} = req.body

   const formData = new FormData()
   formData.append('secret','0x4AAAAAAA0R5WNiDYty4JPdbtPR5PIbow0')
   formData.append("response",token)

   const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
   const result = await fetch(url,{
    body:formData,
    method:'POST'
   })
   const resultData = await result.json();

   console.log(resultData);

  
   

    if (!email || !otp || !newPassword) {
        return res.status(400).json({message:"Email,OTP,and password are required"})
    }

    if (otpStore[email] === otp) {
        console.log(`Password for ${email} has been reset to:${newPassword}`);
         delete otpStore[email]
         res.status(200).json({message:"Password has been reset successfully"})
        
    }
    else {
        res.status(401).json({message:"Invalid OTP"})
    }
})


app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`);
    
})