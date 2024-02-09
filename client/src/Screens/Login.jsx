import { useContext, useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase.js'
import { useNavigate } from "react-router-dom";
import countryCodes from '../utils/countryCodes.json'
import { hideLoader, showLoader } from "../utils/loader.js";
import toast from 'react-hot-toast'
import { globalContext } from "../App.js";

const Login = (props) => {
    let navigate = useNavigate()
    let countryCodeSize = 6;
    const { user, stepsData, setUser } = useContext(globalContext)
    useEffect(() => {
        try {
            console.log(stepsData)
            if (user && stepsData !== undefined && stepsData.steps !== false) {
                console.log("user is signedin")
                navigate('/')
            }
            else {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'requestOtp', {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log("captcha solved")
                    },
                });
            }
        } catch (error) {
            console.log(error)
        }
    }, [user, stepsData])
    let handleSubmit = (e) => {
        e.preventDefault()
        let phone = "+" + formData.countryCode + formData.phone
        console.log(phone)
        showLoader()
        signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
            .then((confirmationResult) => {
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                document.querySelector('#login div.left form:first-child').style.display = "none"
                document.querySelector('#login div.left form:last-child').style.display = "block"
                hideLoader()
            }).catch((error) => {
                console.log("SMS not sent", error)
                window.recaptchaVerifier.render().then((widgetId) => {
                    // window.recaptchaVerifier.reset(widgetId);
                    window.location.reload()
                    toast.error("SMS not sent. Please try again ! ", { duration: 2000 })
                })
                hideLoader()
            });
    }
    let validateOtp = (e) => {
        e.preventDefault()
        showLoader()
        window.confirmationResult.confirm(formData.otp).then(async (result) => {
            // User signed in successfully.
            console.log("user signedin successfullly")
            const user = result.user;
            setUser(user)
        }).catch((error) => {
            if (error.response && error.response.status === 404 && error.response.data!==undefined && error.response.data.steps === false) {
                navigate('/steps')
            } else {
                console.log(error)
                // User couldn't sign in (bad verification code?)
                console.log("user could not sign in")
            }
        })
    }
    let phoneChange = (e) => {
        setFormData({ ...formData, phone: e.target.value })
        if (!e.target.checkValidity()) {
            setErrors({ ...errors, phone: 'Please enter a valid 10 digit phone number' })
        } else setErrors({ ...errors, phone: '' })
    }
    let countryCodeChange = (e) => {
        if (e.target.value === "") {
            setErrors({ ...errors, countryCode: '' })
            setFormData({ ...formData, countryCode: e.target.value })
        } else {
            let found = false;
            for (let i = 0; i < countryCodes.length; i++) {
                if (countryCodes[i].dial_code === e.target.value) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                setErrors({ ...errors, countryCode: 'Please enter a valid country code without +' })
            } else {
                setErrors({ ...errors, countryCode: '' })
                setFormData({ ...formData, countryCode: e.target.value })
            }
        }
    }
    let otpChange = (e) => {
        setFormData({ ...formData, otp: e.target.value })
        if (!e.target.checkValidity()) {
            setErrors({ ...errors, otp: 'Please enter a 6 digit OTP' })
        } else setErrors({ ...errors, otp: '' })
    }
    const [formData, setFormData] = useState({
        phone: '',
        countryCode: '',
        otp: '',
    })
    const [errors, setErrors] = useState({
        phone: '',
        countryCode: '',
        otp: '',
    })

    return (
        <section id="login">
            <div className="left">
                <form className="myform" onSubmit={handleSubmit}>
                    <div className="encloser">
                        <div className="form-group" style={{ width: "155px", minWidth: "155px" }}>
                            <label htmlFor="countryCode">Country Code: </label>
                            <input className="form-control" type="text" size={countryCodeSize} onChange={countryCodeChange} placeholder="Ex: 91" name="countryCode"></input>
                            <span style={{ fontSize: "1.2rem" }}>{errors.countryCode}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number : </label>
                            <input className="form-control" type="text" onChange={phoneChange} placeholder="7428730894" name="phone" pattern="[0-9]{10}" ></input>
                            <span style={{ fontSize: "1.2rem" }}>{errors.phone}</span>
                        </div>
                    </div>
                    <button type="submit" id="requestOtp" className="submitbtn">Request OTP</button>
                </form>
                <form className="myform" onSubmit={validateOtp}>
                    <div className="form-group">
                        <label htmlFor="otp">OTP : </label>
                        <input className="form-control" type="text" onChange={otpChange} name="otp" pattern="[0-9]{6}"></input>
                        <span>{errors.otp}</span>
                    </div>
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