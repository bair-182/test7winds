import {DataSheetAPI, EntityType} from "../m3-API/DataSheetAPI";
import {DataSheetActionType, getTreeRowsAC, RawTreeRowStateFromAPIAC} from "./data-sheet-reducer";
import {AppThunkType, RootStateType} from "./store";

const initStateApp = {
    appError: null as null | string,
    appSuccess: null as null | string,
    appInfo: null as null | string,

    isLoading: false,
    isAppInitialized: false,

    eID: {
        id: 0,
        rowName: ""
    } as EntityType
}

export const appReducer = (state: InitStateTypeApp = initStateApp, action: AppAction): InitStateTypeApp => {
    switch (action.type) {
        case "app/SET_IS_AUTH":
            return {...state, isAppInitialized: action.isAuthAction}
        case "app/CHANGE-IS-LOADING":
            return {...state, isLoading: action.isLoadingApp}
        case "app/SET-ERROR":
            return {...state, appError: action.error}

        case "app/SET-ENTITY":
            return  {...state, eID: {...action.entity}}

        default:
            return state
    }
}

//ACTION CREATOR
export const isAppInitializedAC = (isAuthAction: boolean) => ({type: "app/SET_IS_AUTH", isAuthAction} as const)
export const changeIsLoadingAC = (isLoadingApp: boolean) => {
    return {
        type: "app/CHANGE-IS-LOADING",
        isLoadingApp
    } as const
}
export const setAppErrorAC = (error: string | null) => ({type: "app/SET-ERROR", error} as const)
export const setEntityFromAPI_AC = (entity: EntityType) => ({type: "app/SET-ENTITY", entity} as const)


// THUNK
export const initializeAppThunk = () => (dispatch: AppThunkType, getState: () => RootStateType) => {
    dispatch(changeIsLoadingAC(true))
    const rowNameFromLocStorage = localStorage.getItem('entityRowName')
    const eIDFromLocStorage = Number(localStorage.getItem('entityID'))
    const eIDFrom_Redux = getState().app.eID
    DataSheetAPI.getTreeRows(eIDFromLocStorage)
        .then(() => {
            if (eIDFromLocStorage !== 0 || eIDFrom_Redux.id !== eIDFromLocStorage) {
                dispatch(setEntityFromAPI_AC({rowName: rowNameFromLocStorage, id: eIDFromLocStorage}))
            }
        })
        .catch((error: any) => {
            console.log({...error});
        })
        .finally(() => {
            dispatch(changeIsLoadingAC(false))
            dispatch(isAppInitializedAC(true))
        })
}

export const CreateEntityThunk = () => (dispatch: AppThunkType) => {
    dispatch(changeIsLoadingAC(true))
    const eIDFromLocStorage = Number(localStorage.getItem('entityID'))
    DataSheetAPI.createEntity()
        .then((res) => {
            if (eIDFromLocStorage !== 0) {
                dispatch(setEntityFromAPI_AC({rowName: "", id: eIDFromLocStorage}))
            } else dispatch(setEntityFromAPI_AC({...res.data}))

            localStorage.setItem('entityID', JSON.stringify(res.data.id))
            localStorage.setItem('entityRowName', JSON.stringify(res.data.rowName))
        })
        .catch((error: any) => {
            console.log({...error});
        })
        .finally(() => {
            dispatch(changeIsLoadingAC(false))
            dispatch(isAppInitializedAC(true))

        })
}

export const DeleteEntityThunk = () => (dispatch: AppThunkType) => {
    dispatch(changeIsLoadingAC(true))
    try {
        localStorage.clear();
        localStorage.removeItem('entityID');
            dispatch(setEntityFromAPI_AC({rowName: "", id: 0}));
            dispatch(getTreeRowsAC([]));
            dispatch(RawTreeRowStateFromAPIAC([]));
            dispatch(isAppInitializedAC(false));
    } catch(e) {
        console.error(e);
    } finally {
        dispatch(changeIsLoadingAC(false))
    }
}

//TYPES
export type SetIsAuthActionType = ReturnType<typeof isAppInitializedAC>
export type ChangeIsLoading = ReturnType<typeof changeIsLoadingAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type setEntityFromAPI_ACType = ReturnType<typeof setEntityFromAPI_AC>

export type InitStateTypeApp = typeof initStateApp

export type AppAction =
    | DataSheetActionType
    | SetIsAuthActionType
    | ChangeIsLoading
    | SetAppErrorActionType
    | setEntityFromAPI_ACType
