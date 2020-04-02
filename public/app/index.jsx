import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Test extends React.Component {
    render() {
        return <h1>Hello, React</h1>;
    }
}

ReactDOM.render(
    <Test></Test>,
    document.getElementById("app")
)