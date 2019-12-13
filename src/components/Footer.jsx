import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return (
            <div className="h-100" style={{backgroundColor:'#E23744'}}>
                <div className="container p-1">
                    <p className="mb-0 text-white">Copyright 2019 <b>M. Ihsan Azmi</b>. All Rights Reserved</p>
                    <a className="text-decoration-none text-white" rel="noopener noreferrer" href="https://github.com/ihsanazmi" target="_blank" ><i className="fab fa-github"></i> ihsanazmi</a>
                </div>
            </div>
        )
    }
}

export default Footer
