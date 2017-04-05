import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Container, Col, Row} from 'react-grid-system';
import routes from '../routes/routesConfig';
import './LayoutPrincipal.css';

class LayoutPrincipal extends Component {
  render() {
    return (
      <Router>
        <div>
          <Container fluid>
            <Row>
              {/* Menú principal a partir del sidebar de routes */}
              <Col sm={4.5} md={3.5} lg={3}>
                {routes.map((route, index) => (<Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.sidebar}/>))}
              </Col>
              {/* Contenido de la página a partir del main de routes */}
              <Col sm={7.5} md={8.5} lg={9}>
                {routes.map((route, index) => (<Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.main}/>))}
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}

export default LayoutPrincipal;
