import {render,screen} from "@testing-library/react";
import Page from "./page";
const api={listLabs:jest.fn().mockResolvedValue([]),listLabConditions:jest.fn().mockResolvedValue([]),listUsers:jest.fn().mockResolvedValue([]),listAuditLogs:jest.fn().mockResolvedValue([])};jest.mock("@/services/render-api",()=>({createRenderApiClient:()=>api}));
it("loads Render administration data",async()=>{render(<Page/>);expect(await screen.findByRole("heading",{name:"Administración"})).toBeInTheDocument();expect(screen.getByText("Laboratorios")).toBeInTheDocument();});
