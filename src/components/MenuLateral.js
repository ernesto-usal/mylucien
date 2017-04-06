import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu} from 'semantic-ui-react'

class MenuLateral extends Component {
    render() {
        return (
            <div>
                <Menu vertical>
                    <Menu.Item name='mis-libros' active={false} onClick={this.handleItemClick}>
                        <Link to="/">Mis Libros</Link>
                    </Menu.Item>

                    <Menu.Item
                        name='search-libro-google'
                        active={false}
                        onClick={this.handleItemClick}>
                        <Link to="/search-libro-google">Buscar Libros en Google</Link>
                    </Menu.Item>

                    <Menu.Item name='add-libro' active={false} onClick={this.handleItemClick}>
                        <Link to="/add-libro">Añadir Libro</Link>
                    </Menu.Item>

                    <Menu.Item
                        name='add-author'
                        active={false}
                        onClick={this.handleItemClick}>
                        <Link to="/add-author">Añadir Autor</Link>
                    </Menu.Item>

                </Menu>
            </div>

        );
    }
}

export default MenuLateral;