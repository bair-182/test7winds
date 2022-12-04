import React, {
    KeyboardEvent,
    Fragment,
    useState,
    useEffect,
    ChangeEvent,
    useCallback,
} from "react";

import {TreeTable, TreeState, TreeNode, Row} from "cp-react-tree-table";
import {
    DeleteFilled,
    FileTextFilled,
    FolderFilled,
} from "@ant-design/icons";
import {Popconfirm, Tooltip} from "antd";
import {useSelector} from "react-redux";
import {RootStateType, useAppDispatch} from "../../../../m2-main-bll/store";
import { ForLibraryTreeRowsType, TreeOneRowType} from "../../../../m3-API/DataSheetAPI";
import {
    createRowThunk,
    deleteRowThunk, getTreeRowsAC,
    refreshRowsThunk,
    sendUpdatesToRowThunk
} from "../../../../m2-main-bll/data-sheet-reducer";

type PropsType = {
    treeStateRdx: TreeNode<ForLibraryTreeRowsType>[]
}

export const ROOT_ROW_ID_TO_EDIT = 999999999;

type ColumnNameType = "salary" | "rowName" | "overheads" | "equipmentCosts" | "estimatedProfit"

export const TreeGridComponent = React.memo ( function (props:PropsType) {

    const dispatch = useAppDispatch();
    const isLoading = useSelector<RootStateType, boolean>(state => state.app.isLoading)

    const RawTreeRowRdxState = useSelector<RootStateType, TreeOneRowType[]>(state => state.dataSheet.RawTreeRowStateFromAPI)
    const [treeState, setTreeState] = useState<Readonly<TreeState<ForLibraryTreeRowsType>>>(TreeState.create<ForLibraryTreeRowsType>( props.treeStateRdx ));

    const [editRowMode, setEditRowMode] = useState(false)
    const [currentEditRowId, setCurrentEditRowId] = useState<null | number>(null)
    const [currentParentId, setCurrentParentId] = useState<null | number>(null)
    const [onDoubleClickedColumn, setOnDoubleClickedColumn] = useState<ColumnNameType>("rowName")

    const onChangeTreeTableHandler = (newVal: TreeState<ForLibraryTreeRowsType>) => {
        setTreeState( newVal );
    };

    useEffect(()=> {
        if (props.treeStateRdx.length !== 0) {
            const newStateFromRdx = TreeState.create<ForLibraryTreeRowsType>( props.treeStateRdx )
            setTreeState(newStateFromRdx);
            setTreeState((prev) => TreeState.expandAll(prev));
        }
    },[ props.treeStateRdx ])

    useEffect(() => {
        dispatch(refreshRowsThunk());
    }, [ dispatch ]);

    const renderHeaderCell = useCallback((name: string, alignLeft: boolean = true) => {
        return () => {
            return (<span className={alignLeft ? "align-left" : "align-right"}>{name}</span>);
        }
    },[])

    const deleteRowHandler = useCallback((row: Row<ForLibraryTreeRowsType>) => {
        dispatch(deleteRowThunk(row.data.id))
    },[dispatch])

    const onClickRootFolderHandler = useCallback((row: Row<ForLibraryTreeRowsType>) => {
        dispatch(getTreeRowsAC([...RawTreeRowRdxState, {
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
        editModeOn({...row, data: {...row.data, id: ROOT_ROW_ID_TO_EDIT}}, "rowName" )
    },[RawTreeRowRdxState, dispatch])

    const onClickSecondFolderHandler = useCallback((row: Row<ForLibraryTreeRowsType>) => {
        let NewRowDepthIsTwo = {
            id: ROOT_ROW_ID_TO_EDIT,
            child: [] ,
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
            total: 0
        } as TreeOneRowType

        let newArr = RawTreeRowRdxState.map(el => el.id === row.data.id ? {...el, child: [...el.child, NewRowDepthIsTwo]}
            : {...el, child: el.child.map(el => el.id === row.data.id ? {...el, child: [...el.child, NewRowDepthIsTwo]} : el)})
        dispatch(getTreeRowsAC(newArr))

        setCurrentParentId(row.data.id)
        editModeOn({...row, data: {...row.data, id: ROOT_ROW_ID_TO_EDIT}}, "rowName" )
    },[RawTreeRowRdxState, dispatch])

    const editModeOn = (row: Row<ForLibraryTreeRowsType>, value: ColumnNameType) => {
        setEditRowMode(true)
        setCurrentEditRowId(row.data.id)
        setOnDoubleClickedColumn(value)
    }

    const editModeOff = useCallback(() => {
        if (currentEditRowId === ROOT_ROW_ID_TO_EDIT) {
            dispatch(getTreeRowsAC([...RawTreeRowRdxState.filter(el => el.id !== ROOT_ROW_ID_TO_EDIT)]))
        }
        setEditRowMode(false)
        setCurrentEditRowId(null)
        setCurrentParentId(null)
    },[RawTreeRowRdxState, currentEditRowId, dispatch])

    const renderIndexCell = useCallback((row: Row<ForLibraryTreeRowsType>) => {
        return (
            <div className="levelColumn" style={{marginLeft: (row.metadata.depth * 22) + "px"}}>
                <div>
                    <span>
                        <Tooltip title="Создать строку первого уровня" >
                        {(row.metadata.depth === 0) &&
                            <FolderFilled style={{color: "#5F98F5", fontSize: 18, marginRight: 5, paddingTop: 2}}
                                          hidden={row.metadata.hasChildren}
                                          onClick={()=>onClickRootFolderHandler(row)}
                                          disabled={isLoading || editRowMode}
                            />}</Tooltip>
                        {(row.metadata.depth === 1 && row.metadata.hasChildren) &&
                            <FolderFilled style={{color: "#95FFAC", fontSize: 18, marginRight: 5, paddingTop: 2}}
                                          hidden={row.metadata.hasChildren}

                                          disabled={isLoading || editRowMode}
                            />}
                    </span>
                    <Tooltip title="Создать подстроку" >
                        <FileTextFilled
                            onClick={()=>onClickSecondFolderHandler(row)}
                            disabled={isLoading || editRowMode}
                            className={`${row.metadata.hasChildren ? "hiddenBox" : ""}`}
                            style={{fontSize: 16, marginRight: 5, paddingTop: 2, color: "#7890B2"}}/>
                    </Tooltip>
                    <Popconfirm disabled={(isLoading || editRowMode) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0)} title={`Удалить строку ${row.data.rowName}???`} onConfirm={()=>deleteRowHandler(row)} onOpenChange={()=>{}}>
                        <DeleteFilled className="hiddenBox"
                                      disabled={(isLoading || editRowMode) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0)}
                                      style={{fontSize: 16, marginRight: 5, paddingTop: 2, color: "#DF4444"}}/>
                    </Popconfirm>
                </div>
            </div>
        );
    },[RawTreeRowRdxState.length, deleteRowHandler, editRowMode, isLoading, onClickRootFolderHandler, onClickSecondFolderHandler, props.treeStateRdx.length])

    const onChangeToUpdateRowHandler = (row: Row<ForLibraryTreeRowsType>, event: ChangeEvent<HTMLInputElement>, value: ColumnNameType ) => {
        if( !isNaN(Number(event.currentTarget.value))) {
            value === "salary" && row.updateData({...row.data, salary: Number(event.target.value)});
            value === "equipmentCosts" && row.updateData({...row.data, equipmentCosts: Number(event.target.value)});
            value === "overheads" && row.updateData({...row.data, overheads: Number(event.target.value)});
            value === "estimatedProfit" && row.updateData({...row.data, estimatedProfit: Number(event.target.value)});
        }
        value === "rowName" && row.updateData({...row.data, rowName: event.target.value});
    }

    const onKeyPressHandler = ( row: Row<ForLibraryTreeRowsType>, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Escape') { editModeOff() }
        if (event.code === 'Enter' && row.data.id !== ROOT_ROW_ID_TO_EDIT) {
            dispatch(sendUpdatesToRowThunk(currentEditRowId, {
                equipmentCosts: row.data.equipmentCosts,
                estimatedProfit: row.data.estimatedProfit,
                machineOperatorSalary: row.data.machineOperatorSalary,
                mainCosts: row.data.mainCosts,
                materials: row.data.materials,
                mimExploitation: row.data.mimExploitation,
                overheads: row.data.overheads,
                rowName: row.data.rowName,
                salary: row.data.salary,
                supportCosts: row.data.supportCosts
            }))
            editModeOff();
        }
        if (event.code === 'Enter' && row.data.id === ROOT_ROW_ID_TO_EDIT && (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0)) {
            dispatch(createRowThunk( {
                parentId: null,
                equipmentCosts: row.data.equipmentCosts,
                estimatedProfit: row.data.estimatedProfit,
                machineOperatorSalary: row.data.machineOperatorSalary,
                mainCosts: row.data.mainCosts,
                materials: row.data.materials,
                mimExploitation: row.data.mimExploitation,
                overheads: row.data.overheads,
                rowName: row.data.rowName,
                salary: row.data.salary,
                supportCosts: row.data.supportCosts
            } ))
            editModeOff();

        }
        if ((event.code === 'Enter' && row.data.id === ROOT_ROW_ID_TO_EDIT && (props.treeStateRdx.length!==0 && RawTreeRowRdxState.length !== 0)) || (event.code === 'Enter' && currentParentId ))  {
            dispatch(createRowThunk( {
                parentId: currentParentId,
                equipmentCosts: row.data.equipmentCosts,
                estimatedProfit: row.data.estimatedProfit,
                machineOperatorSalary: row.data.machineOperatorSalary,
                mainCosts: row.data.mainCosts,
                materials: row.data.materials,
                mimExploitation: row.data.mimExploitation,
                overheads: row.data.overheads,
                rowName: row.data.rowName,
                salary: row.data.salary,
                supportCosts: row.data.supportCosts
            } ))
            editModeOff();
        }
    }

    const renderNameOfOperation = (row: Row<ForLibraryTreeRowsType>) => {
        return (
            ((editRowMode && currentEditRowId === row.data.id) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0))
                ? <input type="text" value={row.data.rowName}
                         autoFocus={onDoubleClickedColumn === "rowName"}

                         onKeyDown={(event) => onKeyPressHandler(row, event)}
                         onChange={(event) => onChangeToUpdateRowHandler(row,event, "rowName")}
                />
                : <span style={{marginLeft: (row.metadata.depth * 22) + "px"}} onDoubleClick={() => editModeOn(row, "rowName")}>{row.data.rowName}</span>
        );
    }
    const renderSalaryCell = (row: Row<ForLibraryTreeRowsType>) => {
        return (
            ((editRowMode && currentEditRowId === row.data.id) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0))
                ? <input className="expenses-cell" type="text" value={row.data.salary}
                         autoFocus={onDoubleClickedColumn === "salary"}
                         onKeyDown={(event) => onKeyPressHandler(row, event)}
                         onChange={(event) => onChangeToUpdateRowHandler(row,event, "salary")}

                />
                : <span className="employees-cell" onDoubleClick={() => editModeOn(row, "salary")}>{row.data.salary}</span>
        );
    }
    const renderOverheadsCell = (row: Row<ForLibraryTreeRowsType>) => {
        return (
            ((editRowMode && currentEditRowId === row.data.id) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0))
                ? <input className="expenses-cell" type="text" value={row.data.overheads}
                         autoFocus={onDoubleClickedColumn === "overheads"}
                         onKeyDown={(event) => onKeyPressHandler(row, event)}
                         onChange={(event) => onChangeToUpdateRowHandler(row,event, "overheads")}
                />
                : <span className="employees-cell"
                        onDoubleClick={() => editModeOn(row, "overheads")}>{row.data.overheads}</span>
        );
    }
    const renderEquipmentCostsCell = (row: Row<ForLibraryTreeRowsType>) => {
        return (
            ((editRowMode && currentEditRowId === row.data.id) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0))
                ? <input className="expenses-cell" type="text" value={row.data.equipmentCosts}
                         autoFocus={onDoubleClickedColumn === "equipmentCosts"}
                         onKeyDown={(event) => onKeyPressHandler(row, event)}
                         onChange={(event) => onChangeToUpdateRowHandler(row,event, "equipmentCosts")}
                />
                : <div className="expenses-cell"
                        onDoubleClick={() => editModeOn(row, "equipmentCosts")}>{row.data.equipmentCosts}</div>
        );
    }
    const renderEstimatedProfitCell = (row: Row<ForLibraryTreeRowsType>) => {
        return (
            ((editRowMode && currentEditRowId === row.data.id) || (props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0))
                ? <input className="expenses-cell" type="text" value={row.data.estimatedProfit}
                         autoFocus={onDoubleClickedColumn === "estimatedProfit"}
                         onKeyDown={(event) => onKeyPressHandler(row, event)}
                         onChange={(event) => onChangeToUpdateRowHandler(row,event, "estimatedProfit")}
                />
                : <div className="expenses-cell"
                        onDoubleClick={() => editModeOn(row, "estimatedProfit")}>{row.data.estimatedProfit}</div>
        );
    }

    // const handleOnExpandAll = () => {
    //     setTreeState((prev) => TreeState.expandAll(prev));
    // }
    //
    // const handleOnCollapseAll = () => {
    //     setTreeState((prev) => TreeState.collapseAll(prev));
    // }

        return (
            <Fragment>
                <div>
                    <h1>Строительно-монтажные работы</h1>
                    {/*<div className="controls">*/}
                    {/*    <div >*/}
                    {/*        <div className="control-section">*/}
                    {/*            <button onClick={handleOnExpandAll}>Expand all</button>*/}
                    {/*            <button onClick={handleOnCollapseAll}>Collapse all</button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <TreeTable<ForLibraryTreeRowsType> className="demo-tree-table"
                                                       height={666}
                                                       headerHeight={28}
                                                       value={treeState}
                                                       onChange={(newVal: TreeState<ForLibraryTreeRowsType>) => {
                                                           onChangeTreeTableHandler(newVal);
                                                       }}>
                        <TreeTable.Column renderCell={renderIndexCell}
                                          renderHeaderCell={renderHeaderCell("Уровень")}
                                          basis="150px"
                                          grow={0}
                        />
                        <TreeTable.Column renderCell={renderNameOfOperation}
                                          renderHeaderCell={renderHeaderCell("Наименование работ")}/>
                        <TreeTable.Column renderCell={renderSalaryCell}
                                          renderHeaderCell={renderHeaderCell("Основная з/п", false)}/>
                        <TreeTable.Column renderCell={renderEquipmentCostsCell}
                                          renderHeaderCell={renderHeaderCell("Оборудование", false)}/>
                        <TreeTable.Column renderCell={renderOverheadsCell}
                                          renderHeaderCell={renderHeaderCell("Накладные расходы", false)}/>
                        <TreeTable.Column renderCell={renderEstimatedProfitCell}
                                          renderHeaderCell={renderHeaderCell("Сметная прибыль", false)}/>
                    </TreeTable>
                    {/*<div>{(props.treeStateRdx.length===1 && RawTreeRowRdxState.length === 0) && <Empty className="emptyIcon" />}</div>*/}
                </div>
            </Fragment>
        );
})
