export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'



export function getStrapiURL(path = "") {
    return `${
      API_URL
    }${path}`;
  }
  
  // Helper to make GET requests to Strapi
  export async function fetchAPI(path) {
    const requestUrl = getStrapiURL(path);
    const response = await fetch(requestUrl);
    const data = await response.json();
    return data;
  }