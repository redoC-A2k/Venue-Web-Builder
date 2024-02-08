import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useContext } from "react";
import Cropper from 'react-easy-crop'
import axios from "axios";
import getCroppedImg from "../utils/crop.js";
import { auth } from "../firebase.js";
import { hideLoader, showLoader } from "../utils/loader.js";
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { globalContext } from "../App.js";

const hostname = process.env.REACT_APP_HOSTNAME

function Step1(props) {
    const [errors, setErrors] = useState("")
    function handleName(e, formData) {
        let txt = e.currentTarget.value
        if (validateName(txt)) {
            let formData = props.formData
            props.setFormData({ ...formData, name: txt })
        }
    }

    function validateName(text) {
        if (text.length == 0) {
            setErrors("Name cannot be empty")
            return false;
        } else if (text.length < 5) {
            setErrors("Name should be atleast 5 characters long")
            return false;
        } else {
            setErrors("")
            return true;
        }
    }

    const handleForm = (e) => {
        e.preventDefault();
        if (validateName(e.target.elements[0].value))
            props.changeSlide();
        else;
    }

    return (<div className="step">
        <h2>What is the name of your Venue</h2>
        <form action="#" onSubmit={handleForm}>
            <input type="text" placeholder="Enter name of your venue" defaultValue={props.formData.name} onChange={handleName} />
            <span className="error">{errors}</span>
        </form>
    </div>)
}

function Step2(props) {
    const [errors, setErrors] = useState("")
    function handleSlug(e) {
        let txt = e.currentTarget.value
        if (validateSlug(txt)) {
            let formData = props.formData
            props.setFormData({ ...formData, slug: txt })
        }
    }

    function validateSlug(text) {
        if (text.length == 0) {
            setErrors("Slug cannot be empty")
            return false;
        } else if (text.length < 5) {
            setErrors("Slug should be atleast 5 characters long")
            return false;
        }
        // TODO: Only allow a-zA-Z0-9-
        else {
            setErrors("")
            return true;
        }
    }

    const handleForm = (e) => {
        e.preventDefault();
        if (validateSlug(e.target.elements[0].value))
            props.changeSlide();
        else;
    }

    return (<div className="step">
        <h2>Enter slug for your website</h2>
        <form action="#" onSubmit={handleForm}>
            <input type="text" placeholder="Example : Your venue saperated by dash" defaultValue={props.formData.slug} onChange={handleSlug} />
            <span className="error">{errors}</span>
        </form>
    </div>)
}

