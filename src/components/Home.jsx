import React, { Component } from 'react'
import axios from '../config/axios'
import {Spinner} from 'reactstrap'
import {Link} from 'react-router-dom'
import key from '../config/userkey'
import {Helmet} from 'react-helmet'
import {initGA, logPageView, logEvent} from '../config/analytics'
import Footer from './Footer'

class Home extends Component {

    state = {
        collections: null,
        keywords: ''
    }

    componentDidMount(){
        document.title = 'Lets Eat'
        this.getCollections()
        initGA()
        logPageView()
    }

    getCollections = ()=>{
        axios.get(`/collections?city_id=11052&count=6`,
        {
            headers: {'user-key': key}
        })
        
        .then(res=>{
            this.setState({collections: res.data.collections})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    search = ()=>{
        let keyword = this.searchKeyword.value
        this.setState({
            keywords: keyword
        })
    }

    renderCollection = ()=>{
        let data = this.state.collections.map(val=>{
            return(
                <Link className="text-decoration-none" key ={val.collection.collection_id} to={`/collection/${val.collection.collection_id}`}>
                    <div  className="col mb-4 animated fadeIn" style={{cursor:'pointer'}}>
                        <div className="card h-100">
                            <div className="row no-gutters h-100">
                                <div className="col-4">
                                    <img src={val.collection.image_url} className="card-img h-100" alt="..."/>
                                </div>
                                <div className="col-8">
                                    <div className="card-body">
                                        <h5 className="card-title mb-1 font-weight-bold" style={{fontSize:'17px', color:'black'}}>{val.collection.title}</h5>
                                        <p className="card-text module" style={{fontSize:'14px', color:'black'}}>{val.collection.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        })
        return data
    }

    render() {
        if(this.state.collections === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '30vh'}} />
        }
        return (
            <div >
                <Helmet>
                    <title>{document.title}</title>
                    <meta
                        name="description"
                        content="Find Out Restauran in Bandung"
                    />
                </Helmet>
                <div className="d-flex flex-column justify-content-center align-items-center" style={{height:'50vh', backgroundColor:'#E23744', color: 'white'}}>
                    <div className="p-4">
                        <div className="d-flex flex-column">
                            <h1 className="display-4 mb-0">Let's Eat</h1>
                            <p className="blockquote-footer text-white mt-0">Powered by Zomato API</p>
                        </div>
                        <p className="lead">Find the best restaurants, cafés, and bars in Bandung</p>
                        <div className="d-flex flex-row">
                            <input className="form-control" type="text" placeholder="Search for restaurants..." ref={(input)=>{this.searchKeyword = input}} onChange={this.search}/>
                            <Link to={this.state.keywords.length > 2 ? `/restaurant?q=${this.state.keywords}` : `/restaurant`}>
                                <button onClick={()=>{logEvent('home', 'search', this.state.keywords )}} className="btn btn-outline-light ml-3">Search</button>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="container">
                    <h4 className="mt-3 mb-0">Collections</h4>
                    <p className="text-muted">Explore curated lists of top restaurants, cafes, pubs, and bars in Bandung, based on trends</p>
                    <div className="row row-cols-1 row-cols-lg-3">
                        {this.renderCollection()}
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Home
