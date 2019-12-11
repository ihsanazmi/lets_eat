import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {Navbar} from 'reactstrap';

class Header extends Component {

    state={
        isOpen: false,
    }

    toggle = ()=>{
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }

    render() {
        return (
            <div>
                <Navbar style={{boxShadow:"0 4px 6px -1px rgba(0,0,0,0.07)", backgroundColor:'#E23744'}} light expand= "md">
                    <Link to="/" className="navbar-brand text-white">Let's Eat</Link>
                    <div className="mx-auto d-flex flex-row">
                        <input className="form-control-sm" type="text" placeholder="Search..."/>
                        <button className="btn btn-sm btn-outline-light ml-2">Search</button>
                    </div>
                </Navbar>
            </div>
        )
    }
}

export default Header