// Step to upload photos
const Step3 = forwardRef(function (props, ref) {
    const [errors, setErrors] = useState("")
    const [cropImgUrl, setCropImgUrl] = useState("")

    useImperativeHandle(ref, () => ({
        getCroppedImageUrl(url) {
            console.log("getCroppedImage", url)
            setCropImgUrl(url)
        }
    }))

    function handlePhotos(e) {
        let reader = new FileReader();
        reader.onload = (e) => {
            props.setCropImg(e.target.result)
            document.getElementById("cropModal").classList.add("show")
        }
        reader.readAsDataURL(e.currentTarget.files[0])
    }

    function handleCaption(e, formData) {

    }

    const handleForm = (e) => {
        e.preventDefault();
        if (props.formData.media.length > 0) {
            let elems = document.querySelectorAll('#steps div.container div.step.photos div.photos')[0].childNodes
            let valid = true;
            elems.forEach((elem) => {
                if (elem.childNodes[1].value == "") {
                    valid = false;
                    elem.childNodes[1].classList.add('error')
                }
                else elem.childNodes[1].classList.remove('error')
            })
            if (valid)
                props.changeSlide();
        } else {
            setErrors("Please upload atleast one photo along with caption")
        }
    }

    return (<div className="step photos">
        <h2>Upload photos of your venue</h2>
        <div className="photos">
            {props.formData.media.map((data, index) => {
                return (<div className="stepCropImages" key={index}>
                    <img src={data.src} alt="Venue Photo" />
                    <input type="text" placeholder="Enter caption" defaultValue={data.caption} onChange={(e) => {
                        let mediaArr = props.formData.media
                        // props.media[index].caption = e.currentTarget.value
                        mediaArr[index].caption = e.currentTarget.value
                        props.setFormData({ ...props.formData, media: mediaArr })
                    }} />
                </div>)
            })}
        </div>
        <div className="stepInputImage">
            <input id="cropImageInput" type="file" name="photo" placeholder="Select image" onChange={handlePhotos} />
            <input id="cropImageCaption" type="text" name="caption" placeholder="Enter caption" />
        </div>
        <div>
            <button onClick={() => {
                if (cropImgUrl != "" && document.getElementById('cropImageCaption').value != "") {
                    let obj = {
                        src: cropImgUrl,
                        caption: document.getElementById('cropImageCaption').value
                    }
                    document.getElementById('cropImageInput').value = null
                    document.getElementById('cropImageCaption').value = ""
                    setCropImgUrl("")
                    // props.setMedia([...props., obj])
                    props.setFormData({ ...props.formData, media: [...props.formData.media, obj] })
                }
            }}>Add More Image</button>
        </div>
        <form action="#" onSubmit={handleForm}>
            <span className="error">{errors}</span>
        </form>
    </div>)
})

function Step4(props) {
    const [errors, setErrors] = useState("")

    // function validateFeatures(text) {
    //     if (text.length == 0) {
    //         setErrors("Features cannot be empty")
    //         return false;
    //     } else if (text.length < 5) {
    //         setErrors("Slug should be atleast 5 characters long")
    //         return false;
    //     }
    //     // TODO: Only allow a-zA-Z0-9-
    //     else {
    //         setErrors("")
    //         return true;
    //     }
    // }

    const handleForm = (e) => {
        e.preventDefault();
        // if (validateSlug(e.target.elements[0].value))
        // props.changeSlide();
        // else;
        if (props.formData.features.length > 0) {
            let elems = document.querySelectorAll('#steps div.container div.step.features div.features')[0].childNodes
            let valid = true;
            elems.forEach((elem) => {
                if (elem.childNodes[0].value == "") {
                    valid = false;
                    elem.childNodes[0].classList.add('error')
                }
                else elem.childNodes[0].classList.remove('error')
            })
            if (valid)
                props.changeSlide();
        } else {
            setErrors("Please enter atleast one feature")
        }
    }

    return (<div className="step features">
        <h2>Enter Features of your website</h2>
        <div className="features">
            {props.formData.features.map((data, index) => {
                return (<div className="stepFeatures" key={index}>
                    <input type="text" placeholder="Enter feature" defaultValue={data} onChange={(e) => {
                        let featuresArr = props.formData.features
                        // props.media[index].caption = e.currentTarget.value
                        featuresArr[index] = e.currentTarget.value
                        props.setFormData({ ...props.formData, features: featuresArr })
                    }} />
                </div>)
            })}
        </div>
        <div className="stepInputFeature">
            <input id="feature" type="text" name="feature" placeholder="Enter feature" />
        </div>
        <div>
            <button onClick={() => {
                let feature = document.getElementById('feature').value
                if (feature != "") {
                    document.getElementById('feature').value = ""
                    props.setFormData({ ...props.formData, features: [...props.formData.features, feature] })
                }
            }}>Add More Feature</button>
        </div>
        <form action="#" onSubmit={handleForm}>
            <span className="error">{errors}</span>
        </form>
    </div>)
}

