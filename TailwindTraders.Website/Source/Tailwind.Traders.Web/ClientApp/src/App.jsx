import React, { Component, Fragment } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { CartService } from "./services";
import { ConfigService } from "./services";
import Meeting from './pages/home/components/videoCall/Meeting';

import { Header, Footer, DebugHeader } from "./shared";
import {
  Home,
  List,
  MyCoupons,
  Detail,
  SuggestedProductsList,
  Profile,
  ShoppingCart,
} from "./pages";

import "./i18n";
import "./main.scss";

import { createBrowserHistory } from "history";
import { ai } from "./services/telemetryClient";
// add appinsights
const history = createBrowserHistory({ basename: "" });
(async () => {
  await ConfigService.loadSettings();
  if (ConfigService._applicationInsightsIntrumentationKey) {
    ai.initialize(ConfigService._applicationInsightsIntrumentationKey, {
      history,
    });
  }
})();

class App extends Component {
  constructor() {
    super();
    this.state = {
      shoppingCart: [],
      quantity: null,
    };
  }

  async componentDidMount() {
    if (this.props.userInfo.token) {
      const shoppingCart = await CartService.getShoppingCart(
        this.props.userInfo.token
      );
      if (shoppingCart) {
        this.setState({ shoppingCart });
      }
    }

    if (this.state.shoppingCart != null) {
      const quantity = this.state.shoppingCart.reduce(
        (oldQty, { qty }) => oldQty + qty,
        0
      );
      this.setState({ quantity });
    }
  }

  ShoppingCart = (quantity) => {
    this.setState({ quantity });
  };

  sumProductInState = () => {
    this.setState((prevState) => {
      return { quantity: prevState.quantity + 1 };
    });
  };

  render() {
    const { quantity } = this.state;

    return (
      <div className="App">
        <BrowserRouter>
          <Fragment>
            <DebugHeader />
            <Header quantity={quantity} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/meeting" element={<Meeting />} />
              <Route path="/list" element={<List />} />
              <Route path="/list/:code" element={<List />} />
              <Route path="/suggested-products-list" element={<SuggestedProductsList />} />
              <Route
                path="/product/detail/:productId"
                element={<Detail sumProductInState={this.sumProductInState} />}
              />
              <Route
                path="/coupons"
                element={this.props.userInfo.loggedIn ? <MyCoupons /> : <Navigate to="/" />}
              />
              <Route
                path="/profile"
                element={this.props.userInfo.loggedIn ? <Profile /> : <Navigate to="/" />}
              />
              <Route
                path="/shopping-cart"
                element={
                  this.props.userInfo.loggedIn ? (
                    <ShoppingCart
                      ShoppingCart={this.ShoppingCart}
                      quantity={this.state.quantity}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
            <Footer />
          </Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = (state) => state.login;

export default connect(mapStateToProps)(App);
