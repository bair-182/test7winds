import React, {useEffect} from 'react';
import Header from "./Header/MainHeader";
import "../base.scss"
import DataSheet from "./DataSheet/DataSheet";
import {RootStateType, useAppDispatch} from "../m2-main-bll/store";
import {useSelector} from "react-redux";
import {Spin, Space, Result, Button} from 'antd';
import {CreateEntityThunk, initializeAppThunk} from "../m2-main-bll/app-reducer";
import {EntityType} from "../m3-API/DataSheetAPI";


const Main: React.FC = () => {

    const dispatch = useAppDispatch();
    const isAppInitialized = useSelector<RootStateType, boolean>(state => state.app.isAppInitialized)
    const entityID = useSelector<RootStateType, EntityType>(state => state.app.eID)
    const isLoading = useSelector<RootStateType, boolean>(state => state.app.isLoading)

    useEffect(() => {
        dispatch(initializeAppThunk())
    }, [dispatch])

    const createEntityClickHandler = () => {
        dispatch(CreateEntityThunk())
    }

    return (
        <div>
            <Header/>
            <Space className="spinner">
                <Spin spinning={isLoading} size={"large"}/>
            </Space>
            {(isAppInitialized && entityID.id !== 0 ) && <DataSheet/>}
            {(!isLoading && entityID.id === 0) && <Result
                style={{color: "white"}}
                extra={<div>
                    <h2>Для работы с API нужно получить EntityID</h2>
                    <Button type="primary" key="console"
                    onClick={createEntityClickHandler}
                    >
                        Получить Entity ID
                    </Button>
                </div>
                }
            ></Result>}
        </div>
    );
}

export default Main;
