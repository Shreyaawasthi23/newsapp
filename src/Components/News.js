//rce-->format we use
import React, { Component } from 'react'
import Newsitem from './Newsitem';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general',
    }
    static propsTypes = {
        name: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    capitalizeFirstLetter = (string)=> {
        return string.charAt(0).toUpperCase() +string.slice(1);
    }
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults:0
        }
        document.title=`${this.capitalizeFirstLetter(this.props.category)}-NewsUpdates`;
    }

    async componentDidMount() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&category=${this.props.category}&category=${this.props.category}&apiKey=411e1699c2274b0abaf0f985ec78c72f&page=1&pageSize=${this.props.pageSize}`
        let data = await fetch(url);
        this.props.setProgress(10);
        console.log(data);
        let parsedData = await data.json()
        this.props.setProgress(70);
        console.log(parsedData);
        this.setState({ articles: parsedData.articles, totalresultss: parsedData.totalResults})
        this.props.setProgress(100);
        
    }
    
    fetchMoreData = async () => {

        const nextPage = this.state.page + 1;
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=411e1699c2274b0abaf0f985ec78c72f&page=${nextPage}&pageSize=${this.props.pageSize}`;
        
        this.setState({ loading: true });
        
        try {
            let data = await fetch(url);
            let parsedData = await data.json()
            this.setState((prevState) => ({
                articles: prevState.articles.concat(parsedData.articles),
                totalResults: parsedData.totalResults,
                loading: false,
                page: nextPage,
            }));
        } catch (error) {
            console.error("Error fetching more data:", error);
            this.setState({ loading: false });
        }
        
    };
    
          render() {
        return (
            <div className='container my-3'>
                <h2 className='text-center'>NewsUpdates- Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
                <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !==this.state.totalResults}
          loader={<h4>Loading...</h4>}
        >
                <div className='row'>
                  
                    {this.state.articles.map((element) => {
                        return <div className='col-md-4' key={element.url}>
                            <Newsitem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt}
                            source={element.source.name}/>

                        </div>
            
                    })}
                    
                </div>
                
                </InfiniteScroll>
                {/*<div className='container d-flex justify-content-between'>
                    <button type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr; Previous</button>
                    <button disabled={(this.state.page + 1 > Math.ceil(this.state.totalResults / 20))} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>

                </div>*/}
                </div>

        )
    }
}
export default News
