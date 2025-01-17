import React, { Component } from 'react'
import axios from '../config/axios'
import key from '../config/userkey'
import {Paginator} from 'primereact/paginator'
import queryString from 'query-string'
import {Spinner} from 'reactstrap'
import {Helmet} from 'react-helmet'
import Footer from './Footer'
import Swal from 'sweetalert2'
import Header from './Header'
import {Link} from 'react-router-dom'
import { initGA, logPageView, logEvent } from '../config/analytics'

class Restaurant extends Component {

    state = {
        first: 0,
        rows: 20,
        lastIndex: 20,
        totalRecords: 0,
        restaurants: null,
        keyword: '',
        sortBy: 1,
        intervalId: 0,
        location: 'Bandung',
        latitude: '',
        longitude: '',
        entity_id: '11052',
        entity_type: 'city'
    }

    componentDidMount(){
        document.title = 'Restaurant'
        if(this.props.location.state !== undefined){
            let {latitude, longitude} = this.props.location.state
            const values = queryString.parse(this.props.location.search)
            let keyword = values.q
            axios.get(`/geocode?lat=${latitude}&lon=${longitude}`, {headers:{'user-key': key}})
            .then(res=>{
                initGA()
                logPageView()
                let {entity_id, entity_type, latitude, longitude, title} = res.data.location
                this.setState({location: title, latitude, longitude, entity_id, entity_type})
                this.getRestaurants(this.state.first, this.state.lastIndex, keyword, this.state.sortBy, entity_id, entity_type, latitude, longitude)
            })
        }else{
            initGA()
            logPageView()
            const values = queryString.parse(this.props.location.search)
            let keyword = values.q
            this.setState({keyword})
            this.getRestaurants(this.state.first, this.state.lastIndex, keyword, this.state.sortBy, this.state.entity_id, this.state.entity_type)
        }
    }

