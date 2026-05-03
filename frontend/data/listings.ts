export type Listing = {
  id: string;
  title: string;
  city: string;
  district: string;
  village: string;
  address: string;
  price: number;
  deposit: string;
  type: string;
  rating: number;
  distance: string;
  status: string;
  images: string[];
  amenities: string[];
  landlord: string;
  contact: string;
  description: string;
};

export const listings: Listing[] = [
  {
    id: "vientiane-villa-riverside",
    title: "ເຮືອນວິນລ່າທັນສະໄໝໃກ້ແມ່ນ້ຳ",
    city: "Vientiane",
    district: "Sisattanak",
    village: "Phonsinuan",
    address: "Ban Phonsinuan, Sisattanak, Vientiane Capital",
    price: 12500000,
    deposit: "2 months",
    type: "Villa",
    rating: 4.9,
    distance: "8 mins to That Luang",
    status: "Available now",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWmQ5hWzKugj-n26fEjT4VjPtnBkefBQSHPEhqyrpuGfC0oOrVFue4RenP_OxTGS6BK0_yeCGZcfxWYhr31T1yQd_FLMAqtBKO8zBQrY7hLrLztaAl94s9Wik0o1Mmt4yHCg84v0tU4QBRaJ184dx54RrbUgiBDzEpfjKTGwpa7sqrz8JQDBaHHu-3bYoRR6ARwFj4-E-HQeezcd3059tHlY0qgajS59PxOBF9-G3hZvsMARbZxWaQ5sBonXSYEHpNk7tX2kZ1Rkw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9h_XEEUHbAlocsq0tFStlcZoDgsmeGtGqUWRdIi8e81T52ItKV8tj9RXJPGh1WPliSfRwaxwuRWYZqrUJaabI3uHJESbpS_NSTSxSnWQUbazg3ShUHjJIC6E-1ZCfGNy0T2SrkykdrZAuWtM3eMjT2A3vKr3PH8nit_4xcFjbSNh_XzsULk14Htcn3s6hXeaXlFPokIxTklUcOrLrevrtLXGYNhF1qA-9xKZT7nCXuCjkCoBbB4UTrZH4sX5BznNk10DTEwA_hzs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXkW2Ro7pRhQDQtWmb98a5SqEuMS0Axy3fXpLMLJNUFTQeTM8YQ2gCnqIi7r2b1B5UQdFSGhXon39VfkXFTm3nBGoX7WHbT5tDn3vLLkvJpDbLtaFg381jKmCHmGxPmAbyOppCgB-7V9Yjrua7zsHnId7GOjfENO8rCr6ROK0MxwS8QHpeXMtfIJCA1bht5AgWCAQy9CgNuDjJNIfV2sKtg3mJVOsS2CZ1ij-pIhq4ThZT2hVxv8AlcYtjeu-eFvajTX5yWTtmnkw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Vqw2B6kBtTa1B8D0nIz5qJPMFex_3i5PsgV5CgKp_lxok14y7Q5Bc5gNSHeMltP1oNAWac7cXzP59TsoZ4p7cymbL46P3nsUcVfF3kD-owrA8gfuDs2E1AicCJiT_xDkDlSxQwwS05XnLuwnzl4AqwLn8KnZT14Bgn56v6INszlWTpcg-wZVT49mHYxwCKJ4BCIutHE2G4zakYY36kRwkdBYGZxerrHYK0uJyvb1HS28tcJEtwsalwfsLSbRPY09kjhDsqX0B0E",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGHr-8QqQ-wGCXu26gvac6Y4XOjso2I3FRf3tqm-hHUjslmRhzHoB5kyDBWBFBIYKRc0vTTehGIiP0MeP3ASHsNlFTaWr0OmK52c0zsZjdCq5H7TxWd41sidMQBEquvki07K3vca_fR7a3_Y5heQz5bZc_Vz25Sq5diNYk1Z1PKrVsnA5h0r0czK0GcpGrIfloOwj2YhvaozL-6CrT0gxG35ABWu2SZBC9-dWEfG4NGF8domhYOB58sEzUq3QcMIejgFAbO0dyt4A"
    ],
    amenities: ["Wi-Fi", "Parking", "Air conditioning", "Market nearby", "School nearby"],
    landlord: "Somxay Phommavong",
    contact: "+856 20 5555 0101",
    description:
      "Modern Lao villa with tropical light, spacious living room, secure parking, and an easy commute to the city center.",
  },
  {
    id: "vientiane-studio-center",
    title: "ສະຕູດິໂອສະອາດໃນໃຈກາງເມືອງ",
    city: "Vientiane",
    district: "Chanthabouly",
    village: "Watchan",
    address: "Ban Watchan, Chanthabouly, Vientiane Capital",
    price: 5200000,
    deposit: "1 month",
    type: "Studio",
    rating: 4.7,
    distance: "5 mins to Mekong riverside",
    status: "Ready to move in",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgWrZt3rUKJfRyQefQuAIzJ8TKkWGSkkXDzcQdTprEBmIjz-zTJp6g_dv6wORkSN5Dzsx02HghdNuqxYM7SUhviF-jCDSVFAnS-QsACY6wauUWqYt5xPFbW_dIGvisssvGd4l1ikLTbJZJnRSamClpgO6c11hUL5PQJZ1AVitIWDK2IAsY23Gs9Sd1QwPnHJgDBUfR-4u59hyb28ltfLqjDW8SnOTgHpS9EYRuI7cw1FJp8WtluFSqeAUyTU0bOaT38Onm-pJVrSM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATWyUZ4KiyqZ-bophnB_eKt5k4woRfPMYapg_D88sVbcCmyJkH_I-lWqC8xKEpKLBsEnEnh77iR9y2CxU2jJKKEHuMSMNOcMOg_kwJzcz8_mzQC6JscaxzgM46JEB_Q4imBBficcs0GQpIaKzOC-1t-3Q2VJQuZ7E8EXXcoIU2AG8piRsS5vKWZjSiNyhnHTxoaCQf0B0AMPLp02_8Ln6--7s2Nkt3WNNZC7jwqBF3h_FQz0UDz1qR60MuiVLWHfDTpOAfFD-K2ts",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChk447f9rdGvlohWgvZ0BgFWrPkrAMt2SgYOYXk0tyK8Z1JzNN--SMWWCXVXGpohH0eMK7NrF84mBEARUaijzYZGNLbnGW5tiaEDPQ-wmjQhegO2Dxko54PWooshRTZexHvlcNFfQusTW5YD4c3Az0VrARG-EUf2NM5ZN27aQkWSAKgDVLRZhH_drkiQkJbD0Qc275GQjtTyOnw4cmz6FA7VO3t4Q_XvzmVsMfDUVUO_uMq08TKNXRkB2-PTa9-HQ3Ok9qhLZEnM4"
    ],
    amenities: ["Wi-Fi", "Furnished", "Laundry", "Cafe nearby"],
    landlord: "Bounmy Real Estate",
    contact: "+856 20 5555 0102",
    description:
      "Compact but polished studio for students or young professionals, steps from cafes and the riverside night market.",
  },
  {
    id: "luang-prabang-garden-house",
    title: "ເຮືອນສວນສະງົບໃນຫຼວງພະບາງ",
    city: "Luang Prabang",
    district: "Historic Center",
    village: "Sakkaline",
    address: "Ban Sakkaline, Luang Prabang",
    price: 8900000,
    deposit: "2 months",
    type: "Garden House",
    rating: 4.8,
    distance: "10 mins to morning market",
    status: "Available next week",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLWT7XCoW0XOmAOqziV8AZc-CgdkeZLkHXXbR0dNELfjhX-dvH-qZfB5kd-PHlU5cNx5NqMEpfPgShvGHpJoXmNochS1Enn-Mk8MrynQQ99VqMZBKnr10HQys-tTe0J1HtNUxJuk0nZhM0ifD7teNWt7xGPSBtceE_qVNL83_6ETuB106oY0wGvMOep9Pb15U856cO1i90L2f9hpCC2lh8qjC57563SyITK2qsbpNU2NsybeniCkyISU9dy67HwWSJdA3mbksTfoY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8F3Ye9hOqrhFhA1oTkd_jUVW0xfTvOHKeIQA5cQ2RzNhyqQ7ejoJ663ByXIDpAObljqDAFSsNANlta289w-Q85X7IxU-bp5fs-eeWNiX8btihCZKXpD55rmt1x_OQ-oXf4eVEvmwBXJygMPXaqCQSrX_TM4jWSc6B1yJRisYxwY1x1QwppIRpEhRsmsaADobPwUdyspQSI1peVDBNrQclzcfLo4LDnZvWR4Q75JMr9H8qcTiT1ZMWDHRMWanPMiMIUvwKCdUUeNE",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEa3oJeru6Rc_ncAF58QrpmW2tes3024qw6U2jNSGxDUIRyII_NOjrTOj7pg4j_r2TjmPx-bDaNDfTXzBN1BlO_Y8AH6hgHDCxMANQ2HTa8Fhey_G_HuidWoC_Ew5i_q7tsZ4bz5nDTlEaColEZu-NyH9FYfWr7iHtFTtNZxWTqugafm5fUc3d9L0zE3D7wGo8dZNaMqjsF49jCERVsCaDxbpA2hHnMrSDSP0bv-qU2X7Wkk5DZRak4wiFWGnO0zVFLi5o5tpQJUE"
    ],
    amenities: ["Garden", "Wi-Fi", "Wood accents", "Bike parking"],
    landlord: "Noy Heritage Homes",
    contact: "+856 20 5555 0103",
    description:
      "Quiet garden home inspired by local craft details, ideal for longer stays in Luang Prabang's old quarter.",
  },
  {
    id: "pakse-family-home",
    title: "ເຮືອນຄອບຄົວໃກ້ສະໜາມບິນປາກເຊ",
    city: "Pakse",
    district: "Xaysetha",
    village: "Phabat",
    address: "Ban Phabat, Xaysetha, Pakse",
    price: 6800000,
    deposit: "1 month",
    type: "Family House",
    rating: 4.6,
    distance: "12 mins to airport",
    status: "Available now",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATWyUZ4KiyqZ-bophnB_eKt5k4woRfPMYapg_D88sVbcCmyJkH_I-lWqC8xKEpKLBsEnEnh77iR9y2CxU2jJKKEHuMSMNOcMOg_kwJzcz8_mzQC6JscaxzgM46JEB_Q4imBBficcs0GQpIaKzOC-1t-3Q2VJQuZ7E8EXXcoIU2AG8piRsS5vKWZjSiNyhnHTxoaCQf0B0AMPLp02_8Ln6--7s2Nkt3WNNZC7jwqBF3h_FQz0UDz1qR60MuiVLWHfDTpOAfFD-K2ts",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgWrZt3rUKJfRyQefQuAIzJ8TKkWGSkkXDzcQdTprEBmIjz-zTJp6g_dv6wORkSN5Dzsx02HghdNuqxYM7SUhviF-jCDSVFAnS-QsACY6wauUWqYt5xPFbW_dIGvisssvGd4l1ikLTbJZJnRSamClpgO6c11hUL5PQJZ1AVitIWDK2IAsY23Gs9Sd1QwPnHJgDBUfR-4u59hyb28ltfLqjDW8SnOTgHpS9EYRuI7cw1FJp8WtluFSqeAUyTU0bOaT38Onm-pJVrSM"
    ],
    amenities: ["Parking", "Pet friendly", "Air conditioning", "School nearby"],
    landlord: "Khamla Agency",
    contact: "+856 20 5555 0104",
    description:
      "Comfortable family home with a soft modern finish, fenced yard, and easy airport access for frequent travelers.",
  },
];

export function getListingById(id: string) {
  return listings.find((listing) => listing.id === id);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US").format(price);
}
