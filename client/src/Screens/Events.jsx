import { useEffect, useRef, useState } from "react";
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { months, years } from "../utils/calendar";
import axios from "axios";
import { hideLoader, showLoader } from "../utils/loader";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'


import dayjs from "dayjs"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

const Events = (props) => {
    const calref = useRef();
    const [calendar, setCalendar] = useState(null);
    const [date, setDate] = useState(new Date());
    const [month, setMonth] = useState(months[date.getMonth()]);
    const [year, setYear] = useState(date.getFullYear());
    const [initialView, setInitialView] = useState('dayGridMonth')
    const endpoint = process.env.REACT_APP_HOSTNAME + '/venue/events';
    const promiseUser = useRef(null)
    let navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "Booked for an event",
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
    })

    const [errors, setErrors] = useState({
        title: "",
        startTime: "Please enter event start time",
        endTime: "Please enter event end date",
        startDate: "Please enter event start date",
        endDate: "Please enter event end date",
    })

    const [sortedEvents, setSortedEvents] = useState([])

    useEffect(() => {
        showLoader()
        async function initEvents() {
            promiseUser.current = new Promise((resolve, reject) => {
                console.log("promise called")
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        resolve(user)
                    } else {
                        hideLoader()
                        navigate('/login')
                        reject("User not signed in")
                    }
                })
            })
            try {
                let user = await promiseUser.current
                let token = await user.getIdToken()
                let events = await axios.get(process.env.REACT_APP_HOSTNAME + "/venue/events", {
                    headers: {
                        'Content-Type': "application/json",
                        Authorization: token
                    }
                })
                setSortedEvents(events.data)
                let calendar = new Calendar(calref.current, {
                    plugins: [dayGridPlugin, timeGridPlugin],
                    initialView: initialView,
                    headerToolbar: false,
                    aspectRatio: 1.77,
                    themeSystem: 'bootstrap',
                    eventContent: (info)=>{ 
                        const title = info.event.title
                        const start = info.event.start
                        const end = info.event.end
                        return {html:"<span style='overflow-x:hidden;' data-toggle='tooltip' title='"+title+"'>"+`${dayjs(start).format("hh:mm A")} - ${title}</span>`} 
                    },
                    // eventContent: function(arg){
                    //     console.log(arg)
                    // },
                    events: async function (info, successCallback, failureCallback) {
                        try {
                            let user = await promiseUser.current
                            let token = await user.getIdToken()
                            // TODO: Change punam-mahal to actual slug placeholder from context
                            let response = await axios.get(process.env.REACT_APP_HOSTNAME + `/venue/punam-mahal/events?start=${info.startStr}&end=${info.endStr}`, {
                                headers: {
                                    "Content-Type": 'application/json',
                                    Authorization: token
                                }
                            })
                            successCallback(response.data)
                        } catch (error) {
                            console.log(error)
                            failureCallback(error?.response)
                        }
                        successCallback([])
                        // failureCallback()
                    }
                });
                calendar.render();
                setCalendar(calendar)

                hideLoader()
            } catch (error) {
                console.log(error)
                hideLoader()
            }
        }
        initEvents()
    }, [])

    // ------- FullCalendar methods -------

    function today() {
        let newDate = new Date();
        calendar.gotoDate(newDate)
        setDate(newDate)
        setYear(newDate.getFullYear())
        setMonth(months[newDate.getMonth()])
    }

    // setting date as 1 so that it will always show the first day of the month
    // and does not cause issues on changing months(30 days and 31 days) and leap year
    function handleYear(e) {
        let year = e.target.value
        let newDate = new Date(year, date.getMonth(), 1)
        calendar.gotoDate(newDate)
        setDate(newDate)
        setYear(year)
    }
    function handleMonth(dir) {
        let month = date.getMonth();
        let year = date.getFullYear();
        if (dir === "prev") {
            month = month - 1;
            if (month < 0) {
                month = 11;
                setYear(year - 1);
                year = year - 1;
            }

        } else {
            month = month + 1;
            if (month > 11) {
                month = 0;
                setYear(year + 1);
                year = year + 1;
            }
        }

        // setting date as 1 so that it will always show the first day of the month
        // and does not cause issues on changing months(30 days and 31 days) and leap year
        let newDate = new Date(year, month, 1)
        calendar.gotoDate(newDate)
        setDate(newDate)
        setMonth(month)
    }

    // ------ methods for form ------------

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
            let user = await promiseUser.current
            if (user != null) {
                let token = await user.getIdToken()
                if (validateFormData()) {
                    showLoader()
                    let response = await axios.post(endpoint, formData, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    })
                    hideLoader()
                    console.log(response.data)
                    if (Number(response.status) === 200)
                        toast.success("Event added to calendar")
                }
            }
        } catch (error) {
            hideLoader()
            if (error.response && error.response.status) {
                if (Number(error.response.status) === 409)
                    toast.error("Conflicting Event can't be added")
                else if (Number(error.response.status) === 401)
                    navigate("/login")
                else if (Number(error.response.status) === 400)
                    toast.error("A field is missing or empty")
                else if (Number(error.response.status) === 422)
                    toast.error("You have not published website")
            }
        }
    }

    function handleGoTo(eventDate) {
        let date = dayjs(eventDate)
        calendar.gotoDate(date.toDate())
        setDate(date.toDate())
        setYear(date.toDate().getFullYear())
        setMonth(date.toDate().getMonth())
    }

    return (
        <section id="events">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3 col-xl-2 leftpane">
                        <div className="heading mb-3">
                            <h3>Upcoming events</h3>
                        </div>
                        <div>
                            <ul>
                                {sortedEvents.map((event, ind) => {
                                    return (
                                        <div className="mb-2" key={ind}>
                                            <li data-toggle="tooltip" title={event.title}><span onClick={() => handleGoTo(event.start)}>{event.title}</span></li>
                                            <small><span style={{ color: "rgba(var(--primary-grey-1),0.7)" }}>{dayjs(event.start).format("DD-MM-YYYY")}</span><pre style={{ display: "inline" }}> </pre> {dayjs(event.start).format("hh:mm A")}</small>
                                        </div>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-9 col-xl-10">
                        <div className="row">
                            <div className="col-12 col-xl-11">
                                <div id="calendar">
                                    <div className="calHeader">
                                        <div style={{ display: 'flex' }}>
                                            <select value={year} onChange={handleYear} className="custom-select">
                                                {years.map((year, ind) => {
                                                    return (
                                                        <option key={ind} value={year}>{year}</option>
                                                    )
                                                })}
                                            </select>
                                            <button onClick={today}>Today</button>
                                            <select className="custom-select" style={{ width: "10rem" }} onChange={(e) => calendar.changeView(e.target.value)}>
                                                <option value="dayGridMonth">Month</option>
                                                <option value="timeGridWeek">TimeGrid</option>
                                            </select>
                                        </div>
                                        <h5>{months[date.getMonth()]} {date.getDate()} , {date.getFullYear()}</h5>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input type="date" className="form-control" onChange={(e)=>console.log(e.target.value)}/>
                                            <button onClick={() => { handleMonth("prev") }}><i className="fa-solid fa-chevron-left"></i></button>
                                            <button onClick={() => { handleMonth("next") }}><i className="fa-solid fa-chevron-right"></i></button>
                                        </div>
                                    </div>
                                    <div ref={calref}></div>
                                </div>
                                <div className="bookevent mt-5">
                                    <form className="myform" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="form-group">
                                                    <label htmlFor="startTime">Event Start Time :</label>
                                                    <input type="time" className="form-control" id="startTime" name="startTime" onChange={handleChange} value={formData.startTime} required />
                                                    <span style={{ fontSize: "1.4rem" }}>{errors.startTime}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="startDate">Event Start Date :</label>
                                                    <input type="date" className="form-control" id="startDate" name="startDate" onChange={handleChange} required value={formData.startDate} />
                                                    <span style={{ fontSize: "1.4rem" }}>{errors.startDate}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="title">Event Title :</label>
                                                    <input type="text" className="form-control" id="title" name="title" maxLength={40} onChange={handleChange} value={formData.title} required />
                                                    <span style={{ fontSize: "1.4rem" }}>{errors.title}</span>
                                                </div>
                                            </div>
                                            <div className="col-5 offset-1">
                                                <div className="form-group">
                                                    <label htmlFor="endTime">Event end Time :</label>
                                                    <input type="time" className="form-control" id="endTime" name="endTime" onChange={handleChange} value={formData.endTime} required />
                                                    <span style={{ fontSize: "1.4rem" }}>{errors.endTime}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="endDate">Event end Date :</label>
                                                    <input type="date" className="form-control" id="endDate" name="endDate" onChange={handleChange} value={formData.endDate} required />
                                                    <span style={{ fontSize: "1.4rem" }}>{errors.endDate}</span>
                                                </div>
                                                <button type="submit" className="cta mt-4">Add Event</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Events;