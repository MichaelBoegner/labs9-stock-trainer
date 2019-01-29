/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Carousel from "re-carousel";

export default function Indicators() {
  return (
    <Carousel loop auto>
      <div>
        <h3>Average True Range</h3>
        <p>
          Average True Range(ATR) is an indicator that measures market
          volatility by calulating the current high minus the current low,
          calulate the absolute value of the current high minus the previous
          close, and calulate the absolute value of the current low minus the
          close during a 14 day period.
        </p>
      </div>
      <div>
        <h3>Volume Weighted Average Price</h3>
        <p>
          Volume Weighted Average Price(VWAP) is primarily used for pension
          plans. You can calculate it by adding all the dollars for every
          transaction and divide that by the total shares of the day. Typically
          used by instutional investors to buy and sell large orders and not
          disturb the market with the large number of orders.
        </p>
      </div>
      <div>
        <h3>Moving Average</h3>
        <p>
          Moving averages are the most used and popular tool by investors to
          measure a stocks momentum. There are 3 types of Moving Averages:
          Simple Moving Average, Weighted Moving Average, and Exponential Moving
          Average. Simple Moving average was used before the rise of computers
          for it's simplicity to calculate. Weighted Moving Average is heavier
          and more complicated to calculate using the current data compared to
          past data. Exponential is the same as Weighted but the decrease
          between prices is not consistent.
        </p>
      </div>
    </Carousel>
  );
}
