import React from "react";
import { Button, Input, Tab, Segment } from "semantic-ui-react";
import "./Reports.css";
import Autosuggest from "react-autosuggest";
import stockSymbolList from "../../util/test.json";

import Stock from "../stock/Stock";

const today = new Date().toISOString().substr(0, 10);
const theme = {
  container: {
    height: "90%",
    fontSize: "24px"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: "4",
    overflow: "auto",
    boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
    border: "1px solid rgba(34,36,38,.15)",
    overflowY: "auto",
    maxHeight: "600%",
    left: "0",
    right: "0"
    // width: "calc(60% - 6rem)"
  },
  suggestionsList: {
    zIndex: "4",
    paddingLeft: "0",
    marginTop: ".6rem"
  },
  suggestion: {
    cursor: "pointer",
    padding: "10px 20px",
    listStyleType: "none",
    lineHeight: "1.2em",
    borderTop: "1px solid rgba(34,36,38,.15)"
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd"
  },
  input: {
    maxWidth: "100%",
    width: "100%",
    border: "1px solid rgba(34,36,38,.15)",
    color: "rgba(0,0,0,.87)",
    height: "100%",
    margin: "0"
  },
  suggestionFirst: {
    border: "0"
  }
};

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : stockSymbolList.filter(
        lang =>
          lang.name.toLowerCase().slice(0, inputLength) === inputValue ||
          lang.symbol.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
// this will be the main function to allow suggestion -> symbol link
const getSuggestionValue = suggestion => suggestion.symbol;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name} - <strong>{suggestion.symbol}</strong>
  </div>
);
const placeholderPane = (
  <Segment className="chartArea">
    <Tab.Pane>Placeholder image</Tab.Pane>
  </Segment>
);
const panes = [
  {
    menuItem: "Price",
    render: () => placeholderPane
  },
  {
    menuItem: "Average True Range",
    render: () => placeholderPane
  },
  {
    menuItem: "Volumn Weighted Average",
    render: () => placeholderPane
  },
  {
    menuItem: "Moving Average Convergence",
    render: () => placeholderPane
  },
  {
    menuItem: "Moving Average",
    render: () => placeholderPane
  }
];

export default class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      suggestions: [],
      startDate: today,
      endDate: today,
      stockName: "Enter Stock",
      stockCardInfo: {}
    };
  }

  componentDidMount = () => {
    const { match, history } = this.props;

    if (match.params.stockSymbol) {
      if (this.checkSymbol(match.params.stockSymbol)) {
        const { name } = stockSymbolList.find(
          x => x.symbol === match.params.stockSymbol
        );
        this.setState({
          value: match.params.stockSymbol,
          stockName: name
        });
      } else {
        history.push(`/reports/`);
      }
    }
  };

  checkSymbol = symbolToFind =>
    stockSymbolList.find(x => x.symbol === symbolToFind);

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  searchStock = async () => {
    const { value, startDate, endDate } = this.state;
    const { history, retrieveStock } = this.props;
    if (value === "") {
      return;
    }
    if (!this.checkSymbol(value)) {
      return;
    }
    history.push(`/reports/${value}`);
    // need to make this a promise some how

    retrieveStock(value, startDate, endDate, "volume,close");
    // .then(r=>
    //   // this.useGottenData()
    // );
  };

  componentWillReceiveProps(nextProps) {
    const { stockData } = this.props;
    if (nextProps.stockData !== stockData) {
      this.useGottenData(nextProps.stockData);
    }
  }

  useGottenData = stockData => {
    const { value } = this.state;
    const dataArr = stockData[value].data;
    const last = parseFloat(dataArr[dataArr.length - 1].close);
    const changeCalc = last - parseFloat(dataArr[0].close);
    const changePerc = (changeCalc / parseFloat(dataArr[0].close)) * 100;
    const newCard = {
      price: last,
      volume: parseFloat(dataArr[dataArr.length - 1].volume),
      changePercentage: changePerc.toFixed(2),
      change: changeCalc.toFixed(2)
    };
    this.setState({
      stockCardInfo: newCard
    });
  };

  dateChange = e => {
    const { id, value } = e.currentTarget;
    this.setState({
      [id]: value
    });
  };

  render() {
    const {
      value,
      suggestions,
      startDate,
      endDate,
      stockName,
      stockCardInfo
    } = this.state;
    const inputProps = {
      placeholder: "Search for a Stock",
      value,
      onChange: this.onChange
    };
    const { match } = this.props;

    return (
      <Segment className="reportsContainer">
        <Stock
          big
          symbol={match.params.stockSymbol}
          name={stockName}
          info={stockCardInfo}
        />
        <div className="reportsSearch">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={theme}
          />
        </div>

        <div id="from" className="dateSelect">
          <h3>From:</h3>
          <Input
            className="reportDateInput"
            max={today}
            type="date"
            value={startDate}
            id="startDate"
            onChange={this.dateChange}
          />
        </div>
        <div id="to" className="dateSelect">
          <h3>To:</h3>
          <Input
            className="reportDateInput"
            value={endDate}
            max={today}
            type="date"
            id="endDate"
            onChange={this.dateChange}
          />
        </div>

        <Button
          className="searchButton"
          size="massive"
          onClick={this.searchStock}
          secondary
        >
          Search
        </Button>
        <Tab className="chart" panes={panes} />
      </Segment>
    );
  }
}
