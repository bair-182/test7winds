import React from "react";

import "./styles/index.scss";
import "./styles/header.scss";
import "./styles/table.scss";
import "./styles/responsive.scss";

import Layout from "./components/Layout";
import {TreeGridComponent} from "./components/Demo";
import {useSelector} from "react-redux";
import {RootStateType} from "../../../m2-main-bll/store";
import {TreeNode} from "cp-react-tree-table";
import {ForLibraryTreeRowsType} from "../../../m3-API/DataSheetAPI";



const TreeTableComponent = () => {

    const treeStateRdx = useSelector<RootStateType, TreeNode<ForLibraryTreeRowsType>[]>(state => state.dataSheet.TreeStateFromRedux)

    return <>
        <Layout>
            <TreeGridComponent treeStateRdx={treeStateRdx}/>
        </Layout>
    </>
}

export default TreeTableComponent;