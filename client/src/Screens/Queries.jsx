import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { hideLoader, showLoader } from '../utils/loader'
import { globalContext } from '../App'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Queries = (props) => {
    const [queries, setQueries] = useState([])
    const [queriesArr, setQueriesArr] = useState([])
    const { user } = useContext(globalContext)
    const email = useRef("")
    const endpoint = process.env.REACT_APP_HOSTNAME + '/venue/queries';
    const [formData, setFormData] = useState({
        title: "Booked for an event",
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
        quote: "",
        token: ""
    })

    const [errors, setErrors] = useState({
        title: "",
        startTime: "Please enter event start time",
        endTime: "Please enter event end date",
        startDate: "Please enter event start date",
        endDate: "Please enter event end date",
        quote: "Please enter remarks / cost break down structure",
        token: "Please enter token amount"
    })
    
    const navigate = useNavigate()

    useEffect(() => {
        showLoader()
        async function initQueries() {
            try {
                const token = await user.getIdToken()
                let response = await axios.get(endpoint, {
                    headers: {
                        Authorization: token
                    }
                })
                console.log(response.data)
                setQueries(response.data)
                hideLoader()
            } catch (error) {
                if(error.response && error.response.status === 422){
                    navigate('/')
                    toast.error("Website is not published")
                }
                console.log(error)
                hideLoader()
            }
        }
        if (user)
            initQueries()
    }, [user])


    function validateFormData() {
        let startDateTime = new dayjs(formData.startDate + " " + formData.startTime)
        let endDateTime = new dayjs(formData.endDate + " " + formData.endTime)
        let today = dayjs()
        let valid = true
        if (startDateTime.isSameOrBefore(today, 'day')) {
            setFormData({ ...formData, startDate: "", startTime: "" })
            setErrors({ ...errors, startDate: "Start Date must be after today", startTime: "Please enter a valid start time" })
            valid = false
        }
        else if (endDateTime.isSameOrBefore(startDateTime, 'hour')) {
            setFormData({ ...formData, endDate: "", endTime: "" })
            setErrors({ ...errors, endDate: "End Date must be after start date", endTime: "Please enter a valid end time" })
            valid = false
        }
        else if (endDateTime.isAfter(today.add(1, 'year'), 'day')) {
            setFormData({ ...formData, endDate: "", endTime: "" })
            setErrors({ ...errors, endDate: "End Date must be before 1 year from today", endTime: "Please enter a valid end time" })
            valid = false
        }
        return valid;
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            let token = await user.getIdToken()
            formData.toEmail = email.current
            if (validateFormData()) {
                showLoader()
                let response = await axios.post(endpoint, formData, {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                })
                hideLoader()
                console.log(response.data)
                if (Number(response.status) === 200)
                    toast.success("Mail send to customer")

            }
        } catch (error) {
            console.log(error.response)
            hideLoader()
        }
    }

    function toggleCard(query){
        email.current = query['What is your email id ?'] 
        setFormData({
            title: "Booked for an event",
            startTime: "",
            endTime: "",
            startDate: "",
            endDate: "",
            quote: "",
            token: ""
        })
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (e.target.value != "")
            setErrors({ ...errors, [e.target.name]: "" })
        else {
            let name = e.target.name
            if (name === "title")
                setErrors({ ...errors, [e.target.name]: "Please enter a valid title" })
            else if (name === "startTime")
                setErrors({ ...errors, [e.target.name]: "Please enter event start time" })
            else if (name === "endTime")
                setErrors({ ...errors, [e.target.name]: "Please enter event end time" })
            else if (name === "startDate")
                setErrors({ ...errors, [e.target.name]: "Please enter event start date" })
            else if (name === "endDate")
                setErrors({ ...errors, [e.target.name]: "Please enter event end date" })
        }
    }

    return (
        // make two columns on left will be the entries of request on right will be their brief
        <div id="queries">
            <div className='container-fluid'>
                <div className="row">
                    <div className="col-2 leftpane">
                        <div className='heading'>
                            <h3>Dates</h3>
                        </div>
                        <div>
                            <ul>
                                {queries.map(({ docId }, ind) => {
                                    return (<li key={docId}><span style={{ cursor: "pointer" }} onClick={() => setQueriesArr(queries[ind].queries)}>{docId}</span></li>)
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-10 rightpane">
                        <div className="row">
                            <div className="col-12">
                                <div className='heading'>
                                    <h3>Queries</h3>
                                </div>
                                <div>
                                    <div className="accordion" id="accordionExample">
                                        {queries.length > 0 ?
                                            (queriesArr.map((query, ind) => {
                                                return (
                                                    <div key={ind} className="card">
                                                        <div className="card-header">
                                                            <h2 className="mb-0">
                                                                <button className="btn btn-link btn-block text-left collapsed" onClick={() => {toggleCard(query)}} type="button" data-toggle="collapse" data-target={`#entry${ind}`} >
                                                                    {query['What is your email id ?']}
                                                                </button>
                                                            </h2>
                                                        </div>

                                                        <div id={`entry${ind}`} className="collapse" data-parent="#accordionExample">
                                                            <div className="card-body w-100 p-0">
                                                                <div className="queries p-3">
                                                                    {Object.keys(query).map((key, ind) => {
                                                                        if (key != 'What is your email id ?')
                                                                            return (<div key={ind} className='entry mb-3 pb-1'>
                                                                                <div>
                                                                                    <h5>{key}</h5>
                                                                                </div>
                                                                                <div>
                                                                                    <h5>{query[key]}</h5>
                                                                                </div>
                                                                            </div>)
                                                                    })}
                                                                </div>
                                                                <hr />
                                                                <div className="action p-3">
                                                                    <form className='myform' onSubmit={handleSubmit}>
                                                                        <div className='row mt-2 mb-2'>
                                                                            <div className="col form-group">
                                                                                <label>Write remarks or quote with cost break-down structure </label>
                                                                                <textarea className="form-control" rows="3" onChange={handleChange} value={formData.quote} name='quote' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.quote}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row mb-2'>
                                                                            <div className="col-4 form-group">
                                                                                <label htmlFor='startDate'>Select start date</label>
                                                                                <input type="date" id="startDate" className="form-control" onChange={handleChange} value={formData.startDate} name='startDate' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.startDate}</span>
                                                                            </div>
                                                                            <div className="col-4 form-group">
                                                                                <label htmlFor='endDate'>Select end date</label>
                                                                                <input type="date" id="endDate" className="form-control" onChange={handleChange} value={formData.endDate} name='endDate' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.endDate}</span>
                                                                            </div>
                                                                            <div className="col-4 form-group">
                                                                                <label htmlFor='title'>Title for event</label>
                                                                                <input type="text" id="title" className="form-control" onChange={handleChange} value={formData.title} name='title' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row mb-2'>
                                                                            <div className="col-4 form-group">
                                                                                <label htmlFor='startTime'>Select start time</label>
                                                                                <input type="time" id="startTime" className="form-control" onChange={handleChange} value={formData.startTime} name='startTime' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.startTime}</span>
                                                                            </div>
                                                                            <div className="col-4 form-group">
                                                                                <label htmlFor='endTime'>Select end time</label>
                                                                                <input type="time" id="endTime" className="form-control" onChange={handleChange} value={formData.endTime} name='endTime' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.endTime}</span>
                                                                            </div>
                                                                            <div className="col-4 form-group">
                                                                                <label htmlFor='quote'>Enter payable amount (in Rs) </label>
                                                                                <input type="number" id="quote" className="form-control" onChange={handleChange} value={formData.token} name='token' required />
                                                                                <span style={{ fontSize: "1.4rem" }}>{errors.token}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row ">
                                                                            <div className="col">
                                                                                <button className='cta' type='submit'>Send</button>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })) : (
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h2 className="mb-0">
                                                            <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#entry0" >
                                                                No queries to display
                                                            </button>
                                                        </h2>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Queries