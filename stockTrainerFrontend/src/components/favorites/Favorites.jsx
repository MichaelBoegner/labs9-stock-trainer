import React from "react";
import { Input, Segment, Header, List } from "semantic-ui-react";
import axios from "axios";
import Stock from "../stock/Stock";

import "./Favorites.css";

const iexURL = "https://api.iextrading.com/1.0/stock/market/batch?symbols=";

class Favorites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLastItem: 14,
      items: props.data.slice(0, 14),
      showLoad: false,
      searchText: "",
      filteredList: props.data,
      currentData: {}
    };
  }

  componentDidMount() {
    this.getStockData();
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    const { currentLastItem } = this.props;
    if (nextProps.data !== data) {
      this.setState(
        {
          filteredList: nextProps.data,
          items: nextProps.data.slice(0, currentLastItem)
        },
        this.getStockData()
      );
    }
  }

  // big problem here is people with very vertical screens. this only triggers on scroll. Need to find a way to trigger if there's no overflow too.
  handleScroll = e => {
    const { currentLastItem, items, filteredList } = this.state;
    // This is a very goofy way to make it so you don't have to scroll to very bottom to make this work
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - 50 <= e.target.clientHeight;
    if (bottom && filteredList.length !== items.length) {
      this.setState(
        { showLoad: true, currentLastItem: currentLastItem + 10 },
        () => {
          this.setState(
            {
              items: filteredList.slice(0, currentLastItem),
              showLoad: false
            },
            () => this.getStockData()
          );
        }
      );
    }
  };

  handleChange = event => {
    const { data } = this.props;

    this.setState(
      {
        searchText: event.target.value,
        filteredList: data.filter(e => {
          if (
            e.name.toUpperCase().includes(event.target.value.toUpperCase()) ||
            e.symbol.toUpperCase().includes(event.target.value.toUpperCase())
          ) {
            return e;
          }
          // eslint-disable-next-line
          return;
        })
      },
      () => {
        const { filteredList, currentLastItem } = this.state;
        this.setState(
          {
            items: filteredList.slice(0, currentLastItem)
          },
          this.getStockData()
        );
      }
    );
  };

  getStockData = () => {
    const { items } = this.state;
    if (items.length < 1) {
      return;
    }
    const stockArray = [];
    items.forEach(item => stockArray.push(item.symbol));
    const symbolString = stockArray.join(",");
    axios
      .get(`${iexURL}${symbolString}&types=quote`)
      .then(res => {
        this.setState({ currentData: res.data });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { title, favorites, favoriteToggle } = this.props;
    const { items, showLoad, searchText, currentData } = this.state;
    return (
      <div className="favoritesHolder">
        <Header attached="top">
          <h2>{title}</h2>
          <Input
            placeholder="Search for stock"
            value={searchText}
            onChange={this.handleChange}
            fluid
          />
        </Header>

        <Segment
          className="favoritesDisplay"
          onScroll={this.handleScroll}
          attached
        >
          <List className="helpSearch" divided>
            {items.map(e => (
              <List.Item key={`${e.symbol}${e.name}`} className="favoritesItem">
                <Stock
                  favoriteToggle={favoriteToggle}
                  favorites={favorites}
                  symbol={e.symbol}
                  name={e.name}
                  info={currentData[e.symbol]}
                />
              </List.Item>
            ))}
            {showLoad ? (
              <List.Item>
                <h3>Loading...</h3>
              </List.Item>
            ) : (
              ""
            )}
            {items.length === 0 ? (
              <List.Item>
                <h3>No Results Found</h3>
              </List.Item>
            ) : (
              ""
            )}
          </List>
        </Segment>
      </div>
    );
  }
}

export default Favorites;
