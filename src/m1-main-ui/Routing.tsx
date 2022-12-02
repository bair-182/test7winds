import React from "react";
import {Route, Routes} from "react-router-dom";

import Main from "./Main";

export const MAIN_PATH = "/main";

const Routing: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path={"/"} element={<Main/>}/>

            </Routes>
        </>
    );
};

export default Routing;
