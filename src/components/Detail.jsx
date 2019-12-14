import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import axios from '../config/axios'
import key from '../config/userkey'
import {Spinner} from 'reactstrap'
import ModalImage from "react-modal-image"
import { logPageView, initGA } from '../config/analytics'
import {Helmet} from 'react-helmet'

class Detail extends Component {

    state = {
        restaurant: null,
        photos: [],
        highlights: [],
        reviews: null,
        name: '',
        start: 0, 
        count:5
    }

    componentDidMount(){
        let res_id = this.props.match.params.res_id
        this.getData(res_id)
        this.getReviews(res_id)
    }
    
    getData = (res_id)=>{
        axios.get(`/restaurant?res_id=${res_id}`, {headers:{'user-key': key}})
        .then(res=>{
            document.title = `${res.data.name} | Lets Eat`
            this.setState({
                restaurant: res.data,
                photos:res.data.photos,
                name: res.data.name,
                highlights: res.data.highlights
            })
            initGA()
            logPageView()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getReviews = (res_id)=>{
        axios.get(`/reviews?res_id=${res_id}&start=${this.state.start}&count=${this.state.count}`, {headers:{'user-key': key}})
        .then(res=>{
            this.setState({reviews: res.data.user_reviews})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    moreReview = ()=>{
        let res_id = this.props.match.params.res_id
        let count = parseInt(this.state.count) + 5
        this.setState({count})
        axios.get(`/reviews?res_id=${res_id}&start=${this.state.start}&count=${count}`, {headers:{'user-key': key}})
        .then(res=>{
            this.setState({
                reviews: res.data.user_reviews
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    renderList = ()=>{
        let data = this.state.highlights.map(val=>{
            return(
                <li key={val}>{val}</li>
            )
        })
        return data
    }
    
    renderPhoto = ()=>{
        let data = this.state.photos.map(val=>{
            return(
                <div key={val.photo.id} className="justify-content-center py-1 mx-auto">
                    <ModalImage className="img-thumbnail"
                        small={val.photo.thumb_url}
                        large={val.photo.url}
                        alt="img"
                    />
                </div>
            )
        })
        return data
    }

    renderReview = ()=>{
        let data = this.state.reviews.map(val=>{
            return(
                <div className="animated fadeIn" key={val.review.id}>
                    <div className="container">
                        <div className="d-flex flex-row">
                            <img className="rounded-circle" style={{width:64}} src={val.review.user.profile_image} alt="user"/>
                            <div className="d-flex flex-column ml-2">
                                <p className="font-weight-bold mb-0">{val.review.user.name}</p>
                                <a className="text-decoration-none align-self-start" href={val.review.user.profile_url} target="_blank" rel="noopener noreferrer">
                                <button className="btn btn-outline-dark btn-sm">See Profile</button>
                                </a>
                            </div>
                        </div>
                        <p>{val.review.review_time_friendly}</p>
                        <p className="lead"><span className="font-weight-bold">Rated </span><span className="rounded px-2" style={{backgroundColor:`#${val.review.rating_color}`, color:'white'}}>{val.review.rating}</span>{` ${val.review.review_text}`}</p>
                    </div>
                    <hr/>
                </div>
            )
        })
        return data
    }

    render() {
        if(this.state.restaurant === null || this.state.reviews === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        let {name, location, user_rating, phone_numbers, cuisines, average_cost_for_two, timings, featured_image, establishment, photos_url } = this.state.restaurant
        return (
            <div>
                <Helmet>
                    <title>{document.title} | Lets Eat</title>
                    <meta
                        name="description"
                        content={`${name} located in ${location.address}. Cuisines is ${cuisines}. Opening Hours at ${timings} `}
                    />
                </Helmet>
                <Header/>
                <div className="container mt-3 mb-5">
                    <div className="rounded-top animated fadeIn" style={{backgroundImage: `url(${featured_image})`, backgroundSize:'cover', backgroundPosition:'center', height:'50vh'}}>
                    </div>
                    
                    <div className="d-flex flex-md-row flex-column justify-content-between px-5 pt-3 container rounded-bottom" style={{backgroundColor:'white'}}>
                        <div className="d-flex flex-column align-items-center">
                            <h1 className="text-center text-md-right">{name}</h1>
                            <p>{location.locality}<span> . </span>{establishment[0]}</p>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <h1 className="rounded px-2 py-1 text-white" style={{backgroundColor:`#${user_rating.rating_color}`}}>{`${user_rating.aggregate_rating} `}<span className="text-muted">/ 5</span></h1>
                            <p className="text-muted">{user_rating.votes} votes</p>
                        </div>
                    </div>

                    <div className="container rounded px-5 pt-3 mt-4 d-flex flex-md-row flex-column justify-content-between overview" style={{backgroundColor:'white'}}>
                        <div>
                            <h5>Phone Number</h5>
                            <p className="text-success font-weight-bold">{phone_numbers}</p>
                            <h5>Cuisines</h5>
                            <p>{cuisines}</p>
                            <h5>Average Cost</h5>
                            <p>Rp.{Intl.NumberFormat().format(average_cost_for_two).replace(/,/g, '.')} for two people</p>
                        </div>
                        <div>
                            <h5>Opening Hours</h5>
                            <p>{timings}</p>
                            <h5>Address</h5>
                            <p>{location.address}</p>
                        </div>
                        <div>
                            <h5>More Info</h5>
                            <ul className="list-unstyled">
                                {this.renderList()}
                            </ul>
                        </div>
                    </div>

                    <div className="container rounded pt-3 pb-3 mt-4" style={{backgroundColor:'white'}}>
                        <h3>Photos</h3>
                        <div className="d-flex flex-row justify-content-between align-items-center flex-wrap">
                            {this.renderPhoto()}
                        </div>
                        <a className="text-decoration-none" href={photos_url} target="_blank" rel="noopener noreferrer">
                            <button className="btn btn-outline-danger btn-block mt-3">See More Photo</button>
                        </a>
                    </div>

                    <div className="container mt-3 pt-3 pb-3 rounded" style={{backgroundColor:'white'}}>
                        <h3>Reviews</h3>
                        <hr/>
                        {this.renderReview()}
                        <button onClick={this.moreReview} className="btn btn-light btn-block pb-3">More Review</button>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Detail