    getRestaurants = (first, last, query, sort, entity_id ,entity_type, latitude, longitude)=>{
        let keyword = query
        if(keyword === undefined || keyword === ''){
            keyword = ''
        }
        let sortby
        let order
        if(sort === 1){
            sortby = ''
            order = ''            
        }else if(sort === 2){
            sortby = 'rating'
            order = 'desc'
        }else if(sort === 3){
            sortby = 'cost'
            order = 'desc'
        }else if(sort === 4){
            sortby = 'cost'
            order = 'asc'
        }

        axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=${entity_id}&entity_type=${entity_type}&q=${keyword}&start=${first}&count=${last}&lat=${latitude}&lon=${longitude}&sort=${sortby}&order=${order}`, 
        {
            headers: {'user-key': key}
        })
        .then(res=>{
            let total
            if(res.data.results_found > 100){
                total = 100
            }else{
                total = res.data.results_found
            }
            this.setState({restaurants:res.data.restaurants, totalRecords:total})
            // console.log(res.data)
        })
        .catch(err=>{console.log(err)})
    }

    onPageChange(event) {
        this.setState({
            first: event.first,
            rows: event.rows,
            lastIndex: event.first + event.rows
        });
        let first = event.first
        let lastIndex=  event.first + event.rows
        window.scroll(0,0)

        this.getRestaurants(first, lastIndex, this.state.keyword, this.state.sortBy, this.state.entity_id, this.state.entity_type, this.state.latitude, this.state.longitude)
    }

    removeQuery = ()=>{
        let keyword = ''
        let first = 0
        let lastIndex = 20
        let sortBy = 1
        let entity_id = 11052
        let entity_type = 'city'
        let latitude = ''
        let longitude = ''
        let location = 'Bandung'
        window.location.search = ''
        this.setState({keyword: '', first:0, lastIndex:20, rows:20, sortBy:1, entity_id, entity_type, latitude, longitude, location})
        this.getRestaurants(first, lastIndex, keyword, sortBy, entity_id, entity_type, latitude, longitude )
    }

    sortRestaurant = (val)=>{
        let first = 0
        let lastIndex = 20
        let sort = val
        this.setState({sortBy: val, first, lastIndex, rows:20})
        this.getRestaurants(first, lastIndex,this.state.keyword, sort, this.state.entity_id, this.state.entity_type, this.state.latitude, this.state.longitude)
    }

    seeAll = ()=>{
        window.location.search = ''
    }

    seePhone = (phone)=>{
        Swal.fire({
            title: `<i class="fas fa-phone"> ${phone}</i>`,
            showClass: {
              popup: 'animated fadeIn'
            },
            hideClass: {
              popup: 'animated fadeOut'
            }
          })
    }

    renderData = ()=>{
        if(this.state.restaurants.length === 0){
            return(
                <center>
                    <h1 className="display-4 text-center">Result for "{this.state.keyword}" Not Found</h1>
                    <button onClick={this.seeAll} className="btn btn-outline-danger my-5">See All Restaurant in Bandung</button>
                </center>
            )
        }
        let renderRestaurant = this.state.restaurants.map(val=>{
            return(
                <div onClick={logEvent('Detail', 'View Restaurant', val.restaurant.name)} key={val.restaurant.id} className="border rounded p-3 mb-1 animated fadeIn" style={{backgroundColor:'white'}}>
                    <div className="d-flex flex-lg-row flex-column align-items-center mb-0">
                        <img className="rounded" style={{width:150, height:150}} src={val.restaurant.thumb} alt="..."/>
                        <Link className="text-decoration-none" to={`/detail/${val.restaurant.id}`}>
                        <div className="d-flex flex-column ml-3 text-center text-lg-left justify-content-center" style={{maxWidth:'300px'}}>
                            <p className="text-muted mb-0">{val.restaurant.establishment[0]}</p>
                            <h4 className="text-danger mb-0">{val.restaurant.name}</h4>
                            <p className="text-dark font-weight-bold mb-0">{val.restaurant.location.locality}</p>
                            <p className="text-muted text-truncate">{val.restaurant.location.address}</p>
                        </div>
                        </Link>
                        <div className="d-flex flex-column ml-lg-auto justify-content-start align-items-center mb-0">
                            <p className="px-2 py-1 rounded text-white mb-0" style={{backgroundColor:`#${val.restaurant.user_rating.rating_color}`}}>{val.restaurant.user_rating.aggregate_rating}</p>
                            <p className="text-muted mb-0">{val.restaurant.user_rating.votes} votes</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <p className ="my-0" >CUISINES:</p>
                            <p className ="my-0" >COST FOR TWO:</p>
                            <p className ="my-0" >HOURS:</p>
                        </div>
                        <div className="d-flex flex-column ml-lg-5 ml-auto">
                            <p className ="my-0" >{val.restaurant.cuisines}</p>
                            <p className ="my-0" >Rp.{Intl.NumberFormat().format(val.restaurant.average_cost_for_two).replace(/,/g, '.')}</p>
                            <p className ="my-0" >{val.restaurant.timings}</p>
                        </div>
                    </div>
                    <button onClick={()=>{
                        this.seePhone(val.restaurant.phone_numbers)
                        logEvent('Phone Number', 'See Phone Number', val.restaurant.name)}} 
                        className="btn btn-block btn-success mt-3">Call</button>
                </div>
            )
        })
        return renderRestaurant
    }

    render() {
        if(this.state.restaurants === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        return (
            <div>
                <Helmet>
                    <title>{document.title} | Lets Eat</title>
                    <meta
                        name="description"
                        content="Search all restaurant in Bandung"
                    />
                </Helmet>
                <Header/>
                <div className="container mt-3">
                    <h3 className="mb-3">{this.state.location} Restaurants</h3>
                    {this.state.keyword ? <p>Matching in "{this.state.keyword}"</p> : ''}
                    <div className="row">
                        <div className="col-12 col-md-3 mb-3">
                            <div className="border rounded p-2" style={{backgroundColor:'white'}}>
                                <h5 className="font-weight-bold">Filter</h5>
                                <div className="d-flex flex-row" >
                                    <p style={{display: this.state.latitude ? '': 'none'}}>Nearby "<span style={{color:'#099E44'}}>{this.state.location}</span>"</p>
                                    <p onClick={this.removeQuery} style={{display: this.state.latitude ? '': 'none', cursor:'pointer'}}>remove</p>
                                </div>
                                <h6 className="font-weight-bold" style={{display:!this.state.keyword?'none':''}}>Keyword</h6>
                                <div className="d-flex flex-row">
                                    <p style={{color:'#099E44', display:!this.state.keyword?'none':''}}>"{this.state.keyword}"</p> 
                                    <p onClick={this.removeQuery} style={{display:!this.state.keyword?'none':'', cursor:'pointer'}}>remove</p>
                                </div>
                                <h6 className="font-weight-bold">Sort By</h6>
                                <p onClick={()=>{this.sortRestaurant(1) 
                                            logEvent('Sort', 'Popularity', 'high to low')}} 
                                    className="mb-0" 
                                    style={{color:this.state.sortBy === 1 ? '#099E44': 'black', cursor:'pointer'}}>Popularity - 
                                    <span className="text-muted">high to low</span>
                                </p>
                                <p onClick={()=>{this.sortRestaurant(2)
                                            logEvent('Sort', 'Rating', 'high to low')}} 
                                    className="mb-0" style={{color:this.state.sortBy === 2 ? '#099E44': 'black', cursor: 'pointer'}}>Rating <span className="text-muted">high to low</span></p>
                                <p onClick={()=>{this.sortRestaurant(3)
                                            logEvent('Sort', 'Cost', 'high to low')}} 
                                    className="mb-0" style={{color:this.state.sortBy === 3 ? '#099E44': 'black', cursor: 'pointer'}}>Cost <span className="text-muted">high to low</span></p>
                                <p onClick={()=>{this.sortRestaurant(4)
                                            logEvent('Sort', 'Cost', 'low to high')}} 
                                    className="mb-0" style={{color:this.state.sortBy === 4 ? '#099E44': 'black', cursor: 'pointer'}}>Cost <span className="text-muted">low to high</span></p>
                                
                            </div>
                        </div>
                        <div className="col-12 col-md-9 mb-5">
                            {this.renderData()}
                            <Paginator style={{backgroundColor:'white'}} first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords}onPageChange={(e)=>{this.onPageChange(e)}}></Paginator>
                        </div>
                    </div>
                </div> 
                <Footer/>
            </div>
        )
    }
}

export default Restaurant
