import React from "react"
import { Container, Row } from "reactstrap"

const Footer = () => {
  return (
    <footer 
      className="footer text-center text-muted" 
      style={{ fontSize: "12px", padding: "5px 0" }}
    >
      <Container fluid>
        <Row>
          <div className="col-12">
            © {new Date().getFullYear()} 7AM Digital
            <span className="d-none d-sm-inline-block">
              {" "}
              <i className="mdi mdi-heart text-danger"></i>
            </span>
          </div>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
