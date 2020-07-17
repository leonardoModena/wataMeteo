import _ from 'lodash';
import './style.css';

function component() {
    const element = document.getElementById('u');


    //backstick = alt + 96
    const number = 42;
    const message = `The number is ${number}`;
    element.innerHTML = message;
    console.log(`${process.env.CIAO}`)
    return element;
}

document.body.appendChild(component());