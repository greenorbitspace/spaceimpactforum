import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_CMbuzoBP.mjs';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_zCynberh.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="main"> <!-- Page Title --> <div class="page-title"> <div class="heading"> <div class="container"> <div class="row d-flex justify-content-center text-center"> <div class="col-lg-8"> <h1 class="heading-title">Contact</h1> <p class="mb-0">
The Energy Lab is the Space Impact Forum’s dedicated hub for sustainable energy systems and climate-aligned innovation. 
    By leveraging satellite data, advanced analytics, and cross-sector expertise, we develop actionable solutions 
    that accelerate clean energy adoption, optimise grids, and enhance energy security and efficiency worldwide.
</p> </div> </div> </div> </div> <nav class="breadcrumbs"> <div class="container"> <ol> <li><a href="index">Home</a></li> <li class="current">Contact</li> </ol> </div> </nav> </div><!-- End Page Title --> <!-- Contact Section --> <section id="contact" class="contact section"> <div class="container"> <div class="contact-wrapper"> <div class="contact-info-panel"> <div class="contact-info-header"> <h3>Contact Information</h3> <p>Dignissimos deleniti accusamus rerum voluptate. Dignissimos rerum sit maiores reiciendis voluptate inventore ut.</p> </div> <div class="contact-info-cards"> <div class="info-card"> <div class="icon-container"> <i class="bi bi-pin-map-fill"></i> </div> <div class="card-content"> <h4>Our Location</h4> <p>Leicester, UK</p> </div> </div> <div class="info-card"> <div class="icon-container"> <i class="bi bi-envelope-open"></i> </div> <div class="card-content"> <h4>Email Us</h4> <p>hello@spaceimpactforum.com</p> </div> </div> <div class="info-card"> <div class="icon-container"> <i class="bi bi-telephone-fill"></i> </div> <div class="card-content"> <h4>Call Us</h4> <p>+44 116 483 0155</p> </div> </div> </div> <div class="social-links-panel"> <h5>Follow Us</h5> <div class="social-icons"> <a href="https://facebook.com/spaceimpactforum"><i class="bi bi-facebook"></i></a> <a href="#"><i class="bi bi-twitter-x"></i></a> <a href="https://instagram/spaceimpactforum"><i class="bi bi-instagram"></i></a> <a href="#"><i class="bi bi-linkedin"></i></a> <a href="#"><i class="bi bi-youtube"></i></a> </div> </div> </div> <div class="contact-form-panel"> <div class="map-container"> <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77482.3870744158!2d-1.2136720127925895!3d52.63604840101941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487742ab49b76c73%3A0x9a151d2a6fb49cb8!2sLeicester!5e0!3m2!1sen!2suk!4v1764828097369!5m2!1sen!2suk" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> </div> <div class="form-container"> <h3>Send Us a Message</h3> <p>Lorem ipsum dolor sit amet consectetur adipiscing elit mauris hendrerit faucibus imperdiet nec eget felis.</p> <form action="forms/contact.php" method="post" class="php-email-form"> <div class="form-floating mb-3"> <input type="text" class="form-control" id="nameInput" name="name" placeholder="Full Name" required=""> <label for="nameInput">Full Name</label> </div> <div class="form-floating mb-3"> <input type="email" class="form-control" id="emailInput" name="email" placeholder="Email Address" required=""> <label for="emailInput">Email Address</label> </div> <div class="form-floating mb-3"> <input type="text" class="form-control" id="subjectInput" name="subject" placeholder="Subject" required=""> <label for="subjectInput">Subject</label> </div> <div class="form-floating mb-3"> <textarea class="form-control" id="messageInput" name="message" rows="5" placeholder="Your Message" style="height: 150px" required=""></textarea> <label for="messageInput">Your Message</label> </div> <div class="my-3"> <div class="loading">Loading</div> <div class="error-message"></div> <div class="sent-message">Your message has been sent. Thank you!</div> </div> <div class="d-grid"> <button type="submit" class="btn-submit">Send Message <i class="bi bi-send-fill ms-2"></i></button> </div> </form> </div> </div> </div> </div> </section><!-- /Contact Section --> </main> ` })}`;
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/pages/contact.astro", void 0);
const $$file = "/Volumes/DevProjects/rjmlaird/Eventix/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
