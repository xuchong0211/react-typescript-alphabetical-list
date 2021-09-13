import React, {useMemo} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import AlphabetList from "./lib/alphabet/AlphabetList";
import AlphabetList from "./lib/index";
import {getPersons} from "./data/data";


export const SampleItem = ({ item }: { item?: AnyObject }) => {
    return (
        <div className="item">
            <div>{item?.data.name}</div>
            <div>{item?.data.phone}</div>
        </div>
    );
};


function Exmaple() {
    const person = useMemo(() => {
        const options = getPersons();
        return options;
    }, ["en"]);
    // const c =  (props: { item: DataType }) =>  <SampleItem {...props}/>;
    const c =  <SampleItem />;
    return <AlphabetList data={person} indexTopOffset={30}>
        <SampleItem/>
    </AlphabetList>
}

ReactDOM.render(
  <React.StrictMode>
      <Exmaple/>
  </React.StrictMode>,
  document.getElementById('root')
)
