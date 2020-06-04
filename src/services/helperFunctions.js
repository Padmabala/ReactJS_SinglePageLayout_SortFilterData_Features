export const setInitialHeaderProperties = (tableHeaders,sortableHeaders,filterHeaders) => {
    let headersInfo = {}
    tableHeaders.map(val => {
        let fieldProperty = {}
        if (sortableHeaders.includes(val)) {
            fieldProperty.sortable = true
        }
        else {
            fieldProperty.sortable = false
        }
        if (filterHeaders.includes(val)) {
            fieldProperty.canFilterWithField = true
        }
        else {
            fieldProperty.canFilterWithField = false
        }
        fieldProperty.sortId = 2
        headersInfo = { ...headersInfo, [val]: { ...fieldProperty } }
    })
    return headersInfo
}

export const initialFilterSelectState = (rawData,tableHeaders,headerProperties) => {
    let filterSelectionStatus = {}
    let distinctFiltersByTypes={}
    rawData.map((data) => {
        tableHeaders.map((field) => {
            if (headerProperties[field].canFilterWithField === true) {
                filterSelectionStatus[data[field]] = false
            }
            if (field in distinctFiltersByTypes) {
                if (!distinctFiltersByTypes[field].includes(data[field])) {
                    distinctFiltersByTypes[field].push(data[field])
                }
            }
            else {
                distinctFiltersByTypes[field] = [data[field]]
            }
        })
    })
    return [filterSelectionStatus,distinctFiltersByTypes]
}