function Step5(props) {
    const [errors, setErrors] = useState("")
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    function handleEmail(e) {
        let txt = e.currentTarget.value
        if (validateEmail(txt)) {
            let formData = props.formData
            props.setFormData({ ...formData, email: txt })
        }
    }

    function validateEmail(text) {
        if (text.length == 0) {
            setErrors("Email cannot be empty")
            return false;
        } else if (!emailPattern.test(text)) {
            setErrors("Please enter valid email")
            return false;
        }
        // TODO: Only allow a-zA-Z0-9
        else {
            setErrors("")
            return true;
        }
    }

    const handleForm = (e) => {
        e.preventDefault();
        if (validateEmail(e.target.elements[0].value))
            props.changeSlide();
        else;
    }

    return (<div className="step">
        <h2>Enter your email </h2>
        <form action="#" onSubmit={handleForm}>
            <input type="text" placeholder="Enter your email" defaultValue={props.formData.email} onChange={handleEmail} />
            <span className="error">{errors}</span>
        </form>
    </div>)
}

function Step6(props) {
    const [errors, setErrors] = useState("")

    const handleForm = (e) => {
        e.preventDefault();
        if (props.formData.questions.length > 0) {
            let elems = document.querySelectorAll('#steps div.container div.step.questions div.questions')[0].childNodes
            let valid = true;
            elems.forEach((elem) => {
                if (elem.childNodes[0].value == "") {
                    valid = false;
                    elem.childNodes[0].classList.add('error')
                }
                else elem.childNodes[0].classList.remove('error')
            })
            if (valid)
                props.changeSlide();
        } else {
            setErrors("Please enter atleast one question")
        }
    }

    return (<div className="step questions">
        <h2>Enter questions you want to ask the visitor before giving them estimate</h2>
        <div className="questions">
            {props.formData.questions.map((data, index) => {
                return (<div className="stepQuestions" key={index}>
                    <input type="text" placeholder="Enter Question" defaultValue={data} onChange={(e) => {
                        let questionsArr = props.formData.questions
                        // props.media[index].caption = e.currentTarget.value
                        questionsArr[index] = e.currentTarget.value
                        props.setFormData({ ...props.formData, questions: questionsArr })
                    }} disabled={index == 0 ? true : false} />
                </div>)
            })}
        </div>
        <div className="stepInputQue">
            <input id="question" type="text" name="question" placeholder="Enter Question" />
        </div>
        <div>
            <button onClick={() => {
                let question = document.getElementById('question').value
                if (question != "") {
                    document.getElementById('question').value = ""
                    props.setFormData({ ...props.formData, questions: [...props.formData.questions, question] })
                }
            }}>Add More Question</button>
        </div>
        <form action="#" onSubmit={handleForm}>
            <span className="error">{errors}</span>
        </form>
    </div>)
}


