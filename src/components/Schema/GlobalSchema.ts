import organisations from "../../data/organisations.json";
import brands from "../../data/schema/brands.json";
import socials from "../../data/schema/socials.json";
import contact from "../../data/schema/contact.json";
import founders from "../../data/schema/founders.json";
import areas from "../../data/schema/areas.json";
import knowledge from "../../data/schema/knowledge.json";
import profiles from "../../data/schema/profiles.json";
import services from "../../data/schema/services.json";
import webpages from "../../data/schema/webpages.json";
import blog from "../../data/schema/blog.json";

import getWebsiteSchemaJSON from "../Schema/WebsiteSchema";
import getWebPageSchema, { WebPageSchemaProps } from "../Schema/WebPageSchema";
import getLocalBusinessSchema, { LocalBusinessSchemaProps } from "../Schema/LocalBusinessSchema";

/**
 * Generate full JSON-LD global schema for site
 * @param pageData Optional page info for WebPage schema
 */
export function getGlobalSchema(pageData?: WebPageSchemaProps): Record<string, any>[] {
  // Safely fallback all imports
  const safeFounders = Array.isArray(founders) ? founders : [];
  const safeContact = contact || {};
  const safeAreas = Array.isArray(areas) ? areas : [];
  const safeKnowledge = Array.isArray(knowledge) ? knowledge : [];
  const safeBrands = Array.isArray(brands) ? brands : [];
  const safeServices = Array.isArray(services) ? services : [];
  const safeWebpages = Array.isArray(webpages) ? webpages : [];
  const safeBlog = Array.isArray(blog) ? blog : [];

  // Member and partner organizations
  const memberOrgs = Array.isArray(organisations)
    ? organisations
        .filter(org => ["member", "partner"].includes(org.Type))
        .map(org => ({
          "@type": "Organization",
          name: org.Organisation,
          url: org.URL,
          description: org.Description || undefined,
          logo: org.logo || undefined
        }))
    : [];

  // Flatten all social/profile links
  const flattenedProfiles = Object.values(profiles?.profiles || {}).flat();
  const sameAsLinks = Array.from(
    new Set([
      ...(Array.isArray(socials) ? socials.map(s => s?.url).filter(Boolean) : []),
      ...(flattenedProfiles.map(p => p?.url).filter(Boolean))
    ])
  );

  // Core Organization node
  const orgNode: Record<string, any> = {
    "@type": "Organization",
    "@id": "https://greenorbit.space/#organization",
    name: "Green Orbit Space Communications & PR",
    url: "https://greenorbit.space",
    logo: "https://greenorbit.space/logos/organisations/greenorbit-space.png",
    foundingDate: "2023-10-12",
    legalName: "Impact Orbit Creative Group",
    description:
      "Green Orbit Space Communications & PR, part of Impact Orbit Creative Group, helps space organisations communicate complex missions with clarity, purpose, and impact.",
    slogan: "Communicating space missions with clarity and impact.",
    founder: safeFounders.length ? safeFounders : undefined,
    contactPoint: safeContact.contactPoint?.length ? safeContact.contactPoint : undefined,
    address: Object.keys(safeContact.address || {}).length ? safeContact.address : undefined,
    geo: Object.keys(safeContact.geo || {}).length ? safeContact.geo : undefined,
    sameAs: sameAsLinks.length ? sameAsLinks : undefined,
    areaServed: safeAreas.length ? safeAreas : undefined,
    memberOf: memberOrgs.length ? memberOrgs : undefined,
    knowsAbout: safeKnowledge.length ? safeKnowledge : undefined,
    brand: safeBrands.length ? safeBrands : undefined,
    makesOffer: safeServices.length ? safeServices : undefined,
    hasPart: safeWebpages.length ? safeWebpages : undefined,
    publishes: safeBlog.length ? safeBlog : undefined,
    isAccessibleForFree: true
  };

  // Website schema
  let websiteSchemaGraph: Record<string, any>[] = [];
  try {
    const websiteSchemaJSON = getWebsiteSchemaJSON({
      url: pageData?.url || "https://greenorbit.space",
      title: pageData?.title || "Green Orbit Space Communications & PR",
      description: pageData?.description,
      featuredImage: pageData?.featuredImage
    });
    const parsed = typeof websiteSchemaJSON === "string" ? JSON.parse(websiteSchemaJSON) : websiteSchemaJSON;
    if (parsed?.["@graph"]) {
      websiteSchemaGraph = parsed["@graph"].map((node: any) => {
        if (node["@id"]?.includes("#logo") || node["@type"] === "ImageObject") {
          return { ...node, url: "https://greenorbit.space/logos/organisations/greenorbit-space.png" };
        }
        return node;
      });
    }
  } catch (e) {
    console.warn("Failed to parse WebsiteSchema JSON:", e);
  }

  // LocalBusiness schema
  const localBusinessSchema = getLocalBusinessSchema({
    url: "https://greenorbit.space",
    name: "Green Orbit Space Communications & PR",
    description: orgNode.description,
    image: "https://greenorbit.space/logos/organisations/greenorbit-space.png",
    telephone: "+44 116 4830155",
    email: "hello@greenorbit.space",
    address: {
      streetAddress: "Leicester",
      addressLocality: "Leicester",
      addressRegion: "Leicestershire",
      postalCode: "LE4 5NU",
      addressCountry: "GB"
    },
    geo: { latitude: 52.6369, longitude: -1.1398 },
    openingHours: "Mo-Fr 09:00-17:00",
    parentOrganizationName: "Impact Orbit Creative Group",
    parentOrganizationUrl: "https://impactorbit.com",
    socialLinks: sameAsLinks
  });

  // Dynamic WebPage schema node
  const webPageSchema = getWebPageSchema(
    pageData || {
      url: "https://greenorbit.space",
      title: "Green Orbit Space Communications & PR",
      featuredImage: "https://greenorbit.space/logos/organisations/greenorbit-space.png"
    }
  );

  // Return combined JSON-LD graph
  return [...websiteSchemaGraph, orgNode, localBusinessSchema, webPageSchema];
}

export default getGlobalSchema;