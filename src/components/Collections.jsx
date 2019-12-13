import React, { Component } from 'react'
import axios from '../config/axios'
import key from '../config/userkey'
import {Spinner} from 'reactstrap'
import Header from './Header'
import { initGA, logPageView } from '../config/analytics'
import {Helmet} from 'react-helmet'

let entity_id = 11052

class Collections extends Component {

    state = {
        collections : null,
        image_url: '',
        title: '',
        description: '',
        total_collection: 0,

    }

    componentDidMount(){
        document.title = 'Collection'
        this.getCollection()
        this.getAllCollection()
        initGA()
        logPageView()
    }

    getCollection = ()=>{
        // console.log(this.props)
        let collection_id = this.props.match.params.collection_id
        axios.get(`/search?entity_id=${entity_id}&entity_type=city&collection_id=${collection_id}`,
        {
            headers: {'user-key': key}
        })
        .then(res=>{
            this.setState({
                collections: res.data.restaurants,
                total_collection: res.data.restaurants.length
            })
            // console.log(res.data.restaurants)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getAllCollection = ()=>{
        let collection_id = parseInt(this.props.match.params.collection_id)
        axios.get(`/collections?city_id=11052&count=6`,
        {
            headers: {'user-key': key}
        })
        .then(res=>{
            let filter = res.data.collections.filter(val=>{
                return val.collection.collection_id === collection_id
            })
            this.setState({
                image_url: filter[0].collection.image_url,
                title: filter[0].collection.title,
                description: filter[0].collection.description,
            })
            // document.title = filter[0].collection.title
        })
        .catch(err=>{
            console.log(err)
        })
    }

    renderPlace = ()=>{
        let data = this.state.collections.map(val=>{
            return(
                <div key={val.restaurant.id} className="col mb-4">
                    <div className="card h-100">
                    <img src={val.restaurant.thumb} className="h-50" alt="..."/>
                    <div className="card-body">
                        <div className="d-flex flex-row">
                            <h5 className="card-title mb-0 py-2">{val.restaurant.name}</h5>
                            <h5 className="ml-auto border rounded p-2 align-self-center" style={{backgroundColor:`#${val.restaurant.user_rating.rating_color}`}}>{val.restaurant.user_rating.aggregate_rating}</h5>
                        </div>
                        <p className="card-text text-muted mb-0">{val.restaurant.location.locality_verbose}</p>
                        <p className="card-text mb-0 text-muted">{val.restaurant.cuisines}</p>
                    </div>
                    </div>
                </div>
            )
        })
        return data
    }

    render() {
        if(this.state.collections === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        return (
            <div>
                <Helmet>
                    {/* {console.log(document.title)} */}
                    <title>{document.title} | Lets Eat</title>
                    <meta
                        name="description"
                        content={this.state.description}
                    />
                    <html/>
                </Helmet>
                <Header/>
                <div className="container mt-3">
                    
                    <div className="border rounded" style={{backgroundColor:'white'}}>
                        <div className="hero-img" style={{backgroundImage: `url(${this.state.image_url})`}}/>
                        <div className="p-3">
                            <h4 className="mb-0">{this.state.title}</h4>
                            <p className="mb-0 lead">{this.state.description} </p>
                            <p className="mb-5 text-muted">{this.state.total_collection} Places</p>
                        </div>
                    </div>

                    <div className="mt-3">
                        
                        <div className="row row-cols-1 row-cols-md-3">
                            {this.renderPlace()}
                        </div>

                    </div>
                                    
                </div>
            </div>
        )
    }
}

export default Collections
