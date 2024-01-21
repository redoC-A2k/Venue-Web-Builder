import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { hideLoader, showLoader } from '../utils/loader'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

const MyCard = (props) => {
    {
        props.query ?
            (<div className="card">
                <div className="row">
                    <div className="card-body">
                        {Object.keys(props.query).map((key, ind) => {
                            if (key !== 'What is your email id ?')
                                return (
                                    <h5 key={ind}>{props.query[key]}</h5>
                                )
                        })}
                    </div>
                </div>
            </div>)
            :
            (<div></div>)
    }

}

const Manage = (props) => {
    const [queries, setQueries] = useState([])
    const [queriesArr, setQueriesArr] = useState([])
    const [query, setQuery] = useState({})
    const [sortedDates, setSortedDates] = useState([])
    const promiseUser = useRef(null)
    // const [visibleInd, setVisibleInd] = useState(-1)
    const visibleInd = useRef(-1);
    const navigate = useNavigate()
    useEffect(() => {
        showLoader()
        promiseUser.current = new Promise((resolve, reject) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    hideLoader()
                    try {
                        const token = await user.getIdToken()
                        let response = await axios.get(`${process.env.REACT_APP_HOSTNAME}/venue/queries`, {
                            headers: {
                                Authorization: token
                            }
                        })
                        setSortedDates(Object.keys(response.data.queries))
                        setQueries(response.data.queries)
                    } catch (error) {
                        console.log(error)
                        if (error.response && error.response.status == 401)
                            navigate('/login')
                    }
                }
                else {
                    navigate('/login')
                    reject("user not signed in")
                    hideLoader()
                }
            })
        })
    }, [])

    async function makeADateVisible(date) {
        setQueriesArr(queries[date])
    }



    return (
        // make two columns on left will be the entries of request on right will be their brief
        <div id="manage">
            <div className='container-fluid'>
                <div className="row">
                    <div className="col-2 leftpane">
                        <div className='heading'>
                            <h3>Dates</h3>
                        </div>
                        <div>
                            <ul>
                                {sortedDates.map((date, ind) => {
                                    return (<li key={date} onClick={() => makeADateVisible(date)}><span style={{ cursor: "pointer" }}>{date}</span></li>)
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
                                        {queriesArr.map((query, ind) => {
                                            return (
                                                <div key={ind} className="card">
                                                    <div className="card-header">
                                                        <h2 className="mb-0">
                                                            <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={`#entry${ind}`} aria-expanded="true" >
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
                                                                <div className='row mt-3 pb-1'>
                                                                    <div className="col">
                                                                        <h5>Write your quote with cost break-down </h5>
                                                                        <textarea className="form-control" rows="3"></textarea>
                                                                    </div>
                                                                </div>
                                                                <div className='row mb-5'>
                                                                    <div className='col-6'>
                                                                        <div className="row">
                                                                            <div className="col-6">
                                                                                <h5>Select start date</h5>
                                                                                <input type="date" className="form-control" />
                                                                            </div>
                                                                            <div className="col-6">
                                                                                <h5>Select end date</h5>
                                                                                <input type="date" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <h5>Enter your quote (in Rs) </h5>
                                                                                <input type="number" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row ">
                                                                    <div className="col">
                                                                        <button className='cta'>Send</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
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

export default Manage