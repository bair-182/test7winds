import React from 'react';
import "./DataSheet.style.scss"
import SelectAntdComponent from "../../components/Select";
import TreeTableComponent from "./TreeTableComponent/TreeTableComponent";


const DataSheet: React.FC = () => {
    return (
        <div>
            <div className="sheetContainer">
                <div className="leftContainer">
                    <h2>Название проекта</h2>
                    <SelectAntdComponent/>
                </div>
                <div className="rightContainer">
                    <TreeTableComponent/>
                </div>
            </div>
        </div>
    );
}

export default DataSheet;
