
export default function Loader(props){
    return (
        <div id="loader">
            <div>
                <img src={process.env.PUBLIC_URL+"/www.png"} alt="img can't be displayed"/>
                <span></span>
            </div>
        </div>
    )
}