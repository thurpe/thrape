import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 500,
});

function Room({ room, fromDate, toDate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row shadow-lg p-4 mb-4 bg-body rounded" data-aos="fade-up">
      <div className="col-md-4">
        <img src={room.imageurls[0]} alt="" className="smallImg" />
      </div>
      <div className="col-md-8 text-left">
        <h1>{room.name}</h1>
        <p>
          <strong>Max Count:</strong> {room.maxcount}
        </p>
        <p>
          <strong>Phone Number:</strong> {room.phonenumber}
        </p>
        <p>
          <strong>Type:</strong> {room.type}
        </p>
        <div style={{ float: "right" }}>
          {fromDate && toDate && (
            <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
              <Button className="btn btn-dark m-3">Book Now</Button>
            </Link>
          )}
          <Button className="btn" variant="dark" onClick={handleShow}>
            View Details
          </Button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel prevLabel="" next="">
            {room.imageurls.map((url) => {
              return (
                <Carousel.Item>
                  <img className="d-block w-100 bigImg" alt="" src={url} />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
