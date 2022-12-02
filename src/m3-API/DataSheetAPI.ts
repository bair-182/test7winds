import {instance} from "./base-url";

export const DataSheetAPI = {
    createEntity() {
        return instance.post<EntityType>(`/v1/outlay-rows/entity/create`)
    },
    getTreeRows(eID:number) {
        return instance.get<TreeOneRowType[]>(`/v1/outlay-rows/entity/${eID}/row/list`)
    },
    createRowInEntity (eID:number, RowData: ToCreateRowRequestType) {
        return instance.post(`/v1/outlay-rows/entity/${eID}/row/create`, {...RowData})
    },
    deleteRow (eID:number, rID: number | null) {
        return instance.delete(`/v1/outlay-rows/entity/${eID}/row/${rID}/delete`)
    },
    updateRow (eID:number, rId: number | null, toUpdateRowData: ToUpdateRowRequestType) {
        return instance.post(`/v1/outlay-rows/entity/${eID}/row/${rId}/update`, {...toUpdateRowData})
    }
};

export type EntityType = {
    id: number,
    rowName: string | null,
}

export type TreeOneRowType = {
    child: TreeOneRowType[],
    equipmentCosts: number,
    estimatedProfit: number,
    id: number,
    machineOperatorSalary: number,
    mainCosts: number,
    materials: number,
    mimExploitation: number,
    overheads: number,
    rowName: string,
    salary: number,
    supportCosts: number,
    total: number
}

export type ForLibraryTreeRowsType = {
    equipmentCosts: number,
    estimatedProfit: number,
    id: number | null,
    machineOperatorSalary: number,
    mainCosts: number,
    materials: number,
    mimExploitation: number,
    overheads: number,
    rowName: string,
    salary: number,
    supportCosts: number,
    total: number
}

export type ToUpdateRowRequestType = {
    equipmentCosts: number,
    estimatedProfit: number,
    machineOperatorSalary: number,
    mainCosts: number,
    materials: number,
    mimExploitation: number,
    overheads: number,
    rowName: string,
    salary: number,
    supportCosts: number
}

export type ToCreateRowRequestType = {
    equipmentCosts: number,
    estimatedProfit: number
    machineOperatorSalary: number,
    mainCosts: number,
    materials: number,
    mimExploitation: number,
    overheads: number,
    parentId: number | null,
    rowName: string,
    salary: number,
    supportCosts: number
}
