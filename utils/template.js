const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/../.env'})

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}


let setup = {
    name: 'Punam Mahal Convention Hall',
    slug: 'punam-mahal',
    email: "a2kafshan@gmail.com",
    media: [
        {
            caption: "Punam Mahal Convention Hall in day",
            src: "https://i.ibb.co/myXmZ64/eca0b7f018c5.png"
        }, {
            caption: "Grand function in punam mahal",
            src: "https://i.ibb.co/Z60kQWH/cb8b9b9e3597.png"
        }, {
            caption: "Punam Mahal Convention Decorated for a function",
            src: "https://i.ibb.co/cQ4bWm7/467a8a34de8d.png"
        }, {
            caption: "Punam Mahal Convention Hall in night",
            src: "https://i.ibb.co/CJwq5fX/b62877d35aa4.png"
        }, {
            caption: "A program happeing at Punam Mahal Convention Hall",
            src: "https://i.ibb.co/rwdMr5F/126a2327d977.png"
        }
    ],
    features: [
        'Punam Mahal Convention Hall offers air-conditioned facilities, power backup, a fully-equipped kitchen, dance floor, elevator, and a suite of essential services, including Purohit, Photographer, Videographer, Florist, Choreographer, Astrologer, and Caterer.',
        'Enjoy an Orchestra, Security Guards, and the option for External Catering. The hall provides its decorator services, allowing for seamless event planning. Hawan and Baraat ceremonies are accommodated.',
        'The venue maintains a serene atmosphere by restricting smoking, alcohol (both inside and external), loud music, external decorators, and firecrackers.',
        'Punam Mahal embraces diverse events with permissions for Hawan and Baraat, while pets are not allowed.',
        "Ensure uninterrupted festivities with the venue's dependable power backup system."
    ],
    questions: [
        "What is your email id ?",
        "Will your event feature a vegetarian menu, or do you prefer non-vegetarian options?",
        "What date and time are you considering for your event?",
        "What type of event are you planning (e.g., wedding, corporate event, party)?",
        "How many guests are you expecting to attend?"
    ]
}

