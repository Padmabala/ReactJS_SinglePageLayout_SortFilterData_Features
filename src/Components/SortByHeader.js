import React from 'react';
import PropTypes from 'prop-types';
const SortByHeader=props=>{
    
    return(
        <>
        <button type="button" className="btn btn-primary"
        onClick={()=>props.onClick(props.value)}
        >
        {props.value}
        </button>
        
            {props.sortStatus==0
            ?
            <img src="../../static/images/upArrow.jpg" alt="Asc" width="15px" height="15px"></img>
            :
            props.sortStatus==1
            ?
            <img src="../../static/images/downArrow.jpg" alt="Desc" width="15px" height="15px"></img>
            :
            <span/>
        }
        </>
        
    )
}
SortByHeader.propTypes={
    value:PropTypes.string.isRequired,
    sortStatus:PropTypes.number.isRequired,
    onClick:PropTypes.func.isRequired
}
export default SortByHeader;