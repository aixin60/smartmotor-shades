import Accordion from "@/components/ui/Accordion";
import { siteConfig } from "@/lib/site";

const accordionItems = [
  {
    id: "measurement",
    title: "Measurement Guide",
    content: (
      <div className="space-y-4">
        <p>
          Accurate measurements are essential for a perfect fit. We recommend
          measuring each window individually, as sizes may vary throughout your
          home.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-cream-dark p-4">
            <h4 className="mb-2 text-sm font-medium text-charcoal">
              Inside Mount
            </h4>
            <p className="text-xs leading-relaxed">
              Measure width at the top, middle, and bottom of the window frame.
              Use the narrowest measurement. Measure height on the left, center,
              and right — use the longest measurement.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-cream-dark p-4">
            <h4 className="mb-2 text-sm font-medium text-charcoal">
              Outside Mount
            </h4>
            <p className="text-xs leading-relaxed">
              Measure the desired coverage area. Add 2–3 inches to each side for
              optimal light blocking. Ensure adequate flat surface for bracket
              installation.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    content: (
      <div className="space-y-3">
        <p>
          All custom orders are handcrafted and typically ship within 10–14
          business days. Free standard shipping on orders over $500 within the
          contiguous United States.
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs">
          <li>Standard delivery: 5–7 business days after production</li>
          <li>Express delivery available at checkout</li>
          <li>White-glove delivery service for orders over $2,000</li>
          <li>Tracking information provided upon shipment</li>
        </ul>
      </div>
    ),
  },
  {
    id: "installation",
    title: "Installation",
    content: (
      <div className="space-y-3">
        <p>
          Our shades are designed for straightforward DIY installation. Each
          order includes a complete hardware kit and step-by-step instructions.
        </p>
        <p className="text-xs">
          Professional installation services are available in select
          metropolitan areas. Contact our support team for a quote.
        </p>
      </div>
    ),
  },
  {
    id: "smart-home",
    title: "Smart Home",
    content: (
      <div className="space-y-3">
        <p>
          Integrate your window treatments into your connected home ecosystem.
          Compatible with leading smart home platforms.
        </p>
        <div className="flex flex-wrap gap-3">
          {["Apple HomeKit", "Google Home", "Amazon Alexa", "Samsung SmartThings"].map(
            (platform) => (
              <span
                key={platform}
                className="rounded-sm border border-border bg-cream-dark px-3 py-1.5 text-xs font-medium text-charcoal"
              >
                {platform}
              </span>
            )
          )}
        </div>
        <p className="text-xs">
          Smart Home Motor required for voice and app control. Hub may be
          required depending on your platform.
        </p>
      </div>
    ),
  },
  {
    id: "warranty",
    title: "Warranty & Support",
    content: (
      <div className="space-y-3">
        <p>
          Every {siteConfig.brandName} product is backed by our comprehensive warranty program,
          designed to protect your investment for years to come.
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs">
          <li>Lifetime warranty on fabrics and materials</li>
          <li>5-year warranty on motors and mechanical components</li>
          <li>1-year warranty on smart home connectivity modules</li>
          <li>Dedicated North American customer support team</li>
        </ul>
        <p className="text-xs">
          Reach us at{" "}
          <span className="font-medium text-charcoal">{siteConfig.supportEmail}</span>{siteConfig.supportPhone ? (
            <>
              {" "}
              or call{" "}
              <span className="font-medium text-charcoal">
                {siteConfig.supportPhone}
              </span>
              .
            </>
          ) : (
            "."
          )}
        </p>
      </div>
    ),
  },
];

export default function ProductAccordion() {
  return <Accordion items={accordionItems} />;
}
