const cities = [
  {
    city: "Vientiane",
    detail: "Capital comfort, embassies, schools, cafes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChk447f9rdGvlohWgvZ0BgFWrPkrAMt2SgYOYXk0tyK8Z1JzNN--SMWWCXVXGpohH0eMK7NrF84mBEARUaijzYZGNLbnGW5tiaEDPQ-wmjQhegO2Dxko54PWooshRTZexHvlcNFfQusTW5YD4c3Az0VrARG-EUf2NM5ZN27aQkWSAKgDVLRZhH_drkiQkJbD0Qc275GQjtTyOnw4cmz6FA7VO3t4Q_XvzmVsMfDUVUO_uMq08TKNXRkB2-PTa9-HQ3Ok9qhLZEnM4",
  },
  {
    city: "Luang Prabang",
    detail: "Heritage neighborhoods and garden homes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLWT7XCoW0XOmAOqziV8AZc-CgdkeZLkHXXbR0dNELfjhX-dvH-qZfB5kd-PHlU5cNx5NqMEpfPgShvGHpJoXmNochS1Enn-Mk8MrynQQ99VqMZBKnr10HQys-tTe0J1HtNUxJuk0nZhM0ifD7teNWt7xGPSBtceE_qVNL83_6ETuB106oY0wGvMOep9Pb15U856cO1i90L2f9hpCC2lh8qjC57563SyITK2qsbpNU2NsybeniCkyISU9dy67HwWSJdA3mbksTfoY",
  },
  {
    city: "Pakse",
    detail: "Spacious homes with calmer pace and value",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8F3Ye9hOqrhFhA1oTkd_jUVW0xfTvOHKeIQA5cQ2RzNhyqQ7ejoJ663ByXIDpAObljqDAFSsNANlta289w-Q85X7IxU-bp5fs-eeWNiX8btihCZKXpD55rmt1x_OQ-oXf4eVEvmwBXJygMPXaqCQSrX_TM4jWSc6B1yJRisYxwY1x1QwppIRpEhRsmsaADobPwUdyspQSI1peVDBNrQclzcfLo4LDnZvWR4Q75JMr9H8qcTiT1ZMWDHRMWanPMiMIUvwKCdUUeNE",
  },
];

export function PopularCities() {
  return (
    <section className="page-shell py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Cities</p>
        <h2 className="section-title mt-2">ຄົ້ນຫາຕາມເມືອງຍອດນິຍົມ</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cities.map((item) => (
          <div key={item.city} className="card-surface overflow-hidden p-0">
            <img src={item.image} alt={item.city} className="h-56 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-ink">{item.city}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
