import * as THREE from "three";
import Game from "../game";

const pathArrowIdle = process.env.PUBLIC_URL + "/img/arrowRightIdle.png";
const pathArrowOver = process.env.PUBLIC_URL + "/img/arrowRightOver.png";
const pathArrowPress = process.env.PUBLIC_URL + "/img/arrowRightPress.png";


class Ui extends THREE.EventDispatcher {
    constructor() {

        super();

        this.uiInit = this.uiInit.bind(this);
    }

    uiInit() {
        // Add left arrow button
        let buttonLeft = document.createElement("IMG");
        buttonLeft.src = pathArrowIdle;
        buttonLeft.style.position = "absolute";
        buttonLeft.style.left = "calc(5% - 28px)";
        buttonLeft.style.top = "calc(50% - 49px)";
        buttonLeft.style.transform = "rotate(180deg)";
        buttonLeft.style.width = "56px";
        buttonLeft.style.height = "98px";
        buttonLeft.style.cursor = "pointer";
        buttonLeft.onmouseenter = function() {
            buttonLeft.src = pathArrowOver;
        }
        buttonLeft.onmousedown = function() { 
            buttonLeft.src = pathArrowPress;
        }
        buttonLeft.onmouseup = function(e) {
            console.log(e);
            buttonLeft.src = pathArrowOver;
            Game.switchLeft();
        }
        buttonLeft.onmouseleave = function() {
            buttonLeft.src = pathArrowIdle;
        }
        document.body.appendChild(buttonLeft);

        // Add right arrow button
        let buttonRight = document.createElement("IMG");
        buttonRight.src = pathArrowIdle;
        buttonRight.style.position = "absolute";
        buttonRight.style.left = "calc(95% - 28px)";
        buttonRight.style.top = "calc(50% - 49px)";
        buttonRight.style.width = "56px";
        buttonRight.style.height = "98px";
        buttonRight.style.cursor = "pointer";
        buttonRight.onmouseenter = function() {
            buttonRight.src = pathArrowOver;
        }
        buttonRight.onmousedown = function() { 
            buttonRight.src = pathArrowPress;
        }
        buttonRight.onmouseup = function() {
            buttonRight.src = pathArrowOver;
            Game.switchRight();
        }
        buttonRight.onmouseleave = function() {
            buttonRight.src = pathArrowIdle;
        }
        document.body.appendChild(buttonRight);
    }


}

export default new Ui();