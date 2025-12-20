import { WebPageSchemaProps } from "./WebPageSchema";

export interface WebsiteSchemaProps {
  url: string;
  title: string;
  description?: string;
  featuredImage?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: { name: string; url: string }[];
}

/**
 * Returns full Website JSON-LD object including LocalBusiness node
 */
export default function getWebsiteSchema({
  url,
  title,
  description = "Green Orbit Space Communications & PR, part of Impact Orbit Creative Group, delivers strategic communications, narrative development, and PR campaigns for space organisations and initiatives.",
  featuredImage = "https://greenorbit.space/logos/organisations/greenorbit-space.png",
  datePublished = "2025-01-01",
  dateModified = new Date().toISOString().split("T")[0],
  breadcrumbs
}: WebsiteSchemaProps) {
  const breadcrumbList = breadcrumbs?.length
    ? breadcrumbs.map((bc, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: bc.name,
        item: bc.url
      }))
    : [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://greenorbit.space"
        }
      ];

  const baseOrganization = {
    "@type": "Organization",
    "@id": "https://greenorbit.space/#organization",
    name: "Green Orbit Space Communications & PR",
    legalName: "Impact Orbit Creative Group Co.",
    url: "https://greenorbit.space",
    logo: { "@id": "https://greenorbit.space/#logo" },
    image: "https://greenorbit.space/logos/organisations/greenorbit-space.png",
    description: "Part of Impact Orbit Creative Group, Green Orbit Space Communications & PR helps space organisations communicate complex missions with clarity, purpose, and impact through PR, media campaigns, and stakeholder engagement.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Leicester",
      addressLocality: "Leicester",
      postalCode: "LE4 5NU",
      addressCountry: "GB"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@greenorbit.space",
        telephone: "+44 116 4830155",
        availableLanguage: ["en"]
      }
    ],
    sameAs: [
      "https://www.linkedin.com/company/greenorbitspace/",
      "https://x.com/greenorbitspace",
      "https://www.instagram.com/greenorbitspace/"
    ]
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://greenorbit.space/#website",
        url: "https://greenorbit.space",
        name: "Green Orbit Space Communications & PR",
        alternateName: "Impact Orbit Creative Group",
        publisher: { "@id": baseOrganization["@id"] },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://greenorbit.space/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      baseOrganization,
      {
        "@type": "LocalBusiness",
        "@id": "https://greenorbit.space/#localbusiness",
        name: "Green Orbit Space Communications & PR",
        url: "https://greenorbit.space",
        image: featuredImage,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Leicester",
          addressRegion: "Leicestershire",
          addressCountry: "GB"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 52.6369,
          longitude: -1.1398
        },
        openingHours: "Mo-Fr 09:00-17:00",
        parentOrganization: { "@id": baseOrganization["@id"] }
      },
      {
        "@type": "ImageObject",
        "@id": "https://greenorbit.space/#logo",
        url: "https://greenorbit.space/logos/organisations/greenorbit-space.png",
        caption: "Green Orbit Space Communications & PR Logo"
      }
    ]
  };
}

export { getWebsiteSchema, WebsiteSchemaProps };