function getTemplate(setup) {
    let name = setup.name;
    let obj = require('./template.json')
    obj.pages[0].frames[0].component.components[0].components[0].components[0].components[0].content = name.toUpperCase();

    // ---------------------------------
    // -------- setting features --------
    let featureNode = obj.pages[0].frames[0].component.components[2].components[0].components[1].components[0].components[0];
    featureNode.components[0].content = setup.features[0];
    let featureNodeId = featureNode.attributes.id;
    featureNodeId = "#" + featureNodeId
    let featureStyleArr = []
    for (const style of obj.styles) {
        if (style.selectors[0] === featureNodeId) {
            featureStyleArr.push(style)
        }
    }
    // console.dir(obj.pages[0].frames[0].component.components[2].components[0].components[1].components[0],{depth:null})
    let featureArr = [featureNode]
    for (let i = 1; i < setup.features.length; i++) {
        let newFeature = JSON.parse(JSON.stringify(featureNode))
        newFeature.attributes.id = generateRandomString(5);
        newFeature.components[0].content = setup.features[i];

        for (const style of featureStyleArr) {
            let newStyle = JSON.parse(JSON.stringify(style))
            newStyle.selectors[0] = "#" + newFeature.attributes.id;
            // console.log(newStyle)
            obj.styles = [...obj.styles, newStyle]
        }
        featureArr = [...featureArr, newFeature]
    }
    obj.pages[0].frames[0].component.components[2].components[0].components[1].components[0].components = featureArr;

    //-------------------------------
    // ------ setting slides ---------
    //--------------------------------
    let slideNode = obj.pages[0].frames[0].component.components[1].components[0].components[1].components[0].components[0].components[0]
    slideNode.components[0].attributes.src = setup.media[0].src
    slideNode.components[1].components[0].content = setup.media[0].caption
    // obj.pages[0].frames[0].component.components[1].components[0].components[1].components[0].components[0].components[0] = slideNode

    // get all styles for slideNode
    let slideStyleArr = []
    for (const style of obj.styles) {
        if (style.selectors[0] === "#" + slideNode.attributes.id) {
            slideStyleArr.push(style)
        }
    }
    let slideArr = [slideNode]
    // slideNode.components[1].
    // console.log(obj.pages[0].frames[0].component.components[1].components[0].components[1].components[0].components[0].components[0])

    // setting all slides
    for (let i = 1; i < setup.media.length; i++) {
        let newSlide = JSON.parse(JSON.stringify(slideNode))
        newSlide.attributes.id = generateRandomString(5);
        newSlide.components[0].attributes.src = setup.media[i].src
        newSlide.components[1].components[0].content = setup.media[i].caption
        for (const style of slideStyleArr) {
            let newStyle = JSON.parse(JSON.stringify(style))
            newStyle.selectors[0] = "#" + newSlide.attributes.id
            obj.styles = [...obj.styles, newStyle]
            // console.log(newStyle)
        }
        slideArr = [...slideArr, newSlide]
    }
    // console.dir(slideArr,{depth:null})
    obj.pages[0].frames[0].component.components[1].components[0].components[1].components[0].components[0].components = slideArr

    // ---------------------------
    // ------ setting form --------
    // ---------------------------

    let formNode = obj.pages[0].frames[0].component.components[3].components[0].components[0]
    formNode.attributes.action = process.env.HOST+"/book/" + setup.slug

    let divNode = formNode.components[0];
    let buttonDiv = formNode.components[formNode.components.length-1];
    divNode.components[0].components[0].content = setup.questions[0];
    divNode.components[1].attributes.name = setup.questions[0];
    
    // editing text 
    let questionsDivArr = [divNode]
    for (let i = 1; i < setup.questions.length; i++) {
        let newDiv = JSON.parse(JSON.stringify(divNode))
        newDiv.attributes.id = generateRandomString(5);
        newDiv.components[0].attributes.id = generateRandomString(5);
        newDiv.components[1].attributes.id = generateRandomString(5);
        newDiv.components[0].components[0].content = setup.questions[i];
        newDiv.components[1].attributes.name = setup.questions[i];
        questionsDivArr = [...questionsDivArr, newDiv]
    }
    obj.pages[0].frames[0].component.components[3].components[0].components[0].components = questionsDivArr;

    let divNodeStyle = [];
    let textNodeStyle = [];
    let inputNodeStyle = [];
    for (let i = 0; i < obj.styles.length; i++) {
        if (obj.styles[i].selectors[0] === "#" + divNode.attributes.id) {
            divNodeStyle.push(obj.styles[i])
        }
        if (obj.styles[i].selectors[0] === "#" + divNode.components[0].attributes.id) {
            textNodeStyle.push(obj.styles[i])
        }
        if (obj.styles[i].selectors[0] === "#" + divNode.components[1].attributes.id) {
            inputNodeStyle.push(obj.styles[i])
        }
    }
    // console.log(divNodeStyle, textNodeStyle, inputNodeStyle)
    // editing style
    for (let i = 1; i < questionsDivArr.length; i++) {
        let newDivStyle = JSON.parse(JSON.stringify(divNodeStyle))
        let newTextStyle = JSON.parse(JSON.stringify(textNodeStyle))
        let newInputStyle = JSON.parse(JSON.stringify(inputNodeStyle))
        for (let j = 0; j < newDivStyle.length; j++) {
            newDivStyle[j].selectors[0] = "#" + questionsDivArr[i].attributes.id
        }
        for (let j = 0; j < newTextStyle.length; j++) {
            newTextStyle[j].selectors[0] = "#" + questionsDivArr[i].components[0].attributes.id
        }
        for (let j = 0; j < newInputStyle.length; j++) {
            newInputStyle[j].selectors[0] = "#" + questionsDivArr[i].components[1].attributes.id
        }
        // console.log(...newDivStyle, ...newTextStyle, ...newInputStyle)
        obj.styles = [...obj.styles, ...newDivStyle, ...newTextStyle, ...newInputStyle]
    }
    // for(let i)

    obj.pages[0].frames[0].component.components[3].components[0].components[0].components.push(buttonDiv)
    return JSON.stringify(obj)
}

module.exports={getTemplate}
// console.log(generateRandomString(5))