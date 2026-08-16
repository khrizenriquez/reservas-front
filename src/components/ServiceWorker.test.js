import {render} from "@testing-library/react";
import {ServiceWorker} from "./ServiceWorker";
it("registers the public service worker",()=>{const register=jest.fn();Object.defineProperty(window.navigator,"serviceWorker",{value:{register},configurable:true});render(<ServiceWorker/>);expect(register).toHaveBeenCalledWith("/sw.js");});it("does nothing when service workers are unavailable",()=>{Object.defineProperty(window.navigator,"serviceWorker",{value:undefined,configurable:true});expect(()=>render(<ServiceWorker/>)).not.toThrow();});
