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
    const [query, setQuery] = useState({})
    const promiseUser = useRef(null)
    // const [visibleInd, setVisibleInd] = useState(-1)
    const visibleInd = useRef(-1);
    const navigate = useNavigate()
    useEffect(() => {
        showLoader()
        promiseUser.current = new Promise((resolve, reject) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    console.log(user)
                    hideLoader()
                    const token = await user.getIdToken()
                    let response = await axios.get(`${process.env.REACT_APP_HOSTNAME}/venue/queries`, {
                        headers: {
                            Authorization: token
                        }
                    })
                    console.log(response.data.data)
                    setQueries(response.data.data)
                }
                else {
                    navigate('/login')
                    reject("user not signed in")
                    hideLoader()
                }
            })
        })
    }, [])

    function handleQuery(ind) {
        let elem = document.getElementById('card-container')
        console.log(query)
        if (visibleInd.current !== -1) {
            // elems[visibleInd.current].classList.remove('show')
            // elems[ind].classList.add('show')
            // console.log(elems[ind])
            // visibleInd.current = ind 

        } else {
            // elems[ind].classList.add('show')
            // visibleInd.current = ind
            // console.log(elems[ind])
        }
        setQuery(queries[ind])

    }
    // return (
    //     // make two columns on left will be the entries of request on right will be their brief
    //     <div id="manage">
    //         <div className='container-fluid'>
    //             <div className="row">
    //                 <div className="col-3">
    //                     <div className="row heading">
    //                         <h3>Requests</h3>
    //                         {queries.map((query, ind) => {
    //                             return (<div key={ind} onClick={() => handleQuery(ind)} className='row'>
    //                                 <div className="col-12"><h5>{query['What is your email id ?']}</h5></div>
    //                             </div>)
    //                         })}
    //                     </div>
    //                 </div>
    //                 <div className="col-9">
    //                     <div className="row heading">
    //                         <h3>Manage</h3>
    //                         <div id="card-container">
    //                             <MyCard query={query} />
    //                             {/* {queries.map((query, ind) => {
    //                                 // console.log(query['What is your email id ?'])
    //                                 return (<div key={ind} className='row'>

    //                                     <div className="col-12">
    //                                         {Object.keys(query).map((key, ind) => {
    //                                             if (key !== 'What is your email id ?') {
    //                                                 return (
    //                                                     <div key={ind} className="card">
    //                                                         <div className="row">
    //                                                             <div className="card-body">
    //                                                                 <h5 className="card-title">{key}</h5>
    //                                                                 <p className="card-text">{query[key]}</p>
    //                                                             </div>
    //                                                         </div>
    //                                                     </div>)
    //                                             }
    //                                         })}
    //                                     </div>
    //                                 </div>)
    //                             })} */}
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )

    return (
        // make two columns on left will be the entries of request on right will be their brief
        <div id="manage">
            <div className='container-fluid'>
                <div className="row">
                    <div className="accordion" id="accordionExample">
                        {queries.map((query, ind) => {
                            return (
                                <div key={ind} className="card">
                                    <div className="card-header" id="headingOne">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={`#entry${ind}`} aria-expanded="true" aria-controls="collapseOne">
                                                {query['What is your email id ?']}
                                            </button>
                                        </h2>
                                    </div>

                                    <div id={`entry${ind}`} className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                        <div className="card-body w-100">
                                            {Object.keys(query).map((key,ind)=>{
                                                if(key!='What is your email id ?')
                                                return (<div>
                                                    <h4>{key}</h4>
                                                    <h5>{query[key]}</h5>
                                                    <br/>
                                                    </div>)
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manage