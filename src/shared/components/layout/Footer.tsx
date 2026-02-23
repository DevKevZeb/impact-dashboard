import logoSrc from "@/assets/PEI ePulse Logo for WebApp.png";

export default function Footer() {
  return (
    <footer className="w-full text-white footer-color bg-[#1E3291] flex flex-col justify-center items-center py-6 text-md">
      <div className="w-5/7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 justify-center items-start mb-4">
        <div className="col-span-2 md:col-span-1 flex md:justify-center">
          <img src={logoSrc} alt="Pacific E-commerce Initiative Logo" className="h-34 w-auto"/>
        </div>
        <div>
          <label className="font-bold text-lg block mb-2">Our Location</label>
          <p className="md:text-md text-sm leading-relaxed">
            Pacific Islands Forum Secretariat<br/>
            Ratu Sukuna Road,<br/>
            Suva<br/>
            Fiji
          </p>
        </div>

        <div>
          <label className="font-bold text-lg block mb-2">Enquiries</label>
          <a href="mailto:ecommerce@forumsec.org" className="underline text-sm md:text-md" >
            ecommerce@forumsec.org
          </a>
        </div>
      </div>

      <div className="border-t border-slate-500 pt-4 text-center text-sm">
        2026 © Pacific E-commerce Initiative. All rights reserved.
      </div>
      </div>
    </footer>
  );
}
