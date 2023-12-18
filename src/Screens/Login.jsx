import { useEffect, useState } from "react";
import {  RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase.js'
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    let navigate = useNavigate ()
    useEffect(() => {
        try {
            auth.onAuthStateChanged((user) => {
                if (user){
                    console.log("user is signedin", user)
                    navigate('/steps')
                }
                else {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'requestOtp', {
                        'size': 'invisible',
                        'callback': (response) => {
                            console.log("captcha solved")
                        }

                    });
                }
            });
        } catch (error) {
            console.log(error)
        }
    }, [])
    let handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData.phone)
        let phone = "+91"+formData.phone
        signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
            .then((confirmationResult) => {
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                document.querySelector('#login div.left form:first-child').style.display = "none" 
                document.querySelector('#login div.left form:last-child').style.display = "block"

            }).catch((error) => {
                ("SMS not sent") 
                window.recaptchaVerifier.render().then((widgetId) => {
                    window.recaptchaVerifier.reset(widgetId);
                })
            });
    }
    let validateOtp = (e) => {
        e.preventDefault()
        window.confirmationResult.confirm(formData.otp).then((result) => {
            // User signed in successfully.
            console.log("user signedin successfullly")
            const user = result.user;
            console.log(user)
            // 
            // props.history.push('/home')
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            console.log("user could not sign in")
            // ...
        })
    }
    let phoneChange = (e) => {
        setFormData({ ...formData, phone: e.target.value })
        if (!e.target.checkValidity()) {
            setErrors({ ...errors, phone: 'Please enter a valid phone number' })
        } else setErrors({ ...errors, phone: '' })
    }
    let emailChange = (e) => {
        setFormData({ ...formData, email: e.target.value })
        if (!e.target.checkValidity()) {
            setErrors({ ...errors, email: 'Please enter a valid email' })
        } else setErrors({ ...errors, email: '' })
    }
    let otpChange = (e)=>{
        setFormData({...formData,otp:e.target.value})
        if(!e.target.checkValidity()){
            setErrors({...errors,otp:'Please enter a 6 digit OTP'})
        } else setErrors({...errors,otp:''})
    }
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        email: ''
    })
    const [errors, setErrors] = useState({
        phone: '',
        otp: '',
        email: ''
    })

    return (
        <section id="login">
            <div className="left">
                <form className="myform" onSubmit={handleSubmit}>
                    <fieldset>
                        <label htmlFor="phone">Phone Number : </label>
                        <input type="text" onChange={phoneChange} name="phone" pattern="[0-9]{10}" ></input>
                        <span>{errors.phone}</span>
                    </fieldset>
                    <fieldset>
                        <label htmlFor="email">Email : </label>
                        <input type="email" onChange={emailChange} name="email" ></input>
                        <span>{errors.email}</span>
                    </fieldset>
                    <button type="submit" id="requestOtp" className="submitbtn">Request OTP</button>
                </form>
                <form className="myform" onSubmit={validateOtp}>
                    <fieldset>
                        <label htmlFor="otp">OTP : </label>
                        <input type="text" onChange={otpChange} name="otp" pattern="[0-9]{6}"></input>
                        <span>{errors.otp}</span>
                    </fieldset>
                    <button type="submit" className="submitbtn">Validate OTP</button>
                </form>
            </div>
            <div className="right">
                {/* <img src="/garden-background.jpg" alt="garden"/> */}
            </div>
        </section>
    )
}
export default Login;