import React from 'react';
import "./Navbar.style.scss"
import {AppstoreOutlined, ArrowLeftOutlined, DeleteFilled} from '@ant-design/icons';
import {Button, Popconfirm, Space, Tooltip} from "antd";
import {useSelector} from "react-redux";
import {RootStateType, useAppDispatch} from "../../../m2-main-bll/store";
import {DeleteEntityThunk} from "../../../m2-main-bll/app-reducer";


const Navbar: React.FC = () => {

    const dispatch = useAppDispatch();
    const entityID = useSelector<RootStateType, number>(state => state.app.eID.id)

    const deleteEntityHandler = () => {
        dispatch(DeleteEntityThunk())
    }

    return (
        <div className="navContainer">
            <Space align="center">
                <AppstoreOutlined style={{fontSize: '25px', marginLeft: 5}}/>
                <ArrowLeftOutlined style={{fontSize: '25px'}}/>
                <Button
                    type="primary"
                    size={"small"}
                    disabled={false}
                    loading={false}
                >Просмотр</Button>
                <Button
                    type="default"
                    size={"small"}
                    disabled={false}
                    loading={false}
                >Управление</Button>
            </Space>
            <Space>
                <Button
                    type="primary"
                    style={{color: "white"}}
                    size={"small"}
                    disabled={false}
                    loading={false}
                >Мой entity: {} </Button>
                <Button
                    type="default"
                    style={{color: "black", width: 100}}
                    size={"small"}
                    disabled={false}
                    loading={false}
                >{entityID !== 0
                    ?   <Popconfirm title={`Удалить EntityID???`} onConfirm={deleteEntityHandler} placement="bottomRight">
                            {entityID}<Tooltip title="Удалить EntityID" ><DeleteFilled className="hiddenBox"
                                                    style={{fontSize: 16, marginRight: 0, marginLeft: 5, paddingTop: 2, color: "#DF4444"}}
                        /></Tooltip>
                        </Popconfirm>
                    : "отсутствует"}</Button>
            </Space>
        </div>
    );
}

export default Navbar;
