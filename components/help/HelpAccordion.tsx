import Accordion from "@/components/ui/Accordion";
import { siteConfig } from "@/lib/site";

const helpTopics = [
  {
    id: "measurement",
    title: "Measurement Guide",
    content: (
      <div className="space-y-4">
        <p>
          Precise measurements ensure your custom window treatments fit
          flawlessly. We recommend measuring every window individually, as
          dimensions can vary even within the same room.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-cream-dark p-4">
            <h4 className="mb-2 text-sm font-medium text-charcoal">
              Inside Mount
            </h4>
            <p className="text-xs leading-relaxed">
              Measure width at the top, middle, and bottom of the window
              recess. Record the narrowest width. Measure height on the left,
              center, and right — use the longest height.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-cream-dark p-4">
            <h4 className="mb-2 text-sm font-medium text-charcoal">
              Outside Mount
            </h4>
            <p className="text-xs leading-relaxed">
              Measure the area you wish to cover. Add 2–3 inches beyond the
              frame on each side for maximum light control. Confirm sufficient
              flat surface for bracket mounting.
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
          Every {siteConfig.brandName} order is handcrafted to your specifications. Production
          typically requires 10–14 business days before shipment. Complimentary
          standard shipping is available on orders over $500 within the
          contiguous United States.
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs">
          <li>Standard delivery: 5–7 business days after production</li>
          <li>Expedited shipping available at checkout</li>
          <li>White-glove delivery for orders over $2,000</li>
          <li>Tracking details sent via email upon dispatch</li>
        </ul>
      </div>
    ),
  },
  {
    id: "installation",
    title: "Installation Instructions",
    content: (
      <div className="space-y-3">
        <p>
          Our window treatments are designed for confident DIY installation.
          Each order ships with a complete hardware kit, mounting brackets, and
          illustrated step-by-step instructions.
        </p>
        <ol className="list-inside list-decimal space-y-1 text-xs">
          <li>Unpack and verify all components against the packing list</li>
          <li>Mark bracket positions using the included measurement template</li>
          <li>Secure brackets with provided fasteners</li>
          <li>Install the shade and test full raise/lower operation</li>
        </ol>
        <p className="text-xs">
          Professional installation is available in select metropolitan areas.
          Contact our support team for scheduling and pricing.
        </p>
      </div>
    ),
  },
  {
    id: "warranty",
    title: "Warranty & Returns",
    content: (
      <div className="space-y-3">
        <p>
          We stand behind the quality of every product. Our warranty program is
          designed to protect your investment and provide lasting peace of
          mind.
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs">
          <li>Lifetime warranty on fabrics and materials</li>
          <li>5-year warranty on motors and mechanical components</li>
          <li>1-year warranty on smart home connectivity modules</li>
        </ul>
        <p>
          Because all products are made to order, returns are accepted only for
          manufacturing defects or shipping damage reported within 14 days of
          delivery. Please contact us before initiating any return.
        </p>
        <p className="text-xs">
          Questions? Email{" "}
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

export default function HelpAccordion() {
  return <Accordion items={helpTopics} />;
}
