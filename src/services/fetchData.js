export const fetchData=()=>{
    let payload = {
        token: "YdjoBRYJCXqp9rhZnBe8Wg",
        data: {
          "Date": "date",
          "Region": "addressState",
          "Rep": "nameFirst",
          "Item":"productName",
          "Units":"numberInt|5,10",
          "Cost":"numberFloat|1,5|2",
          "Total":"numberFloat|10,500|2",
          "_repeat": 10
        }
    };
    const requestUrl="https://app.fakejson.com/q"
    return new Promise((resolve,reject)=>{
        const headers=new Headers({
            "Content-Type":"application/json",
        });
        const requestConfig={
            headers,
            mode:"cors",
            method:"POST",
            body:JSON.stringify(payload),
        };
        fetch(requestUrl,requestConfig)
        .then(response=>response.json())
        .then(data=>{
            resolve(data);
            console.log(data)
        })
        .catch(error=>{
            reject(error);
        });
    });    
};
