import React from "react";

function Error({ message }) {
  return (
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}

export default Error;
