
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { Header,  } from "../components";

const origin =  window.location.origin;
const readerAccount = {email: 'email@email.em', name:'John', google: true}
const writerAccount = {email: 'email@email.em', name:'John'}
describe("Account Action in Header", () => {


    it("shows Login buttons(Google, Azure)", async () => {

        const domElement = document.createElement("div");
        await act(async () => {
          ReactDOM.render(<Header />, domElement);
        });
        expect(
            Array.from(domElement.querySelectorAll("a")).map((e) => e.innerHTML)
          ).toEqual(["News App", "Writer Login", "Join by Google"]);

        expect(
        Array.from(domElement.querySelectorAll("a")).map((e) => e.href)
        ).toEqual([origin+"/", origin+"/login",origin+"/logingoogle"]);


        expect(domElement.innerHTML).toMatchSnapshot();
    });  
    
    
    it("shows Logout", async () => {

        const domElement = document.createElement("div");
        await act(async () => {
          ReactDOM.render(<Header account={readerAccount} />, domElement);
        });

        expect(domElement.querySelector("#logout").innerHTML).toEqual(
            "Logout"
          );

          expect(domElement.querySelector("#logout").href).toEqual(
            origin+"/Logout"
          );

        expect(domElement.innerHTML).toMatchSnapshot();
    });  


    it("shows ADD And MyArticles And Logout Buttons for writer", async () => {

        const domElement = document.createElement("div");
        await act(async () => {
          ReactDOM.render(<Header account={writerAccount} />, domElement);
        });
        expect(
            Array.from(domElement.querySelectorAll("div a")).map((e) => e.innerHTML)
          ).toEqual(["News App", "Add", "My articles", "Logout"]);

        expect(
        Array.from(domElement.querySelectorAll("div a")).map((e) => e.href)
        ).toEqual([origin+"/", origin+"/add", origin+"/myarticles", origin+"/Logout"]);


        expect(domElement.innerHTML).toMatchSnapshot();
    });
    

});