import { c as createComponent, e as renderHead, a as renderTemplate, m as maybeRenderHead, b as createAstro, r as renderComponent, f as renderSlot } from './vendor_CMbuzoBP.mjs';
import 'html-escaper';
import 'clsx';

const $$Head = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0" name="viewport"><title>Space Impact Forum</title><meta name="description" content=""><meta name="keywords" content=""><!-- Favicons --><link href="/img/favicon.png" rel="icon"><link href="/img/apple-touch-icon.png" rel="apple-touch-icon"><!-- Fonts --><link href="https://fonts.googleapis.com" rel="preconnect"><link href="https://fonts.gstatic.com" rel="preconnect" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"><!-- Vendor CSS Files --><link href="/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet"><link href="/vendor/aos/aos.css" rel="stylesheet"><link href="/vendor/swiper/swiper-bundle.min.css" rel="stylesheet"><link href="/vendor/glightbox/css/glightbox.min.css" rel="stylesheet"><!-- Main CSS File --><link href="/styles/global.css" rel="stylesheet"><!-- =======================================================
  * Template Name: Eventix
  * Template URL: https://bootstrapmade.com/eventix-bootstrap-events-website-template/
  * Updated: Sep 06 2025 with Bootstrap v5.3.8
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->${renderHead()}</head>`;
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/components/Head.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header id="header" class="header sticky-top"> <div class="header-container container-fluid d-flex align-items-center"> <a href="index" class="logo d-flex align-items-center"> <h1 class="sitename"><strong>SPACE IMPACT FORUM</strong></h1> </a> <nav id="navmenu" class="navmenu"> <ul> <li><a href="index" class="active">Home</a></li> <li class="dropdown"> <a href="index#about"> <span>About</span> <i class="bi bi-chevron-down toggle-dropdown"></i> </a> <ul> <li><a href="venue">Venue</a></li> <li><a href="impact-framework">Impact Framework</a></li> </ul> </li> <li class="dropdown"> <a href="index#schedule"> <span>Schedule</span> <i class="bi bi-chevron-down toggle-dropdown"></i> </a> <ul> <li><a href="index#speakers">Keynotes</a></li> <li><a href="index#speakers">Plenary</a></li> <li><a href="index#speakers">Panels</a></li> </ul> </li> <li class="dropdown"> <a href="#"> <span>Sponsors</span> <i class="bi bi-chevron-down toggle-dropdown"></i> </a> <ul> <li><a href="sponsors">Sponsors</a></li> <li><a href="supporters">Supporters</a></li> <li><a href="exhibitors">Exhibitors</a></li> </ul> </li> <li class="dropdown"> <a href="#"> <span>Impact Labs</span> <i class="bi bi-chevron-down toggle-dropdown"></i> </a> <ul> <li><a href="impact-labs/environment">Environment</a></li> <li><a href="impact-labs/food">Food</a></li> <li><a href="impact-labs/energy">Energy</a></li> <li><a href="impact-labs/urban">Urban</a></li> </ul> </li> <li><a href="contact">Contact</a></li> <!-- Mobile CTA --> <li class="mobile-cta d-xl-none"> <a href="buy-tickets" class="btn-getstarted">Register Now</a> </li> </ul> <i class="mobile-nav-toggle d-xl-none bi bi-list"></i> </nav> <!-- Desktop CTA --> <a class="btn-getstarted d-none d-xl-inline-block" href="buy-tickets"> <strong>REGISTER NOW</strong> </a> </div> </header>`;
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer id="footer" class="footer position-relative light-background"> <div class="container footer-top"> <div class="row gy-4"> <!-- About / Brand --> <div class="col-lg-4 col-md-6 footer-about"> <a href="index.html" class="logo d-flex align-items-center"> <span class="sitename">Space Impact Forum</span> </a> <p class="mt-3">Advancing sustainable innovation and collaboration across the global space sector.</p> <div class="footer-contact pt-3"> <p>Leicester, UK</p> <p class="mt-2"><strong>Phone:</strong> <span>+44 116 483 0155</span></p> <p><strong>Email:</strong> <span>hello@spaceimpactforum.com</span></p> </div> <div class="social-links d-flex mt-4"> <a href="#"><i class="bi bi-twitter-x"></i></a> <a href="https://facebook.com/spaceimpactforum"><i class="bi bi-facebook"></i></a> <a href="https://instagram.com/spaceimpactforum"><i class="bi bi-instagram"></i></a> <a href="#"><i class="bi bi-linkedin"></i></a> <a href="#"><i class="bi bi-youtube"></i></a> </div> </div> <!-- Useful Links --> <div class="col-lg-2 col-md-3 footer-links"> <h4>Useful Links</h4> <ul> <li><a href="#about">About Us</a></li> <li><a href="terms.html">Terms of Service</a></li> <li><a href="privacy-policy.html">Privacy Policy</a></li> <li><a href="cookie-policy.html">Cookie Policy</a></li> <li><a href="event-code-of-conduct.html">Event Code of Conduct</a></li> <li><a href="faqs.html">FAQs</a></li> </ul> </div> <!-- Forum Services --> <div class="col-lg-2 col-md-3 footer-links"> <h4>Forum</h4> <ul> <li><a href="impact-labs.html">Impact Labs</a></li> <li><a href="#">Workshops & Mentorship</a></li> <li><a href="#">Networking Events</a></li> <li><a href="#">Policy Roundtables</a></li> <li><a href="livestreaming.html">Live Streaming Access</a></li> <li><a href="press.html">Media & Press</a></li> <li><a href="sponsorship.html">Sponsorship</a></li> </ul> </div> <!-- Resources / Learning --> <div class="col-lg-2 col-md-3 footer-links"> <h4>Resources</h4> <ul> <li><a href="#">White Papers</a></li> <li><a href="#">Research Library</a></li> <li><a href="#">Blog & Insights</a></li> <li><a href="#">Case Studies</a></li> <li><a href="#">Event Recordings</a></li> </ul> </div> <!-- Affiliated Websites --> <div class="col-lg-2 col-md-3 footer-links"> <h4>Affiliated Sites</h4> <ul> <li><a href="https://impactorbit.co">Impact Orbit Creative Group</a></li> <li><a href="https://greenorbit.space">Green Orbit Space Communications & PR</a></li> <li><a href="https://greenorbit.digital">Green Orbit Digital</a></li> <li><a href="https://greenorbit.academy">Green Orbit Academy</a></li> <li><a href="https://spaceintegrity.org">Space Integrity Initiative</a></li> <li><a href="https://leicesterspaceweek.com">Leicester Space Week</a></li> </ul> </div> </div> </div> <!-- Copyright & Credits --> <div class="container copyright text-center mt-4"> <p>© <span>Copyright</span> <strong class="px-1 sitename">Impact Orbit Creative Group</strong> <span>All Rights Reserved</span></p> <div class="credits">
Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> </div> </div> </footer>`;
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Scripts = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["<!-- Scroll Top -->", `<a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"> <i class="bi bi-arrow-up-short"></i> </a> <!-- Preloader --> <div id="preloader"></div> <!-- Vendor JS Files --> <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js"><\/script> <script src="/vendor/php-email-form/validate.js"><\/script> <script src="/vendor/aos/aos.js"><\/script> <script src="/vendor/swiper/swiper-bundle.min.js"><\/script> <script src="/vendor/glightbox/js/glightbox.min.js"><\/script> <script src="/vendor/imagesloaded/imagesloaded.pkgd.min.js"><\/script> <script src="/vendor/isotope-layout/isotope.pkgd.min.js"><\/script> <!-- Initialise Vendor Plugins --> <script>
  document.addEventListener('DOMContentLoaded', () => {
    // AOS Animations
    if (window.AOS) {
      AOS.init({ duration: 800, once: true });
    }

    // GLightbox
    if (window.GLightbox) {
      GLightbox({ selector: '.glightbox' });
    }

    // Swiper
    if (window.Swiper) {
      new Swiper('.swiper', {
        loop: true,
        autoplay: { delay: 5000 },
        pagination: { el: '.swiper-pagination', clickable: true }
      });
    }
  });
<\/script> <!-- Main Template JS --> <script src="/js/main.js"><\/script>`])), maybeRenderHead());
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/components/Scripts.astro", void 0);

const $$Astro = createAstro("https://greenorbit.space");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description, bodyClass } = Astro2.props;
  return renderTemplate`<html lang="en"> ${renderComponent($$result, "Head", $$Head, {})}${maybeRenderHead()}<body class="index-page"> ${renderComponent($$result, "Header", $$Header, {})} <main class="main"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "Scripts", $$Scripts, {})} </body></html>`;
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
