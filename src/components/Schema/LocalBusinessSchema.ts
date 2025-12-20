export interface LocalBusinessSchemaProps {
  url?: string;
  name?: string;
  description?: string;
  image?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude?: number;
    longitude?: number;
  };
  openingHours?: string;
  parentOrganizationName?: string;
  parentOrganizationUrl?: string;
  socialLinks?: string[];
}

/**
 * Returns JSON-LD for LocalBusiness structured data
 */
export default function getLocalBusinessSchema({
  url = "https://greenorbit.space",
  name = "Green Orbit Space Communications & PR",
  description = "Part of Impact Orbit Creative Group, Green Orbit Space Communications & PR helps space organisations communicate complex missions with clarity, purpose, and impact through PR, media campaigns, and stakeholder engagement.",
  image = "https://greenorbit.space/logos/organisations/greenorbit-space.png",
  telephone = "+44 116 4830155",
  email = "hello@greenorbit.space",
  address = {
    streetAddress: "Leicester",
    addressLocality: "Leicester",
    addressRegion: "Leicestershire",
    postalCode: "LE4 5NU",
    addressCountry: "GB"
  },
  geo = {
    latitude: 52.6369,
    longitude: -1.1398
  },
  openingHours = "Mo-Fr 09:00-17:00",
  parentOrganizationName = "Impact Orbit Creative Group",
  parentOrganizationUrl = "https://impactorbit.co",
  socialLinks = [
    "https://www.linkedin.com/company/impactorbitco/",
    "https://x.com/impactorbitco",
    "https://www.instagram.com/impactorbit.co/",
    "https://www.facebook.com/impactorbit.co/"
  ]
}: LocalBusinessSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#localbusiness`,
    name,
    url,
    description,
    image,
    telephone,
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude
    },
    openingHours,
    parentOrganization: {
      "@type": "Organization",
      name: parentOrganizationName,
      url: parentOrganizationUrl
    },
    sameAs: socialLinks
  };
}

export { getLocalBusinessSchema, LocalBusinessSchemaProps };