import { SearchBar } from "@/components/listings/SearchBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuATWyUZ4KiyqZ-bophnB_eKt5k4woRfPMYapg_D88sVbcCmyJkH_I-lWqC8xKEpKLBsEnEnh77iR9y2CxU2jJKKEHuMSMNOcMOg_kwJzcz8_mzQC6JscaxzgM46JEB_Q4imBBficcs0GQpIaKzOC-1t-3Q2VJQuZ7E8EXXcoIU2AG8piRsS5vKWZjSiNyhnHTxoaCQf0B0AMPLp02_8Ln6--7s2Nkt3WNNZC7jwqBF3h_FQz0UDz1qR60MuiVLWHfDTpOAfFD-K2ts"
          alt="Lao neighborhood"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172ad9] via-[#0f172a80] to-[#0f172a40]" />
      </div>
      <div className="page-shell relative py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            Lao / 中文 / English
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            ຄົ້ນຫາບ້ານ ແລະ ຫ້ອງພັກທີ່ເໝາະກັບຊີວິດຂອງທ່ານ
          </h1>
          <p className="max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Find rooms, houses, studios, and local neighborhoods in Laos with a modern search flow
            inspired by trusted rental platforms, but designed for Tiny House.
          </p>
        </div>
        <div className="mt-10">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
