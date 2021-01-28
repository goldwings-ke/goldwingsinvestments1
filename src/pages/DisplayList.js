import React from 'react';

function DisplayList(props) {
  const arr = props.contacts;
  const listItems = arr.map((val, index) =>
    <li key={index}>{val}</li>
  );
  return <ul>{listItems}</ul>;
}



export default PeopleList