import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from '../components/Home'
import Collection from '../components/Collections'
import Restaurant from '../components/Restaurant'
import NotFound from '../components/NotFound'
class App extends Component {

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component ={Home}/>
                        <Route path="/collection/:collection_id" component={Collection}/>
                        <Route path = "/restaurant" component={Restaurant}/>
                        <Route path="*" component = {NotFound}/>
                    </Switch>
                    {/* <Footer/> */}
                </BrowserRouter>
            </div>
        )
    }
}

export default App
