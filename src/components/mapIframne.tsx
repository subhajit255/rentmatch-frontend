import React from "react";

export const MapIframe = ({ lat, lng, zoom = 15 }: any) => {
    // Construct the URL with latitude and longitude

    // const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1222073449103!2d106.77590781537452!3d-6.2476228629146675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f11b12c11ab7%3A0xcd48f5c775249316!2sHumanity%20First%20Indonesia!5e0!3m2!1sid!2sid!4v1605684563677!5m2!1sid!2sid"

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <iframe
                title="Google Map Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://maps.google.com${lat},${lng}&z=${zoom}&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
};

// Usage Example
// <MapIframe lat={37.42216} lng={-122.08427} />
