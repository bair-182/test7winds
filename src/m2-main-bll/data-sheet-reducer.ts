import {
    DataSheetAPI,
    ForLibraryTreeRowsType,
    ToCreateRowRequestType,
    ToUpdateRowRequestType,
    TreeOneRowType
} from "../m3-API/DataSheetAPI";
import {ChangeIsLoading, changeIsLoadingAC} from "./app-reducer";
import {AppThunkType} from "./store";
import {TreeNode} from "cp-react-tree-table";
import { ROOT_ROW_ID_TO_EDIT} from "../m1-main-ui/DataSheet/TreeTableComponent/components/Demo";

const initTreeRowsState = {
    TreeStateFromRedux: [] as Array<TreeNode<ForLibraryTreeRowsType>>,
    RawTreeRowStateFromAPI: [] as TreeOneRowType[]
}

export const dataSheetReducer = (state: InitStateTypeApp = initTreeRowsState, action: DataSheetActionType): InitStateTypeApp => {
    switch (action.type) {
        case "GET_TREE_ROWS":
            return {
                ...state,
                TreeStateFromRedux: [...action.treeRowsData.map(el => ({
                    data: {
                        id: el.id,
                        rowName: el.rowName,
                        salary: el.salary,
                        supportCosts: el.supportCosts,
                        estimatedProfit: el.estimatedProfit,
                        machineOperatorSalary: el.machineOperatorSalary,
                        mainCosts: el.mainCosts,
                        materials: el.materials,
                        mimExploitation: el.mimExploitation,
                        overheads: el.overheads,
                        total: el.total,
                        equipmentCosts: el.equipmentCosts
                    },
                    height: 32,
                    children: [...el.child.map(el => ({
                        data: {
                            id: el.id,
                            rowName: el.rowName,
                            salary: el.salary,
                            supportCosts: el.supportCosts,
                            estimatedProfit: el.estimatedProfit,
                            machineOperatorSalary: el.machineOperatorSalary,
                            mainCosts: el.mainCosts,
                            materials: el.materials,
                            mimExploitation: el.mimExploitation,
                            overheads: el.overheads,
                            total: el.total,
                            equipmentCosts: el.equipmentCosts
                        },
                        height: 32,
                        children: [...el.child.map(el => ({
                            data: {
                                id: el.id,
                                rowName: el.rowName,
                                salary: el.salary,
                                supportCosts: el.supportCosts,
                                estimatedProfit: el.estimatedProfit,
                                machineOperatorSalary: el.machineOperatorSalary,
                                mainCosts: el.mainCosts,
                                materials: el.materials,
                                mimExploitation: el.mimExploitation,
                                overheads: el.overheads,
                                total: el.total,
                                equipmentCosts: el.equipmentCosts
                            },
                            height: 32,
                        }))]
                    }))]
                }))]
            }
        case "GET_RAW_TREE_ROWS_FROM_API":
            return {...state, RawTreeRowStateFromAPI: action.treeRowsDataAPI}

        default:
            return state
    }
}

//ACTION CREATOR
export const getTreeRowsAC = (treeRowsData: TreeOneRowType[]) => ({type: "GET_TREE_ROWS", treeRowsData} as const)
export const RawTreeRowStateFromAPIAC = (treeRowsDataAPI: TreeOneRowType[]) => ({type: "GET_RAW_TREE_ROWS_FROM_API", treeRowsDataAPI} as const)


// THUNKa
export const refreshRowsThunk = () => (dispatch: AppThunkType) => {
    dispatch(changeIsLoadingAC(true))
    const eIDFromLocStorage = Number(localStorage.getItem('entityID'))
    DataSheetAPI.getTreeRows(eIDFromLocStorage)
        .then((res) => {
            if (eIDFromLocStorage !== 0) {
                if (res.data.length === 0) {
                    dispatch(getTreeRowsAC([{
                        id: ROOT_ROW_ID_TO_EDIT,
                        child: [],
                        equipmentCosts: 0,
                        estimatedProfit: 0,
                        machineOperatorSalary: 0,
                        mainCosts: 0,
                        materials: 0,
                        mimExploitation: 0,
                        overheads: 0,
                        rowName: "",
                        salary: 0,
                        supportCosts: 0,
                        total: 0,
                    }]))
                } else {
                    dispatch(getTreeRowsAC(res.data))
                }

                dispatch(RawTreeRowStateFromAPIAC(res.data))
            }
        })
        .catch((error: any) => {
            console.log({...error});
        })
        .finally(() => {
            dispatch(changeIsLoadingAC(false))
        })
}

export const createRowThunk = (RowData: ToCreateRowRequestType) => (dispatch: AppThunkType) => {
    dispatch(changeIsLoadingAC(true))
    const eIDFromLocStorage = Number(localStorage.getItem('entityID'))
    DataSheetAPI.createRowInEntity(eIDFromLocStorage,RowData)
        .then(() => {
            dispatch(refreshRowsThunk())
        })
        .catch((error: any) => {
            console.log({...error});
        })
        .finally(() => {
            dispatch(changeIsLoadingAC(false))
        })
}

export const deleteRowThunk = (rID: number | null) => (dispatch: AppThunkType) => {
    dispatch(changeIsLoadingAC(true))
    const eIDFromLocStorage = Number(localStorage.getItem('entityID'))
    DataSheetAPI.deleteRow(eIDFromLocStorage,rID)
        .then((res) => {
            dispatch(refreshRowsThunk())
        })
        .catch((error: any) => {
            console.log({...error});
        })
        .finally(() => {
            dispatch(changeIsLoadingAC(false))
        })
}

export const sendUpdatesToRowThunk = (rId: number | null, toUpdateRowData: ToUpdateRowRequestType) => (dispatch: AppThunkType) => {
    dispatch(changeIsLoadingAC(true))
    const eIDFromLocStorage = Number(localStorage.getItem('entityID'))
    DataSheetAPI.updateRow(eIDFromLocStorage,rId, toUpdateRowData)
        .then((res) => {
            dispatch(refreshRowsThunk())
        })
        .catch((error: any) => {
            console.log({...error});
        })
        .finally(() => {
            dispatch(changeIsLoadingAC(false))
        })
}

//TYPES
export type getTreeRowsACType = ReturnType<typeof getTreeRowsAC>
export type RawTreeRowStateFromAPIACType = ReturnType<typeof RawTreeRowStateFromAPIAC>


export type InitStateTypeApp = typeof initTreeRowsState

export type DataSheetActionType =
    | getTreeRowsACType
    | ChangeIsLoading
    | RawTreeRowStateFromAPIACType