const Steps = (props) => {
    const [currstep, setCurrStep] = useState(1);
    const totalSteps = useRef(6);
    // const [media, setMedia] = useState([])
    const [cropImg, setCropImg] = useState("")
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const fnc = useRef()
    const imageBase64 = useRef("")

    const navigate = useNavigate()
    const { user, stepsData } = useContext(globalContext)
    useEffect(() => {
        try {
            hideLoader()
            if (stepsData !== null && stepsData !== undefined && stepsData.steps === true) {
                navigate('/')
                toast.success("Steps can only be filled once", { duration: 5000 })
            }
            // if (stepsData != null) {
            //     let token = await user.getIdToken();
            //     let response = await axios.get(hostname + "/venue/web/steps", {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             Authorization: token
            //         }
            //     })
            //     hideLoader()
            //     if (response.status === 201) {
            //         navigate('/')
            //         // toast("Steps can only be filled once",{duration: 5000,icon: "✅"})
            //         toast.success("Steps can only be filled once", { duration: 5000 })
            //     }
            // }
        } catch (error) {
            if (error.response && error.response.data)
                console.log(error.response.data)
            else console.log(error)
            if (error.response && error.response.status == 401) {
                navigate('/login')
                window.location.reload()
            }
        }

    }, [user])

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        media: [],
        features: [],
        questions: ["What is your email id ?"],
        email: ""
    });

    async function changeSlide() {
        await setCurrStep(currstep + 1);
        document.querySelector('#steps div.container div.step').classList.add('righttoleft')
        document.querySelector('#steps div.container div.step').classList.remove('lefttoright')
    }

    async function handlenext() {
        let formelem = document.querySelector('#steps div.container div.step form')
        formelem.requestSubmit()
    }

    async function handleprev() {
        await setCurrStep(currstep - 1);
        document.querySelector('#steps div.container div.step').classList.add('lefttoright')
        document.querySelector('#steps div.container div.step').classList.remove('righttoleft')
    }

    let map = {
        1: <Step1 setFormData={setFormData} changeSlide={changeSlide} formData={formData} />,
        2: <Step2 setFormData={setFormData} changeSlide={changeSlide} formData={formData} />,
        3: <Step3 ref={fnc} setCropImg={setCropImg} setFormData={setFormData} changeSlide={changeSlide} formData={formData} />,
        4: <Step4 setFormData={setFormData} changeSlide={changeSlide} formData={formData} />,
        5: <Step5 setFormData={setFormData} changeSlide={changeSlide} formData={formData} />,
        6: <Step6 setFormData={setFormData} changeSlide={changeSlide} formData={formData} />,
        // 6: <Step6 />,
        // 7: <Step7 />,
        // 8: <Step8 />
    }

    // get image from react-easy-crop
    const handleCrop = async () => {
        let formData = new FormData();
        showLoader()
        console.log("uploading image")
        formData.append('image', imageBase64.current.replace('data:image/png;base64,', ''));
        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMG}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            // console.log(res.data.data);
            fnc.current.getCroppedImageUrl(res.data.data.url)
            setCropImg("")
            document.getElementById("cropModal").classList.remove("show")
            hideLoader()
            console.log("image uploaded")
        } catch (error) {
            if (error.response)
                console.log(error.response)
            else console.log(error)
            hideLoader()
            console.log("image uploaded")
        }
    }

    async function handleSetup() {
        try {
            // console.log(formData)
            showLoader()
            if (user != null) {
                let token = await user.getIdToken();
                let response = await axios.post(hostname + "/venue/web/steps", formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                })
                console.log(response.data.message)
                hideLoader()
                navigate('/')
            }
        } catch (error) {
            if (error.response.data)
                console.log(error.response.data)
            else console.log(error)
            if (error.response && error.response.status == 401) {
                localStorage.clear()
                window.location.reload()
                navigate("/login")
            }
            hideLoader()
        }
    }

    return <section id="steps">
        <div id="cropModal">
            <div className="cropperContainer">
                <div className="cropper">
                    <Cropper
                        image={cropImg}
                        aspect={5 / 3}
                        crop={crop}
                        onCropChange={setCrop}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        onCropComplete={async (croppedArea, croppedAreaPixels) => {
                            if (cropImg != "") {
                                const imageBase64str = await getCroppedImg(cropImg, croppedAreaPixels, 0)
                                imageBase64.current = imageBase64str;
                            }
                            else;
                        }}
                    />
                </div>
            </div>
            <div className="controls">
                <button onClick={handleCrop} >Done</button>
            </div>
        </div>
        <span className="progress" style={{ width: `${(currstep / totalSteps.current) * 100}vw` }}></span>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    {map[currstep]}
                </div>
            </div>
        </div>
        <div className="navigation">
            <i style={{ visibility: (currstep > 1) ? "visible" : "hidden" }} onClick={handleprev} className="fa-solid fa-chevron-left"></i>
            {(currstep < totalSteps.current) ? <i onClick={handlenext} className="fa-solid fa-chevron-right"></i> : <button style={{ alignSelf: "center" }} onClick={handleSetup} className="cta">SUBMIT</button>}
        </div>
    </section>
}
export default Steps;