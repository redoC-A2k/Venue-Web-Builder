import { useRef, useState } from "react";

const Steps = (props) => {
    const [currstep, setCurrStep] = useState(1);
    const totalSteps = useRef(3);


    async function handlenext() {
        await setCurrStep(currstep + 1);
        document.querySelector('#steps div.container div.step').classList.add('righttoleft')
        document.querySelector('#steps div.container div.step').classList.remove('lefttoright')
    }

    async function handleprev() {
        await setCurrStep(currstep - 1);
        document.querySelector('#steps div.container div.step').classList.add('lefttoright')
        document.querySelector('#steps div.container div.step').classList.remove('righttoleft')
    }

    let map = {
        1: <Step1 />,
        2: <Step2 />,
        3: <Step3 /> 
    }

    function Step1(props) {
        return <div className="step">
            <h2>Step 1</h2>
        </div>
    }

    function Step2(props) {
        return <div className="step">
            <h2>Step 2</h2>
        </div>
    }

    function Step3(props) {
        return <div className="step">
            <h2>Step 3</h2>
        </div>
    }

    return <section id="steps">
        <span className="progress" style={{width:`${(currstep/totalSteps.current)*100}vw`}}></span>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    {map[currstep]}
                </div>
            </div>
        </div>
        <div className="navigation">
            <i style={{visibility:(currstep>1)?"visible":"hidden"}} onClick={handleprev} className="fa-solid fa-chevron-left"></i>
            <i style={{visibility:(currstep<totalSteps.current)?"visible":"hidden"}} onClick={handlenext} className="fa-solid fa-chevron-right"></i>
        </div>
    </section>
}
export default Steps;