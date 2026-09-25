"use client";

import { useState } from "react";

const HARDWARE_OPTIONS = [
  { id: "white", label: "White", price: 0 },
  { id: "black", label: "Black", price: 0 },
  { id: "champagne", label: "Champagne", price: 15 },
];

interface ProductConfiguratorProps {
  slug: string;
  category: string;
  productName: string;
  basePrice: number;
  initialColor?: string;
}

export default function ProductConfigurator({
  productName,
  basePrice,
}: ProductConfiguratorProps) {
  const [selectedColor, setSelectedColor] = useState("linen");
  const [mountType, setMountType] = useState<"inside" | "outside" | null>(null);
  
  // 房间/窗户名称标记 (在 Size 之前)
  const [roomName, setRoomName] = useState("");
  
  const [width, setWidth] = useState("");
  const [widthFraction, setWidthFraction] = useState("0");
  const [height, setHeight] = useState("");
  const [heightFraction, setHeightFraction] = useState("0");
  const [selectedHardware, setSelectedHardware] = useState("white");

  // 控制测量指南弹窗的状态
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);

  const currentHardwarePrice = HARDWARE_OPTIONS.find((h) => h.id === selectedHardware)?.price || 0;
  const totalPrice = basePrice + currentHardwarePrice; // 电机已标配，不再额外加钱

  return (
    <div className="flex flex-col relative">
      {/* --- 测量指南弹窗 (包含更大的图片占位) --- */}
      {isMeasureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-md bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-serif text-2xl text-charcoal">How to Measure</h2>
              <button 
                onClick={() => setIsMeasureModalOpen(false)}
                className="text-charcoal-light hover:text-charcoal"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Inside Mount 图示 */}
              <div className="flex flex-col">
                <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center rounded-md bg-cream-dark border-2 border-dashed border-border">
                  <span className="text-charcoal-light font-medium">Inside Mount Image Placeholder</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal">Inside Mount</h3>
                <p className="mt-2 text-sm text-charcoal-light leading-relaxed">
                  Measure the exact width and height <strong className="text-charcoal">inside</strong> the window frame. Do not make any deductions, our factory will do that for you.
                </p>
              </div>

              {/* Outside Mount 图示 */}
              <div className="flex flex-col">
                <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center rounded-md bg-cream-dark border-2 border-dashed border-border">
                  <span className="text-charcoal-light font-medium">Outside Mount Image Placeholder</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal">Outside Mount</h3>
                <p className="mt-2 text-sm text-charcoal-light leading-relaxed">
                  Measure the exact width and height of the area you want the shade to cover. We recommend adding <strong className="text-charcoal">2-3 inches</strong> to all sides for better light coverage.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMeasureModalOpen(false)}
              className="mt-10 w-full rounded-sm bg-charcoal py-4 text-sm text-white transition-colors hover:bg-charcoal/90"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
      {/* ------------------------- */}

      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-charcoal-light">
          Roller
        </p>
        <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">
          {productName}
        </h1>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl text-charcoal">
            ${totalPrice.toFixed(2)}
          </p>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-charcoal">
            ♡
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Step: Color */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-charcoal">Color</h3>
          <div className="flex flex-wrap gap-3">
            {["white", "linen", "beige", "grey", "charcoal"].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-10 w-10 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-charcoal ring-2 ring-charcoal/20 ring-offset-2"
                    : "border-transparent ring-1 ring-border hover:ring-charcoal/50"
                }`}
                style={{
                  backgroundColor:
                    color === "white" ? "#ffffff" :
                    color === "linen" ? "#e8dfd2" :
                    color === "beige" ? "#d5c9b8" :
                    color === "grey" ? "#b3b1ad" : "#4a4a4a",
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs capitalize text-charcoal-light">{selectedColor}</p>
        </div>

        {/* Step: Room Name */}
        <div>
           <div className="mb-1 flex items-center justify-between">
             <h3 className="text-sm font-medium text-charcoal">Room / Window Label</h3>
             <span className="text-xs text-charcoal-light">(Optional)</span>
           </div>
           <p className="mb-3 text-[11px] text-charcoal-light">
             Add a name (e.g. "Living Room Left") so we can label the box for easy installation.
           </p>
           <input
             type="text"
             value={roomName}
             onChange={(e) => setRoomName(e.target.value)}
             placeholder="e.g. Master Bedroom"
             className="w-full rounded-sm border border-border bg-cream px-3 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-charcoal"
             maxLength={30}
           />
        </div>

        {/* Step: Mount Type */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-charcoal">Mount Type</h3>
            {/* 视觉强化的 Measurement Guide 按钮 */}
            <button 
              onClick={() => setIsMeasureModalOpen(true)}
              className="flex items-center gap-1 text-xs text-charcoal underline underline-offset-4 transition-colors hover:text-charcoal-light"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              How to measure?
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMountType("inside")}
              className={`rounded-sm border py-3 text-sm transition-colors ${
                mountType === "inside"
                  ? "border-charcoal bg-cream-dark text-charcoal font-medium"
                  : "border-border bg-cream text-charcoal hover:border-charcoal/50"
              }`}
            >
              Inside Mount
            </button>
            <button
              onClick={() => setMountType("outside")}
              className={`rounded-sm border py-3 text-sm transition-colors ${
                mountType === "outside"
                  ? "border-charcoal bg-cream-dark text-charcoal font-medium"
                  : "border-border bg-cream text-charcoal hover:border-charcoal/50"
              }`}
            >
              Outside Mount
            </button>
          </div>
        </div>

        {/* Step: Size */}
        <div>
           <h3 className="mb-3 text-sm font-medium text-charcoal">Size</h3>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="mb-1 block text-xs text-charcoal-light">Width (in)</label>
               <div className="flex gap-2">
                 <input
                   type="number"
                   value={width}
                   onChange={(e) => setWidth(e.target.value)}
                   placeholder="0"
                   className="w-full rounded-sm border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-charcoal"
                 />
                 {/* Fraction dropdown explains the inches fraction */}
                 <select
                   value={widthFraction}
                   onChange={(e) => setWidthFraction(e.target.value)}
                   className="rounded-sm border border-border bg-cream px-2 py-2 text-sm text-charcoal outline-none focus:border-charcoal"
                 >
                   <option value="0">0"</option>
                   <option value="1/8">1/8"</option>
                   <option value="1/4">1/4"</option>
                   <option value="3/8">3/8"</option>
                   <option value="1/2">1/2"</option>
                   <option value="5/8">5/8"</option>
                   <option value="3/4">3/4"</option>
                   <option value="7/8">7/8"</option>
                 </select>
               </div>
             </div>
             
             <div>
               <label className="mb-1 block text-xs text-charcoal-light">Height (in)</label>
               <div className="flex gap-2">
                 <input
                   type="number"
                   value={height}
                   onChange={(e) => setHeight(e.target.value)}
                   placeholder="0"
                   className="w-full rounded-sm border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-charcoal"
                 />
                 <select
                   value={heightFraction}
                   onChange={(e) => setHeightFraction(e.target.value)}
                   className="rounded-sm border border-border bg-cream px-2 py-2 text-sm text-charcoal outline-none focus:border-charcoal"
                 >
                   <option value="0">0"</option>
                   <option value="1/8">1/8"</option>
                   <option value="1/4">1/4"</option>
                   <option value="3/8">3/8"</option>
                   <option value="1/2">1/2"</option>
                   <option value="5/8">5/8"</option>
                   <option value="3/4">3/4"</option>
                   <option value="7/8">7/8"</option>
                 </select>
               </div>
             </div>
           </div>
           
           <div className="mt-3 flex items-start gap-2 rounded-sm bg-cream-dark p-3">
             <span className="text-charcoal-light">ℹ️</span>
             <p className="text-[11px] leading-tight text-charcoal-light">
               All shades are custom made to your exact specifications. Please verify your measurements carefully, as custom orders cannot be returned or refunded.
             </p>
           </div>
        </div>

        {/* Step: Hardware Finish (带着图片占位符) */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-charcoal">Hardware Finish</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {HARDWARE_OPTIONS.map((hw) => (
              <button
                key={hw.id}
                onClick={() => setSelectedHardware(hw.id)}
                className={`flex flex-col items-center overflow-hidden rounded-sm border transition-colors ${
                  selectedHardware === hw.id
                    ? "border-charcoal bg-cream-dark ring-1 ring-charcoal"
                    : "border-border bg-white hover:border-charcoal/50"
                }`}
              >
                {/* 硬件图片占位区 */}
                <div className="flex aspect-video w-full items-center justify-center bg-cream text-[10px] text-charcoal-light border-b border-border">
                  {hw.label} Img
                </div>
                <div className="flex w-full items-center justify-between p-3">
                  <span className="text-xs font-medium text-charcoal">{hw.label}</span>
                  {hw.price > 0 && <span className="text-[10px] text-charcoal-light">+${hw.price}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step: Included Motor System (纯信息展示，图文并茂) */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-charcoal">Included Smart System</h3>
          <div className="rounded-sm border border-border bg-white p-4">
            <div className="mb-4 text-xs text-charcoal-light">
              Every shade comes standard with our Smart Home Motor Kit, including:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* 电机本体占位 */}
              <div className="flex flex-col items-center">
                <div className="mb-2 flex aspect-square w-full items-center justify-center rounded bg-cream-dark border border-border">
                  <span className="text-[10px] text-charcoal-light">Motor</span>
                </div>
                <span className="text-[10px] font-medium text-charcoal">Smart Motor</span>
              </div>
              {/* 遥控器占位 */}
              <div className="flex flex-col items-center">
                <div className="mb-2 flex aspect-square w-full items-center justify-center rounded bg-cream-dark border border-border">
                  <span className="text-[10px] text-charcoal-light">Remote</span>
                </div>
                <span className="text-[10px] font-medium text-charcoal">Remote</span>
              </div>
              {/* 充电线占位 */}
              <div className="flex flex-col items-center">
                <div className="mb-2 flex aspect-square w-full items-center justify-center rounded bg-cream-dark border border-border">
                  <span className="text-[10px] text-charcoal-light">Cable</span>
                </div>
                <span className="text-[10px] font-medium text-charcoal">Charge Cable</span>
              </div>
            </div>
            {/* 充电频率说明 */}
            <div className="mt-4 rounded bg-cream-dark p-2 text-center">
               <span className="text-[11px] text-charcoal-light">
                 🔋 Built-in battery lasts <strong className="text-charcoal font-medium">up to 6 months</strong> on a single charge.
               </span>
            </div>
          </div>
        </div>

        <button className="mt-8 w-full rounded-sm bg-charcoal px-8 py-4 text-sm font-medium tracking-wide text-white transition-colors hover:bg-charcoal/90">
          ADD TO CART • ${totalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
