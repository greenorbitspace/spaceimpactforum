import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_CMbuzoBP.mjs';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_zCynberh.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="main"> <!-- Page Title --> <div class="page-title"> <div class="heading"> <div class="container"> <div class="row d-flex justify-content-center text-center"> <div class="col-lg-8"> <h1 class="heading-title">404</h1> <p class="mb-0">
Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo
                odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum
                debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat
                ipsum dolorem.
</p> </div> </div> </div> </div> <nav class="breadcrumbs"> <div class="container"> <ol> <li><a href="index">Home</a></li> <li class="current">404</li> </ol> </div> </nav> </div><!-- End Page Title --> <!-- Error 404 Section --> <section id="error-404" class="error-404 section"> <div class="container" data-aos="fade-up" data-aos-delay="100"> <div class="text-center"> <div class="error-icon mb-4" data-aos="zoom-in" data-aos-delay="200"> <i class="bi bi-exclamation-circle"></i> </div> <h1 class="error-code mb-4" data-aos="fade-up" data-aos-delay="300">404</h1> <h2 class="error-title mb-3" data-aos="fade-up" data-aos-delay="400">Oops! Page Not Found</h2> <p class="error-text mb-4" data-aos="fade-up" data-aos-delay="500">
The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
</p> <div class="search-box mb-4" data-aos="fade-up" data-aos-delay="600"> <form action="#" class="search-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for pages..." aria-label="Search"> <button class="btn search-btn" type="submit"> <i class="bi bi-search"></i> </button> </div> </form> </div> <div class="error-action" data-aos="fade-up" data-aos-delay="700"> <a href="/" class="btn btn-primary">Back to Home</a> </div> </div> </div> </section><!-- /Error 404 Section --> </main> ` })}`;
}, "/Volumes/DevProjects/rjmlaird/Eventix/src/pages/404.astro", void 0);
const $$file = "/Volumes/DevProjects/rjmlaird/Eventix/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
