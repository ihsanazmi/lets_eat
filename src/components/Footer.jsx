import React, { Component } from 'react'
import zomato from '../img/zomato.png'

class Footer extends Component {
    render() {
        return (
            <div className="h-100" style={{backgroundColor:'#E23744'}}>
                <div className="container p-1">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-column">
                            <p className="mb-0 text-white">Copyright 2019 <b>M. Ihsan Azmi</b>. All Rights Reserved</p>
                            <a className="text-decoration-none text-white" rel="noopener noreferrer" href="https://github.com/ihsanazmi" target="_blank" ><i className="fab fa-github"></i> ihsanazmi</a>
                        </div>
                        <div>
                            <a href="https://www.zomato.com/bandung" target="_blank" rel="noopener noreferrer">
                                <img style={{width:64, height:64}} src={zomato} alt="img"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer
