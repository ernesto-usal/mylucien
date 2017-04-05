import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import LayoutPrincipal from './components/LayoutPrincipal';

// Se inicializa store con un objeto vacío como estado inicial
const store = configureStore({});

// Componente principal App al que se le asigna store de Provider para los estados
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LayoutPrincipal />
      </Provider>
    );
  }
}