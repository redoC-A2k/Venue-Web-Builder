import { useEffect } from "react"
import { showLoader } from "../utils/loader"

export default function Loader(props){
    return (
        <div id="loader">
            <div>
                <img src={process.env.PUBLIC_URL+"/www.png"} />
                <span></span>
            </div>
        </div>
    )
}