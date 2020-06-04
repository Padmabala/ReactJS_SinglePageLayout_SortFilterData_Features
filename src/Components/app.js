import React,{useState} from 'react';
import "../../stylesheet.css"
//import { fetchData } from '../services/fetchData';
import { data } from "../db.json"
import SortByHeader from './SortByHeader';
import quickSort from '../services/sortData';
import { setInitialHeaderProperties, initialFilterSelectState } from '../services/helperFunctions';
import { useStickyState } from '../CustomHooks/CustomHooks';


const App = () => {
    // const getMockJSONData=(async ()=>{
    //     const data=await fetchData()
    //     console.log("Hello",data);
    //     setData(data);
    // })
    //getMockJSONData()    

    const rawData = JSON.parse(JSON.stringify(data))
    const [viewPortStyle, updateViewPortStyle] = useStickyState({ width: '100%' },'viewPortStyle')

    const tableHeaders = (Object.keys(data[0])).sort()

    const sortIdentifier = { 0: "Asc", 1: "Desc", 2: "any" }
    const sortableHeaders = ["Region", "Item"]
    const filterHeaders = ["Region", "Item"]
    let [filterValues, setFilterValues] = useStickyState([],'filterValues')
    const [arrayOfFilterBuckets, setArrayOfFilterBuckets] = useStickyState({},'arrayOfFilterBuckets')

    const [filterPaneOpenStatus, setFilterPaneOpenStatus] = useStickyState(false,'filterPaneOpenStatus')

    

    const initialHeaderProperties = setInitialHeaderProperties(tableHeaders,sortableHeaders,filterHeaders)
    const [headerProperties, updateHeaderProperties] = useStickyState(JSON.parse(JSON.stringify(initialHeaderProperties)),'headerProperties')


    
    const [filterSelectionStatus,distinctFiltersByTypes]=initialFilterSelectState(rawData,tableHeaders,headerProperties)

    const [filterSelectStatus, updateFilterSelectStatus] = useStickyState(filterSelectionStatus,'filterSelectStatus')
    const [distinctFiltersByFilterTypes,updateDistinctFiltersByFilterTypes]=useState(distinctFiltersByTypes)

    // const [sortedData, setSortedData] = useState(JSON.parse(JSON.stringify(rawData)))
    const [dataToDisplay, updateDataToDisplay] = useStickyState(JSON.parse(JSON.stringify(rawData)),'dataToDisplay')
    
    window.onunload=(()=>{
        localStorage.clear()
    })
    const sortStatus = (val) => {
        return headerProperties[val].sortId
    }

    const OnClickingSort = async (val) => {
        let status;
        if (headerProperties[val].sortable === true) {
            status = sortStatus(val)
            status = (status + 1) % 3
            updateHeaderProperties(prevState => ({ ...initialHeaderProperties, [val]: { ...prevState[val], sortId: status } }))

            if (sortIdentifier[status] === "Asc") {
                
                const editData=JSON.parse(JSON.stringify(dataToDisplay));
                await quickSort(editData, 0, (dataToDisplay.length) - 1, val)
                    .then((updatedDisplayData) => {
                        // setSortedData(newData)
                        updateDataToDisplay(updatedDisplayData)
                    })
                    
            }
            else if (sortIdentifier[status] === "Desc") {
                let reverseSort = []
                for (let j = (dataToDisplay.length) - 1; j >= 0; j--) {
                    reverseSort.push(dataToDisplay[j])
                }
                updateDataToDisplay(reverseSort)
            }
            else {
                if (filterPaneOpenStatus) {
                    updateDataToDisplay(dataToDisplay)
                }
                else {
                    updateDataToDisplay(rawData)
                }
            }
        }
    }
    const onClickFilterButton = () => {
        const tempFilterPaneOpenStatus = !filterPaneOpenStatus
        setFilterPaneOpenStatus(tempFilterPaneOpenStatus)
        if (!tempFilterPaneOpenStatus) {
            updateDataToDisplay(rawData)
            setArrayOfFilterBuckets({})
            const [filterSelectionStatus,distinctFiltersByFilterTypes]=initialFilterSelectState(rawData,tableHeaders,headerProperties)
            updateFilterSelectStatus(filterSelectionStatus)
            updateDistinctFiltersByFilterTypes(distinctFiltersByFilterTypes)
            setFilterValues([])
            updateViewPortStyle({ width: '100%' })
        }
        else {

            updateViewPortStyle({ width: '69%' })
            
        }
    }
    const onSetFilter = (field, val) => {

        let tempFilterSelectStatus = JSON.parse(JSON.stringify(filterSelectStatus))
        tempFilterSelectStatus = { ...tempFilterSelectStatus, [val]: !tempFilterSelectStatus[val] }
        updateFilterSelectStatus(tempFilterSelectStatus)
        let tempArrayOfFilterBuckets = JSON.parse(JSON.stringify(arrayOfFilterBuckets));


        let tempFilterValues = JSON.parse(JSON.stringify(filterValues))
        if (tempFilterSelectStatus[val]) {
            if (!filterValues.includes(val)) {
                tempFilterValues = [...tempFilterValues, val]
                setFilterValues(tempFilterValues)
            }
            if (field in tempArrayOfFilterBuckets) {
                if (!tempArrayOfFilterBuckets[field].includes(val)) {
                    tempArrayOfFilterBuckets[field].push(val)
                    setArrayOfFilterBuckets(tempArrayOfFilterBuckets)
                }
            }
            else {
                tempArrayOfFilterBuckets[field] = [val]
                setArrayOfFilterBuckets(tempArrayOfFilterBuckets)
            }
        }
        else {
            tempFilterValues = filterValues.filter((v) => (v!==val))
            setFilterValues(tempFilterValues)
            if (tempArrayOfFilterBuckets[field].length === 1) {
                delete tempArrayOfFilterBuckets[field]
                setArrayOfFilterBuckets(tempArrayOfFilterBuckets)

            }
            else {
                tempArrayOfFilterBuckets = ({ ...tempArrayOfFilterBuckets, [field]: tempArrayOfFilterBuckets[field].filter((v) => (v != val)) })
                setArrayOfFilterBuckets(tempArrayOfFilterBuckets)
            }


        }
        if (Object.keys(tempArrayOfFilterBuckets).length > 0) {
            let filteredData = []
            let sum = 1;
            rawData.map(data => {
                sum = 1
                for (let filterField in tempArrayOfFilterBuckets) {
                    sum = sum && tempArrayOfFilterBuckets[filterField].includes(data[filterField])
                }
                if (sum == 1) {
                    filteredData.push(data)
                }
            })

            updateDataToDisplay(filteredData)
        }
        else {

            updateDataToDisplay(rawData)
        }
    }
    return (
        <div>
            <div className="filterSection">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h1 className="title">List View</h1>
                            </td>
                            <td>
                                <button className="filterButton" onClick={onClickFilterButton}>Filter</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div className="row">
                <div className="left" style={viewPortStyle}>
                    <table className="listTable listViewStyle">
                        <thead>
                            <tr>
                                {
                                    tableHeaders.map((val, id) => {
                                        return (
                                            <th key={id} className="headCellStyle listViewStyle">
                                                {
                                                    <SortByHeader value={val} sortStatus={sortStatus(val)}
                                                        onClick={OnClickingSort}></SortByHeader>
                                                }
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                    
                        <tbody>

                            {
                                dataToDisplay.map((key, i) => {
                                    return (
                                        <tr key={i}>
                                            {
                                                tableHeaders.map((k, i) => (
                                                    <td key={i} className="headCellStyle listViewStyle">
                                                        {key[k]}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {
                    filterPaneOpenStatus
                        ?
                        <div className="right">
                            {
                                tableHeaders.map((val, id) => {
                                    return (
                                        headerProperties[val].canFilterWithField
                                            ?
                                            <div key={id}>
                                                <h5>{val}</h5>
                                                <form>
                                                    {
                                                        
                                                        distinctFiltersByFilterTypes[val].map((i, index) => {
                                                            return (<div key={index} style={{ display: 'inline' }}>
                                                                <label>
                                                                    <input
                                                                        name={i} type="checkbox"
                                                                        checked={filterSelectStatus[i]}
                                                                        value={i}
                                                                        onChange={(event) => { onSetFilter(val, event.target.value) }}
                                                                    />
                                                                    {i}
                                                                </label>
                                                            </div>)
                                                        })

                                                    }
                                                </form>
                                            </div>

                                            :
                                            <span key={id} />
                                    )
                                })
                            }
                        </div>
                        :
                        <>
                        </>
                }

            </div>


        </div>
    )

}
export default App;