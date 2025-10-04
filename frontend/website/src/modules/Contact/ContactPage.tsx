import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setmessage] = useState("");

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert(
      `Thank You ${name} for Contacting Us. We will Get Back to You Soon.\n\nYour Mail Id - ${email}.\nYour Message is - ${message}`
    );
    setname("");
    setEmail("");
    setmessage("");
  };

  return (
    <>
      <div className="contactSection">
        <h2>Contact Us</h2>
        <div className="contactMap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4759.255304735698!2d121.15201067586996!3d14.204190086657519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd63000286fa21%3A0x18d0e2688547e2d8!2sSM%20City%20Calamba!5e1!3m2!1sen!2sph!4v1758733412657!5m2!1sen!2sph" 
          width="800"
          height="600"
          allowFullScreen
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="sm home shop"
          ></iframe>
        </div>
        <div className="contactInfo">
          <div className="contactAddress">
            <div className="address">
              <h3>Store in London</h3>
              <p>
                1418 River Drive, Suite 35 Cottonhall, CA 9622
                <br /> United Kingdom
              </p>
              <p>
                admin@dummymail.com
                <br />
                +44 20 7123 4567
              </p>
            </div>
            <div className="address">
              <h3>Store in India</h3>
              <p>
                A-791, A-791, Bandra Reclamation Rd, Mumbai
                <br /> Maharashtra
              </p>
              <p>
                contact@dummymail.com
                <br />
                +44 20 7123 4567
              </p>
            </div>
          </div>
          <div className="contactForm">
            <h3>Get In Touch</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                placeholder="Name *"
                onChange={(e) => setname(e.target.value)}
                required
              />
              <input
                type="email"
                value={email}
                placeholder="Email address *"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                rows={10}
                cols={40}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
