import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import './index.css';
import buildings from './data';

const root = ReactDOM.createRoot(document.getElementById('root')); 

function Content() { 
  return( 
    <> 
      <h3>Самые высокие здания и сооружения</h3>
      <Table data={ buildings } pageSize="10" paginating="1"/>
    </>  
  ) 
} 

root.render(<Content />) 


const Table = (props) => {
  const [activePage, setActivePage] = React.useState("1");

  const changeActive = (event) => { 
    setActivePage(event.target.innerHTML);
  };

  const page_class = (index, active) => {
    const chosen = (index + 1 == active) ? "active" : "inacti";
    return chosen
  }
  
  const get_pages = (props) => {
    const page_count = Math.ceil(props.data.length / props.pageSize);  
    const page_numbers = Array.from({ length: page_count }, (v, i) => i + 1); 
    const pages = page_numbers.map((item, index) => <span onClick = { changeActive } className={ page_class(index, activePage) }> { item } </span> );

    return pages
  }

  if (props.paginating == "0") {
    return (
      <>
        <table>
          <TableHead columns={ Object.keys(props.data[0]) } isHead="1" />
          <TableBody body={ props.data }  pageSize={ props.data.length } numPage="1" />
        </table>
      </>
    )
  } else {
    return (
      <>
        <table>
          <TableHead columns={ Object.keys(props.data[0]) } isHead="1" />
          <TableBody body={ props.data }  pageSize={ props.pageSize } numPage={ activePage }/>
        </table>
        <div>
          { get_pages(props) }
        </div>
      </>
    )
  }
}

const TableHead = (props) => {      
  return (         
    <thead>             
      <tr>                    
        <TableRow row={ props.columns } isHead="1"/>             
      </tr>         
    </thead> 
  )
}

const TableBody = (props) => {  
  const row_class = (index) => {
    const begRange = (Number(props.numPage) - 1) * Number(props.pageSize); 
    const endRange = begRange + Number(props.pageSize);

    const chosen = (index >= begRange && index < endRange) ? "show" : "hide";
    return chosen
  }

  const body = props.body.map((item, index) =>           
    <tr key={ index } className={ row_class(index) }>                             
      <TableRow row={ Object.values(item) } isHead="0"/>             
    </tr>
  );

  return (         
    <tbody>             
      { body }         
    </tbody>     
  ) 
}

const TableRow = (props) => { 
  const cells = (props.isHead == "0")
    ? props.row.map((item, index) => <td key={ index }> {item} </td>) 
    : props.row.map((item, index) => <th key={ index }> {item} </th>);

  return( 
    <>  
      { cells }  
    </> 
  ) 
}