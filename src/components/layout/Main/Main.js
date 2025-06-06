import "./Main.css";
import { cleanPage } from "../../../utils/cleanPage.js";
import { Home } from "../../../pages/Home/Home.js";
import { Cart } from "../../../pages/Cart/Cart.js";

export const Main = (page) => {
    let main = document.querySelector("main");

    if(!main){
        main = document.createElement("main");
        document.body.appendChild(main);
    }

    cleanPage(main);

    if (page === "home") {
        main.appendChild(Home());
    }else if (page === "cart") {
        main.appendChild(Cart());
    }
}