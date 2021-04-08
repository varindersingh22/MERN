import React, { Component } from "react";
import {Button,Nav,NavDropdown,Navbar,Form,FormControl,Carousel,Container,Card,Row,Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import spidy from "../spidy.jpg";
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.username = localStorage.getItem("userName");
    this.state = {};
  }

  logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authStatus");
    localStorage.removeItem("userID");
    this.props.history.replace("/login");
  };

  render() {
    return (
      <div>
        
      <Navbar bg="dark" expand="lg">
  <Navbar.Brand href="#home"><img
        alt=""
        src="https://i.ibb.co/r5krrdz/logo.png"
        height="70px"
        width="100px"
        className="d-inline-block align-top"
      /></Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
     
      
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-success">Search</Button>
    </Form>
    {" "}
    {" "}
 
        <NavDropdown title="Username" id="basic-nav-dropdown" >
        <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Watchlist</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Logout</NavDropdown.Item>
      </NavDropdown>
  </Navbar.Collapse>
  
</Navbar>
<div style={{backgroundColor:"#464648"}}>
<Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src={spidy}
      alt="First slide"
      height="700px"
    />
    <Carousel.Caption>
      <h3>First slide label</h3>
      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    </Carousel.Caption>
  </Carousel.Item>
  
  
</Carousel>
      </div> 
      <div style={{backgroundColor:"black"}}>
      <div>
        <hr style={{backgroundColor:"grey"}}></hr>
        <h1 style={{color:"red"}}>New Movies</h1>
        <hr style={{backgroundColor:"grey"}}></hr>
        <div>
    <Container> 
      <Row> 
        <Col xs={12} md={4}>
  <Card border="light" style={{ width: '18rem' }} >
  <Card.Img variant="top" src="holder.js/100px180" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>

 
</Col>

</Row>
 </Container>
    </div>
    </div> 
      <div>
        <hr style={{backgroundColor:"grey"}}></hr>
        <h1 style={{color:"red"}}>Marvel Universe</h1>
        <hr style={{backgroundColor:"grey"}}></hr>
        <div>
    <Container> 
      <Row> 
        <Col xs={12} md={4}>
  <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="holder.js/100px180" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>

 
</Col>

</Row>
 </Container>
    </div>
    </div> 
      <div>
        <hr style={{backgroundColor:"grey"}}></hr>
        <h1 style={{color:"red"}}>DC Universe</h1>
        <hr style={{backgroundColor:"grey"}}></hr>
        <div>
    <Container> 
      <Row> 
        <Col xs={12} md={4}>
  <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="holder.js/100px180" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>

 
</Col>

</Row>
 </Container>
    </div>
    </div> 
      <div>
        <hr style={{backgroundColor:"grey"}}></hr>
        <h1 style={{color:"red"}}>Walt Disney</h1>
        <hr style={{backgroundColor:"grey"}}></hr>
        <div>
    <Container> 
      <Row> 
        <Col xs={12} md={4}>
  <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="holder.js/100px180" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>

 
</Col>

</Row>
 </Container>
    </div>
    </div> 
      <div>
        <hr style={{backgroundColor:"grey"}}></hr>
        <h1 style={{color:"red"}}>Web Series</h1>
        <hr style={{backgroundColor:"grey"}}></hr>
        <div>
    <Container> 
      <Row> 
        <Col xs={12} md={4}>
  <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="holder.js/100px180" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>

 
</Col>

</Row>
 </Container>
    </div>
  
  
</div>
      </div>
      </div>
    );
  }
}
