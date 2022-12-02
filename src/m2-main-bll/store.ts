import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware, { ThunkDispatch } from "redux-thunk"

import {AppAction, appReducer} from "./app-reducer";
import {useDispatch} from "react-redux";
import {dataSheetReducer} from "./data-sheet-reducer";


const reducers = combineReducers({
    app: appReducer,
    dataSheet: dataSheetReducer,
});

const store = createStore(reducers, applyMiddleware(thunkMiddleware));
export default store

export type AppThunkType = ThunkDispatch<RootStateType, void, AppAction>
export type RootStateType = ReturnType<typeof reducers>;

export const useAppDispatch = () => useDispatch<AppThunkType>();

// @ts-ignore
window.store = store; // for dev
