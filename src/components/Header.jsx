import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {Navbar} from 'reactstrap';
import Swal from 'sweetalert2'
import { logEvent } from '../config/analytics';

class Header extends Component {

    state={
        isOpen: false,
        keyword: ''
    }

    toggle = ()=>{
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }

    handleChange = ()=>{
        let keyword = this.searchInput.value
        this.setState({keyword})
    }

    search = ()=>{
        let keyword = this.searchInput.value
        if(keyword.length <=2){
            this.searchInput.value =''
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Isi keyword lebih dari 2 huruf',
                    showConfirmButton: false,
                    timer: 1000
                })
                )
            }
            
        if(keyword){
            // logEvent('header', 'search', this.state.keyword)
            // console.log('s')
            let host = window.location.origin
            window.location.href = `${host}/restaurant?q=${keyword}`
        }else{
            window.location.pathname = '/restaurant'
        }
    }
    
    render() {
        return (
            <div>
                <Navbar style={{boxShadow:"0 4px 6px -1px rgba(0,0,0,0.07)", backgroundColor:'#E23744'}} light expand= "md">
                    <Link to="/" className="navbar-brand text-white">Let's Eat</Link>
                    <div className="mx-auto d-flex flex-row">
                        <input onChange={this.handleChange} ref={(input)=>{this.searchInput = input}} className="form-control-sm" type="text" placeholder="Search..."/>
                        <button onClick={
                            ()=>{
                                logEvent('header', 'search', this.state.keyword) 
                                this.search()
                                }
                            } 
                            className="btn btn-sm btn-outline-light ml-2">Search</button>
                    </div>
                </Navbar>
            </div>
        )
    }
}

export default Header
