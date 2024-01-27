import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { hideLoader, showLoader } from '../utils/loader'
import { useNavigate } from 'react-router-dom'
import { globalContext } from '../App'

const Queries = (props) => {
    const [queries, setQueries] = useState([])
    const [queriesArr, setQueriesArr] = useState([])
    const { user } = useContext(globalContext)
    useEffect(() => {
        showLoader()
        async function initQueries() {
            try {
                const token = await user.getIdToken()
                let response = await axios.get(`${process.env.REACT_APP_HOSTNAME}/venue/queries`, {
                    headers: {
                        Authorization: token
                    }
                })
                console.log(response.data)
                setQueries(response.data)
                hideLoader()
            } catch (error) {
                console.log(error)
                hideLoader()
            }
        }
        if (user)
            initQueries()
    }, [user])

    async function makeADateVisible(ind) {
        setQueriesArr(queries[ind].queries)
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
                                    return (<li key={docId}><span style={{ cursor: "pointer" }} onClick={() => makeADateVisible(ind)}>{docId}</span></li>)
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
                                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target={`#entry${ind}`} >
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